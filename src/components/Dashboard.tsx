"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const SPIN_PRIZES = ["₹1", "₹2", "₹5", "₹3", "₹10", "₹1", "₹2", "₹5"];

const AdSenseDashboardBanner = () => {
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ gridColumn: "1 / -1", padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✨ Premium Sponsor</span>
      </div>
      <div style={{ minHeight: '100px', width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <ins className="adsbygoogle"
             style={{ display: "block", width: "100%" }}
             data-ad-client="ca-pub-2054262696231339"
             data-ad-slot="9269984965"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </motion.div>
  );
};


export default function Dashboard() {
  const { user } = useAuth();
  const { balance, lifetimeEarnings, lastCheckInDate, addEarnings, claimDailyCheckIn, dailyProgress, setShowGlobalAd, incrementTaskProgress } = useWallet();
  const [checkedIn, setCheckedIn] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    setCheckedIn(lastCheckInDate === today);
  }, [lastCheckInDate]);
  const isTasksCompleted = 
    dailyProgress.videoAds >= 10 &&
    dailyProgress.surveys >= 3 &&
    dailyProgress.appInstalls >= 1 &&
    dailyProgress.spins >= 1 &&
    dailyProgress.quiz >= 1;

  const handleCheckIn = async () => {
    if (checkedIn || !isTasksCompleted) return;
    
    // Trigger Pre-Roll Ad before Check In
    setShowGlobalAd(true);

    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {} // Ignore if on web without haptics
    
    // Slight delay to allow ad to trigger
    setTimeout(async () => {
      const success = await claimDailyCheckIn();
      if (success) {
        setCheckedIn(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#6366f1']
        });
      }
    }, 500);
  };

  const handleSpinClick = () => {
    if (dailyProgress.spins >= 1) {
      alert("You have already used your daily spin!");
      return;
    }
    // Pre-Roll Ad before showing the wheel
    setShowGlobalAd(true);
    setTimeout(() => {
      setShowSpin(true);
    }, 500);
  };

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {}

    setTimeout(async () => {
      const prize = SPIN_PRIZES[Math.floor(Math.random() * SPIN_PRIZES.length)];
      setSpinResult(prize);
      setSpinning(false);
      incrementTaskProgress("spins");
      
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (e) {}

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#ec4899', '#3b82f6']
      });
      
      const amount = parseInt(prize.replace("₹", ""));
      addEarnings(amount);
    }, 2000);
  };

  return (
    <motion.section
      id="view-dashboard"
      className="user-view active"
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {/* Daily Check-In Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="glass-card"
        style={{
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center",
          background: checkedIn
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)"
            : "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)",
          borderColor: checkedIn ? "rgba(16, 185, 129, 0.5)" : "rgba(245, 158, 11, 0.5)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
            {checkedIn ? `✅ Checked In!` : `📅 Daily Check-In`}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            {!isTasksCompleted && !checkedIn 
              ? "Complete all daily tasks first!" 
              : checkedIn ? "Come back tomorrow!" : "Earn ₹0.20-₹5.00 daily!"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: checkedIn || !isTasksCompleted ? 1 : 1.05 }}
          whileTap={{ scale: checkedIn || !isTasksCompleted ? 1 : 0.95 }}
          className="btn-primary"
          style={{
            padding: "10px 20px",
            fontWeight: 700,
            opacity: checkedIn || !isTasksCompleted ? 0.6 : 1,
            cursor: checkedIn || !isTasksCompleted ? "not-allowed" : "pointer",
            background: checkedIn ? "var(--color-success)" : undefined,
          }}
          onClick={handleCheckIn}
          disabled={checkedIn || !isTasksCompleted}
        >
          {checkedIn ? "Done ✓" : !isTasksCompleted ? "Locked 🔒" : "Check In"}
        </motion.button>
      </motion.div>

      {/* Spin Wheel Banner */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="glass-card"
        style={{
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
          borderColor: "rgba(168, 85, 247, 0.5)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
            🎰 Daily Lucky Spin
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
            Spin the wheel every day to win cash bonuses!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: dailyProgress.spins >= 1 ? 1 : 1.05 }}
          whileTap={{ scale: dailyProgress.spins >= 1 ? 1 : 0.95 }}
          className="btn-primary"
          style={{ 
            padding: "10px 20px", 
            fontWeight: 700, 
            animation: dailyProgress.spins >= 1 ? "none" : "pulse-border 2s infinite",
            opacity: dailyProgress.spins >= 1 ? 0.6 : 1,
            cursor: dailyProgress.spins >= 1 ? "not-allowed" : "pointer",
          }}
          onClick={handleSpinClick}
          disabled={dailyProgress.spins >= 1}
        >
          {dailyProgress.spins >= 1 ? "Used Today ✓" : "Spin Now"}
        </motion.button>
      </motion.div>

      {/* Spin Wheel Popup */}
      <AnimatePresence>
        {showSpin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 5000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => !spinning && setShowSpin(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                maxWidth: "380px",
                width: "100%",
                textAlign: "center",
                padding: "32px",
                border: "1px solid rgba(168, 85, 247, 0.4)",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px" }}>🎰 Lucky Spin</h2>
              
              <div style={{
                width: "200px",
                height: "200px",
                margin: "0 auto 24px",
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #f59e0b, #10b981, #3b82f6, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: spinning ? "btn-spin 0.3s linear infinite" : "none",
                boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
              }}>
                <div style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "var(--bg-base)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: spinResult ? "2rem" : "1rem",
                  fontWeight: 800,
                  color: spinResult ? "var(--color-success)" : "var(--color-text-secondary)",
                }}>
                  {spinning ? "..." : spinResult || "TAP"}
                </div>
              </div>

              {spinResult ? (
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-success)", marginBottom: "12px" }}>
                    🎉 You won {spinResult}!
                  </p>
                  <button className="btn-primary" style={{ width: "100%" }} onClick={() => setShowSpin(false)}>
                    Collect & Close
                  </button>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: "100%" }} onClick={handleSpin} disabled={spinning}>
                  {spinning ? "Spinning..." : "🎰 SPIN THE WHEEL"}
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Wallet Overviews */}
      <div className="dashboard-grid">
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ gridColumn: "1 / -1", borderLeft: "4px solid var(--color-brand)" }}>
          <div className="stat-info">
            <span className="stat-label">🏆 Total Lifetime Earnings</span>
            <div className="stat-value" style={{ color: "var(--color-brand)" }}>₹{(lifetimeEarnings || 0).toFixed(2)}</div>
            <span className="stat-subtext">Total amount of money you have earned on RupeeTask</span>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "var(--color-brand)" }}>🏆</div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ gridColumn: "1 / -1" }}>
          <div className="stat-info">
            <span className="stat-label">💸 Current Withdrawable Balance</span>
            <div className="stat-value">₹{balance.toFixed(2)}</div>
            <span className="stat-subtext">Withdraw anytime after reaching ₹1,000 on the 1st of every month</span>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "var(--color-success)" }}>💸</div>
        </motion.div>

        {/* Passive Ad Injection (Below Balance) */}
        <AdSenseDashboardBanner />

        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ gridColumn: "1 / -1" }}>
          <div className="stat-info">
            <span className="stat-label">🔥 Daily Login Bonus</span>
            <div className="stat-value">₹0.20 - ₹5</div>
            <span className="stat-subtext">Check in daily to earn bonus</span>
          </div>
          <div className="stat-icon-wrapper" style={{ color: "var(--color-accent)" }}>⚡</div>
        </motion.div>
      </div>
    </motion.section>
  );
}
