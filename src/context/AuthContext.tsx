"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string, referralCodeInput?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (name: string, email: string, pass: string, referralCodeInput?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    const uid = newUser.uid;
    const myReferralCode = `RT-${uid.substring(0, 8).toUpperCase()}`;

    let referredByUid = "";

    if (referralCodeInput) {
      const formattedCode = referralCodeInput.trim().toUpperCase();
      try {
        const { collection, query, where, getDocs, doc, runTransaction } = await import("firebase/firestore");
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referralCode", "==", formattedCode));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const referrerDoc = querySnapshot.docs[0];
          referredByUid = referrerDoc.id;
          
          const referrerData = referrerDoc.data();
          const refMode = referrerData.referralMode || "flat";
          
          if (refMode === "flat") {
            const currentReferrerBalances = referrerData.balances || { ads: 0, youtube: 0, aiVideo: 0, appInstall: 0 };
            const newReferrerBalances = {
              ...currentReferrerBalances,
              ads: (currentReferrerBalances.ads || 0) + 70,
            };
            
            const referrerDocRef = doc(db, "users", referredByUid);
            await runTransaction(db, async (transaction) => {
              transaction.update(referrerDocRef, {
                balances: newReferrerBalances,
                referralsCount: (referrerData.referralsCount || 0) + 1,
                referralsEarned: (referrerData.referralsEarned || 0) + 70,
              });
            });
          }
        }
      } catch (err) {
        console.error("Error processing referral signup:", err);
      }
    }

    const { doc, setDoc } = await import("firebase/firestore");
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      balances: {
        ads: 0,
        youtube: 0,
        aiVideo: 0,
        appInstall: 0,
      },
      referralCode: myReferralCode,
      referralMode: "flat",
      referredBy: referredByUid,
      referredByCode: referralCodeInput || "",
      referralsCount: 0,
      referralsEarned: 0,
    });

    localStorage.setItem("is_new_signup", "true");
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
