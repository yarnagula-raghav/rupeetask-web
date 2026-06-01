import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if it hasn't been already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines with actual newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const status = searchParams.get("status");
  const userId = searchParams.get("user_id"); // This is the ext_user_id we passed to CPX
  const amountStr = searchParams.get("amount");
  const secureHash = searchParams.get("secure_hash");
  
  // Basic validation
  if (!userId || !amountStr || status !== "1") {
    // If status is not 1 (success), we just return 200 OK so CPX doesn't retry
    return NextResponse.json({ success: true, message: "Ignored non-success status or missing params" });
  }

  // A simple security check: Ensure CPX passes a secret key you configure in the dashboard
  const mySecret = process.env.CPX_POSTBACK_SECRET;
  if (mySecret && searchParams.get("secret") !== mySecret) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
  }

  try {
    const db = admin.firestore();
    const userRef = db.collection("users").doc(userId);
    
    // We run this inside a transaction to ensure safe balance updates
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("User does not exist!");
      }
      
      const userData = userDoc.data();
      const currentBalance = userData?.balance || 0;
      const currentLifetime = userData?.lifetimeEarnings || 0;
      const dailyProgress = userData?.dailyProgress || { videoAds: 0, surveys: 0, appInstalls: 0, spins: 0, quiz: 0 };
      
      // Update data
      transaction.update(userRef, {
        balance: currentBalance + amount,
        lifetimeEarnings: currentLifetime + amount,
        "dailyProgress.surveys": dailyProgress.surveys + 1
      });

      // Create an activity log for the admin dashboard
      const activityRef = db.collection("activity_logs").doc();
      transaction.set(activityRef, {
        type: "SURVEY_COMPLETED",
        userId: userId,
        userName: userData?.name || "Unknown User",
        userEmail: userData?.email || "Unknown Email",
        amount: amount,
        network: "CPX Research",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return NextResponse.json({ success: true, message: `Credited user ${userId} with ${amount}` });
  } catch (error) {
    console.error("Postback Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
