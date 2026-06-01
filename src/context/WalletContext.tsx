"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, onSnapshot, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type CategoryKey = "ads" | "youtube" | "aiVideo" | "appInstall";

export interface DailyProgress {
  date: string;
  videoAds: number;
  surveys: number;
  appInstalls: number;
  spins: number;
  quiz: number;
  login: number;
}

interface WalletContextType {
  balance: number;
  lifetimeEarnings: number;
  lastCheckInDate: string | null;
  dailyProgress: DailyProgress;
  streakCount: number;
  incrementTaskProgress: (taskType: keyof Omit<DailyProgress, 'date'>) => Promise<void>;
  registerGlobalClick: () => void;
  showGlobalAd: boolean;
  setShowGlobalAd: (val: boolean) => void;
  addEarnings: (amount: number) => Promise<void>;
  claimDailyCheckIn: () => Promise<boolean>;
  requestWithdrawal: (amount: number, method: string, details: string) => Promise<boolean>;
  getTotalUserEarnings: () => number;
  getGrossPlatformRevenue: () => number;
  getAdminShare: () => number;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);
  const [referredBy, setReferredBy] = useState<string>("");

  const todayStr = new Date().toDateString();
  const defaultProgress: DailyProgress = { date: todayStr, videoAds: 0, surveys: 0, appInstalls: 0, spins: 0, quiz: 0, login: 0 };
  
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(defaultProgress);
  const [streakCount, setStreakCount] = useState<number>(0);
  
  // Global Ad State
  const [globalClickCount, setGlobalClickCount] = useState(0);
  const [showGlobalAd, setShowGlobalAd] = useState(false);

  const registerGlobalClick = () => {
    setGlobalClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        setShowGlobalAd(true);
        return 0;
      }
      return newCount;
    });
  };

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setLifetimeEarnings(0);
      setLastCheckInDate(null);
      setReferredBy("");
      setDailyProgress(defaultProgress);
      setStreakCount(0);
      return;
    }

    // Subscribe to Firestore doc: users/{uid}
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.balance !== undefined) {
          setBalance(data.balance);
        } else if (data.balances) {
          // Fallback migration logic for old data format
          const oldTotal = (data.balances.ads || 0) + (data.balances.youtube || 0) + (data.balances.aiVideo || 0) + (data.balances.appInstall || 0);
          setBalance(oldTotal);
        }
        
        if (data.lifetimeEarnings !== undefined) {
          setLifetimeEarnings(data.lifetimeEarnings);
        } else {
          setLifetimeEarnings(data.balance || 0);
        }
        
        if (data.lastCheckInDate) {
          setLastCheckInDate(data.lastCheckInDate);
        }
        
        if (data.referredBy) {
          setReferredBy(data.referredBy);
        }

        if (data.streakCount !== undefined) {
          setStreakCount(data.streakCount);
        }

        if (data.dailyProgress) {
          if (data.dailyProgress.date === todayStr) {
            setDailyProgress(data.dailyProgress);
          } else {
            // New day, reset progress but write it back
            setDailyProgress(defaultProgress);
            updateDoc(userDocRef, { dailyProgress: defaultProgress });
          }
        }
      } else {
        // Create initial document
        const myReferralCode = `RT-${user.uid.substring(0, 8).toUpperCase()}`;
        setDoc(userDocRef, {
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          balance: 0,
          lifetimeEarnings: 0,
          lastCheckInDate: null,
          createdAt: new Date().toISOString(),
          referralCode: myReferralCode,
          referralMode: "flat",
          referredBy: "",
          referredByCode: "",
          referralsCount: 0,
          referralsEarned: 0,
          dailyProgress: defaultProgress,
          streakCount: 0
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const incrementTaskProgress = async (taskType: keyof Omit<DailyProgress, 'date'>) => {
    if (!user) return;
    const newProgress = { ...dailyProgress, [taskType]: dailyProgress[taskType] + 1 };
    setDailyProgress(newProgress);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { dailyProgress: newProgress });
  };

  const addEarnings = async (amount: number) => {
    if (!user) return;
    
    // Optimistic update
    const newBalance = balance + amount;
    const newLifetime = lifetimeEarnings + amount;
    setBalance(newBalance);
    setLifetimeEarnings(newLifetime);
    
    // Write to Firestore
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      balance: newBalance,
      lifetimeEarnings: newLifetime
    });

    // 5% lifetime commission to referrer
    if (referredBy) {
      try {
        const { getDoc, runTransaction } = await import("firebase/firestore");
        const referrerDocRef = doc(db, "users", referredBy);
        const referrerSnap = await getDoc(referrerDocRef);
        
        if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data();
          const refMode = referrerData.referralMode || "flat";
          
          if (refMode === "percent") {
            const commission = amount * 0.05; // 5% flat commission forever
            if (commission > 0) {
              const currentBalance = referrerData.balance || 0;
              const currentLifetime = referrerData.lifetimeEarnings || currentBalance;
              
              await runTransaction(db, async (transaction) => {
                transaction.update(referrerDocRef, {
                  balance: currentBalance + commission,
                  lifetimeEarnings: currentLifetime + commission,
                  referralsEarned: (referrerData.referralsEarned || 0) + commission,
                });
              });
            }
          }
        }
      } catch (err) {
        console.error("Error processing referral commission:", err);
      }
    }
  };

  const claimDailyCheckIn = async (): Promise<boolean> => {
    if (!user) return false;
    
    const today = new Date();
    const todayStr = today.toDateString();
    
    if (lastCheckInDate === todayStr) {
      return false; // Already checked in today
    }
    
    // Check if they missed a day to maintain the streak
    let newStreak = 1;
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      
      // Calculate difference in days (ignoring hours)
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        // They checked in exactly yesterday
        newStreak = streakCount + 1;
      } else {
        // They missed a day (or more), reset streak to 1
        newStreak = 1;
      }
    }

    let bonus = (Math.random() * 2) + 0.5; // Base small bonus between 0.5 and 2.5
    
    // Milestone Bonuses
    if (newStreak === 7) bonus += 10;
    else if (newStreak === 14) bonus += 20;
    else if (newStreak === 21) bonus += 40;
    else if (newStreak === 30) bonus += 80;
    else if (newStreak > 30) {
      newStreak = 1; // reset streak after 30 days
      bonus += 100; // Grand reset bonus
    }
    
    // Optimistic update
    const newBalance = balance + bonus;
    const newLifetime = lifetimeEarnings + bonus;
    setBalance(newBalance);
    setLifetimeEarnings(newLifetime);
    setLastCheckInDate(todayStr);
    setStreakCount(newStreak);
    
    // Also mark login task as done
    const newProgress = { ...dailyProgress, login: 1 };
    setDailyProgress(newProgress);
    
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      balance: newBalance,
      lifetimeEarnings: newLifetime,
      lastCheckInDate: todayStr,
      streakCount: newStreak,
      dailyProgress: newProgress
    });
    
    return true;
  };

  const requestWithdrawal = async (amount: number, method: string, details: string): Promise<boolean> => {
    if (!user || balance < amount) return false;
    
    // Deduct from balance
    const newBalance = balance - amount;
    setBalance(newBalance);
    
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      balance: newBalance
    });
    
    // Create withdrawal request
    await addDoc(collection(db, "withdrawals"), {
      userId: user.uid,
      userName: user.displayName || user.email?.split("@")[0] || "User",
      userEmail: user.email,
      amount: amount,
      method: method,
      details: details,
      status: "pending",
      createdAt: new Date().toISOString()
    });
    
    return true;
  };

  const getTotalUserEarnings = () => {
    return balance;
  };

  // Admin Math: User earns 30% of the total revenue. 
  // Total Revenue = User Earnings / 0.3
  const getGrossPlatformRevenue = () => {
    const userEarnings = getTotalUserEarnings();
    return userEarnings === 0 ? 0 : userEarnings / 0.3;
  };

  const getAdminShare = () => {
    return getGrossPlatformRevenue() * 0.7;
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        lifetimeEarnings,
        lastCheckInDate,
        dailyProgress,
        streakCount,
        incrementTaskProgress,
        registerGlobalClick,
        showGlobalAd,
        setShowGlobalAd,
        addEarnings,
        claimDailyCheckIn,
        requestWithdrawal,
        getTotalUserEarnings,
        getGrossPlatformRevenue,
        getAdminShare,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
