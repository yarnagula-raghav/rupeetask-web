import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

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

const db = admin.firestore();

// Monlix Postback API
// Typically expects: ?userId={userId}&rewardValue={rewardValue}&secretKey={secretKey}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || searchParams.get("subId");
    const rewardStr = searchParams.get("rewardValue") || searchParams.get("amount");
    const secretKey = searchParams.get("secretKey") || searchParams.get("hash");
    
    // Validate secret key once official secret key is received from Monlix
    const MONLIX_SECRET = process.env.MONLIX_SECRET || "PENDING_KEY";
    
    if (!userId || !rewardStr) {
      return NextResponse.json({ status: "error", message: "Missing userId or rewardValue" }, { status: 400 });
    }

    const amount = parseFloat(rewardStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ status: "error", message: "Invalid reward amount" }, { status: 400 });
    }

    // 1. Fetch user from Firestore
    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    // 2. Update wallet balance
    const currentSurveys = userData?.balances?.surveys || 0;
    
    await userRef.update({
      "balances.surveys": currentSurveys + amount // Tracking Monlix under surveys/offers
    });

    // 3. Log to Admin Dashboard Live Activity Feed
    await db.collection("activity_logs").add({
      userId: userId,
      userName: userData?.name || "Anonymous User",
      userEmail: userData?.email || "Unknown",
      type: "MONLIX_OFFER",
      network: "Monlix",
      amount: amount,
      timestamp: new Date()
    });

    // Return OK
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Monlix Postback Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
