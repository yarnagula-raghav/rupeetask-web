import { NextResponse } from "next/server";
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
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("user_id"); // {subid} passed from iframe
    const amountStr = searchParams.get("amount"); // {points} earned
    const transactionId = searchParams.get("transaction_id"); // {transid} unique conversion id
    const secret = searchParams.get("secret"); // secret password for verification

    // 1. Basic Validation
    if (!userId || !amountStr || !transactionId || !secret) {
      console.warn("[OGAds Postback] Missing parameters:", { userId, amountStr, transactionId, secret });
      return new NextResponse("Missing Parameters", { status: 400 });
    }

    // 2. Secret Verification
    const mySecret = process.env.OGADS_POSTBACK_SECRET;
    if (!mySecret || secret !== mySecret) {
      console.warn("[OGAds Postback] Unauthorized request, secret mismatch.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      console.warn("[OGAds Postback] Invalid amount:", amountStr);
      return new NextResponse("Invalid Amount", { status: 400 });
    }

    const db = admin.firestore();

    // 3. Database Transaction (Wallet Credit + De-duplication)
    const userRef = db.collection("users").doc(userId);
    const txRef = db.collection("ogads_transactions").doc(transactionId);

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

      // Update user wallet and daily stats
      transaction.update(userRef, {
        balance: currentBalance + amount,
        lifetimeEarnings: currentLifetime + amount,
        "dailyProgress.appInstalls": (dailyProgress.appInstalls || 0) + 1
      });

      // Log the processed transaction to prevent duplicates
      transaction.set(txRef, {
        userId: userId,
        amount: amount,
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
        network: "OGAds",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      return { alreadyProcessed: false };
    });

    if (result.alreadyProcessed) {
      console.info(`[OGAds Postback] Transaction ${transactionId} already processed. Acknowledging.`);
      return new NextResponse("OK", { status: 200 });
    }

    console.info(`[OGAds Postback] Credited user ${userId} with ${amount} points from transaction ${transactionId}`);
    return new NextResponse("OK", { status: 200 });

  } catch (error: any) {
    console.error("[OGAds Postback] Error:", error);
    if (error.message === "USER_NOT_FOUND") {
      return new NextResponse("User Not Found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
