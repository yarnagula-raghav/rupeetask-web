import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export const dynamic = 'force-dynamic';

// Initialize Firebase Admin if it hasn't been already
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

// TimeWall Postback API
// Typically expects: ?subId={user_id}&reward={amount}&signature={hash}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("subId") || searchParams.get("user_id");
    const rewardStr = searchParams.get("reward") || searchParams.get("amount");
    const signature = searchParams.get("signature") || searchParams.get("hash");
    
    // Validate signature once official secret key is received from TimeWall
    const TIMEWALL_SECRET = process.env.TIMEWALL_SECRET || "PENDING_KEY";
    
    if (!userId || !rewardStr) {
      return NextResponse.json({ status: "error", message: "Missing subId or reward" }, { status: 400 });
    }

    const amount = parseFloat(rewardStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ status: "error", message: "Invalid reward amount" }, { status: 400 });
    }

    const db = admin.firestore();

    // 1. Fetch user from Firestore
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    // 2. Update wallet balance
    const currentAds = userData?.balances?.ads || 0;
    
    await userRef.update({
      "balances.ads": currentAds + amount // Tracking TimeWall under general ad/offer earnings
    });

    // 3. Log to Admin Dashboard Live Activity Feed
    await db.collection("activity_logs").add({
      userId: userId,
      userName: userData?.name || "Anonymous User",
      userEmail: userData?.email || "Unknown",
      type: "TIMEWALL_OFFER",
      network: "TimeWall",
      amount: amount,
      timestamp: new Date()
    });

    // Return OK (1) which is standard for most postbacks to acknowledge receipt
    return new NextResponse("1", { status: 200 });

  } catch (error) {
    console.error("TimeWall Postback Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
