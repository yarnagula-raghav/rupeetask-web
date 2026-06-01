import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

export const dynamic = 'force-dynamic';

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
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid") || searchParams.get("user_id");
  const reward = searchParams.get("reward") || searchParams.get("amount");
  
  if (!uid || !reward) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const amountNum = parseFloat(reward);
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    
    await userRef.update({
      balance: admin.firestore.FieldValue.increment(amountNum),
      lifetimeEarnings: admin.firestore.FieldValue.increment(amountNum)
    });

    // TheoremReach expects '1' on success
    return new NextResponse("1", { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("TheoremReach postback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
