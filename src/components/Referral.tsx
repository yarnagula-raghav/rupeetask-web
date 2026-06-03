"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";

export default function Referral() {
  const { user } = useAuth();
  const { referralsCount, referralsEarned } = useWallet();
  const [copied, setCopied] = useState(false);
  const referralCode = user ? `RT-${user.uid.substring(0, 8).toUpperCase()}` : "RT-LOADING";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.section
      id="view-referral"
      className="user-view active"
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="referral-card">
        <h3>🔗 Invite Friends, Earn ₹10 + 5% Forever!</h3>
        <p>
          Share your unique referral code. When friends sign up, you get a flat ₹10 bonus. Plus, you will earn a <strong>5% commission on all their earnings for life</strong>, deposited directly to your Combined Wallet!
        </p>

        <div className="referral-code-box">
          <code id="referral-code">{referralCode}</code>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="copy-btn"
            onClick={handleCopy}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </motion.button>
        </div>

        <div className="referral-stats">
          <div className="referral-stat">
            <div className="ref-num">{referralsCount}</div>
            <div className="ref-lbl">Friends Invited</div>
          </div>
          <div className="referral-stat">
            <div className="ref-num">{referralsCount}</div>
            <div className="ref-lbl">Active Earners</div>
          </div>
          <div className="referral-stat">
            <div className="ref-num">₹{referralsEarned.toFixed(2)}</div>
            <div className="ref-lbl">Bonus Earned</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: "20px", padding: "24px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>💰 Referral Reward: ₹10 + 5% Commission</h3>
        <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>
          For every friend who signs up using your code, you earn a flat ₹10 bonus. Additionally, whenever they complete a task, you instantly receive 5% of what they earn—forever!
        </p>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px" }}>🚀 Share via</h3>
        <div className="profile-actions-grid">
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => alert("WhatsApp share")}>
            <span className="action-icon">💬</span> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => alert("Telegram share")}>
            <span className="action-icon">✈️</span> Telegram
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => alert("Twitter share")}>
            <span className="action-icon">🐦</span> Twitter/X
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={handleCopy}>
            <span className="action-icon">🔗</span> Copy Link
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
