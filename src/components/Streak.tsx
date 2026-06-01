"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { useWallet } from "@/context/WalletContext";

export default function Streak() {
  const { streakCount, lastCheckInDate, claimDailyCheckIn } = useWallet();
  const [claiming, setClaiming] = useState(false);
  const currentStreak = streakCount;
  
  const todayStr = new Date().toDateString();
  const canClaim = lastCheckInDate !== todayStr;

  const handleClaim = async () => {
    setClaiming(true);
    const success = await claimDailyCheckIn();
    setClaiming(false);
    if (success) {
      alert("🎉 Check-in successful! Bonus added to your wallet.");
    }
  };

  return (
    <motion.section 
      id="view-streak" 
      className="user-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card streak-board" style={{ marginBottom: "32px" }}>
        <div className="streak-header">
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>🔥 Your 30-Day Earning Streak</h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
              Maintain active check-ins. If you miss a day, your streak multiplier resets.
            </p>
          </div>
          <div className="streak-metrics">
            <div className="streak-metric-pill highlight">
              Active Streak: <span>{currentStreak}</span> Days
            </div>
            <div className="streak-metric-pill">
              Active Bonus: <span>1.0x</span>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-light)", padding: "16px", borderRadius: "var(--border-radius-md)", marginBottom: "24px", fontSize: "0.85rem", lineHeight: 1.5 }}>
          🎁 <strong>Streak Rewards:</strong>
          <ul style={{ marginLeft: "20px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <li>📍 <strong>Day 7 Milestone:</strong> Unlocks a <span style={{ color: "var(--color-success)", fontWeight: 600 }}>₹10 bonus</span> to your wallet!</li>
            <li>📍 <strong>Day 14 Milestone:</strong> Unlocks a <span style={{ color: "var(--color-success)", fontWeight: 600 }}>₹20 bonus</span>!</li>
            <li>📍 <strong>Day 21 Milestone:</strong> Unlocks a <span style={{ color: "var(--color-success)", fontWeight: 600 }}>₹40 bonus</span>!</li>
            <li>📍 <strong>Day 30 Milestone:</strong> Unlocks the ultimate <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>₹80 bonus</span>!</li>
          </ul>
        </div>

        {/* Claim Button */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          {canClaim ? (
            <motion.button 
              className="btn-primary" 
              style={{ fontSize: "1.2rem", padding: "16px 32px", width: "100%", background: "linear-gradient(90deg, #10b981 0%, #059669 100%)", fontWeight: "bold", boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? "Claiming..." : "🎁 Claim Daily Check-In!"}
            </motion.button>
          ) : (
            <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "var(--border-radius-md)", color: "#10b981", fontWeight: "bold" }}>
              ✅ You have already checked in today! Come back tomorrow!
            </div>
          )}
        </div>

        {/* 30-Day Grid */}
        <div className="streak-grid">
          {Array.from({ length: 30 }).map((_, idx) => {
            const day = idx + 1;
            const isMilestone = day === 7 || day === 14 || day === 21 || day === 30;
            return (
              <motion.div
                key={day}
                className={`streak-day ${isMilestone ? "milestone-day" : ""} ${day <= currentStreak ? "completed" : ""}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ scale: 1.1 }}
                style={{ 
                  background: day <= currentStreak ? "var(--color-success)" : undefined,
                  borderColor: day <= currentStreak ? "var(--color-success)" : undefined
                }}
              >
                <div className="day-number">Day {day}</div>
                {isMilestone && <div className="day-reward" style={{ color: day <= currentStreak ? "white" : undefined }}>Box</div>}
                {day <= currentStreak && <div style={{ marginTop: '4px', fontSize: '1.2rem' }}>✅</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
