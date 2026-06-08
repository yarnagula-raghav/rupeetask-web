import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import * as admin from "firebase-admin";

export const dynamic = 'force-dynamic';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export async function GET(request: Request) {
  try {
    const urlObj = new URL(request.url);
    
    // Extract query parameters
    const userId = urlObj.searchParams.get("player_id");
    const amountStr = urlObj.searchParams.get("amount");
    const payoutStr = urlObj.searchParams.get("payout");
    const transactionId = urlObj.searchParams.get("transaction_id");
    const verifier = urlObj.searchParams.get("verifier");

    // 1. Basic validation of parameters
    if (!userId || !amountStr || !transactionId || !verifier) {
      console.warn("[AdGem Postback] Missing required parameters:", { userId, amountStr, transactionId, verifier });
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.warn("[AdGem Postback] Invalid amount:", amountStr);
      return NextResponse.json({ success: false, error: "Invalid reward amount" }, { status: 400 });
    }

    // 2. Validate Security Signature (Verifier)
    const adgemSecret = process.env.ADGEM_POSTBACK_SECRET;
    if (!adgemSecret) {
      console.error("[AdGem Postback] ADGEM_POSTBACK_SECRET is not set in environment variables.");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // Reconstruct the client-facing requested URL (crucial on proxies like Vercel)
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || urlObj.host;
    const fullUrl = `${proto}://${host}${urlObj.pathname}${urlObj.search}`;

    // Strip the &verifier=... or ?verifier=... parameter to get the source data
    const sourceUrl = fullUrl
      .replace(`&verifier=${verifier}`, "")
      .replace(`?verifier=${verifier}`, "");

    // Calculate HMAC-SHA256 hash using the AdGem secret key
    const calculatedHash = createHmac("sha256", adgemSecret)
      .update(sourceUrl)
      .digest("hex");

    if (calculatedHash !== verifier) {
      console.warn("[AdGem Postback] Signature mismatch!", {
        received: verifier,
        calculated: calculatedHash,
        sourceUrl: sourceUrl
      });
      return NextResponse.json({ success: false, error: "Unauthorized: Signature mismatch" }, { status: 401 });
    }

    const db = admin.firestore();

    // 3. Database Transaction (Safe Wallet Update + De-duplication)
    const userRef = db.collection("users").doc(userId);
    const txRef = db.collection("adgem_transactions").doc(transactionId);

    const result = await db.runTransaction(async (transaction) => {
      // Check if transaction has already been processed
      const txDoc = await transaction.get(txRef);
      if (txDoc.exists) {
        return { alreadyProcessed: true };
      }

      // Check if user exists
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("USER_NOT_FOUND");
      }

      const userData = userDoc.data();
      const currentBalance = userData?.balance || 0;
      const currentLifetime = userData?.lifetimeEarnings || 0;
      const dailyProgress = userData?.dailyProgress || { videoAds: 0, surveys: 0, appInstalls: 0, spins: 0, quiz: 0 };

      // Update user wallet and daily task stats
      transaction.update(userRef, {
        balance: currentBalance + amount,
        lifetimeEarnings: currentLifetime + amount,
        "dailyProgress.appInstalls": (dailyProgress.appInstalls || 0) + 1
      });

      // Log the processed transaction to prevent duplicate claims
      transaction.set(txRef, {
        userId: userId,
        amount: amount,
        payoutUsd: payoutStr ? parseFloat(payoutStr) : 0,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Log in general activity logs for live feed
      const activityRef = db.collection("activity_logs").doc();
      transaction.set(activityRef, {
        type: "APP_INSTALL_COMPLETED",
        userId: userId,
        userName: userData?.name || "Unknown User",
        userEmail: userData?.email || "Unknown Email",
        amount: amount,
        network: "AdGem",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      return { alreadyProcessed: false };
    });

    if (result.alreadyProcessed) {
      console.info(`[AdGem Postback] Transaction ${transactionId} already processed. Acknowledging with success.`);
      return NextResponse.json({ success: true, message: "Transaction already processed" });
    }

    console.info(`[AdGem Postback] Successfully credited user ${userId} with ${amount} points from transaction ${transactionId}`);
    return NextResponse.json({ success: true, message: "Transaction processed successfully" });

  } catch (error: any) {
    console.error("[AdGem Postback] Error processing postback:", error);
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
