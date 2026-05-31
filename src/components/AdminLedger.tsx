"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

export default function AdminLedger() {
  const { getGrossPlatformRevenue, getAdminShare, getTotalUserEarnings } = useWallet();

  const totalRevenue = getGrossPlatformRevenue();
  const adminShare = getAdminShare();
  const userEarnings = getTotalUserEarnings();

  const progressPercent = totalRevenue > 0 ? (adminShare / totalRevenue) * 100 : 0;

  return (
    <motion.section 
      id="view-admin" 
      className="admin-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        
        {/* Total Ad Revenue */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-brand)" }}>
          <div className="stat-info">
            <span className="stat-label">💰 Total Gross Ad Revenue</span>
            <div className="stat-value" id="admin-total-revenue">₹{totalRevenue.toFixed(2)}</div>
            <span className="stat-subtext">Money received from corporate advertisers</span>
          </div>
        </motion.div>

        {/* Platform Share */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-success)" }}>
          <div className="stat-info">
            <span className="stat-label">📈 Platform Profit (70%)</span>
            <div className="stat-value" id="admin-platform-profit">₹{adminShare.toFixed(2)}</div>
            <span className="stat-subtext">Net earnings for RupeeTask</span>
          </div>
        </motion.div>

        {/* User Payout Liability */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-warning)" }}>
          <div className="stat-info">
            <span className="stat-label">💳 User Payout Liability (30%)</span>
            <div className="stat-value" id="admin-user-liability">₹{userEarnings.toFixed(2)}</div>
            <span className="stat-subtext">Money owed to users</span>
          </div>
        </motion.div>
      </div>

      {/* Visual Split Bar */}
      <div className="glass-card" style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>📊 Platform Revenue Split (70/30 Model)</h3>
        
        <div style={{ height: "24px", width: "100%", background: "rgba(0,0,0,0.3)", borderRadius: "12px", overflow: "hidden", display: "flex", border: "1px solid var(--border-light)" }}>
          <motion.div 
            id="admin-bar-platform" 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ background: "linear-gradient(90deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}
          >
            Platform (70%)
          </motion.div>
          <motion.div 
            id="admin-bar-users" 
            initial={{ width: 0 }}
            animate={{ width: "30%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ background: "linear-gradient(90deg, #f59e0b, #d97706)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}
          >
            Users (30%)
          </motion.div>
        </div>
      </div>

      {/* Task Verification Hub */}
      <div className="glass-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>🔍 Task Verification Hub</h3>
          <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", background: "rgba(0,0,0,0.3)", padding: "4px 12px", borderRadius: "20px" }}>
            Pending Review: <strong style={{ color: "#fff" }}>3</strong>
          </span>
        </div>
        
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px solid var(--border-light)", overflow: "hidden" }}>
          
          {/* Item 1 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>🤖 AI Video Dataset</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                User: user123 • Submitted: 10 mins ago
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: "rgba(52, 211, 153, 0.2)", color: "#34d399", border: "1px solid #34d399", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Approve</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: "rgba(248, 113, 113, 0.2)", color: "#f87171", border: "1px solid #f87171", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Reject</motion.button>
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>📱 Short Ad Click</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
                User: anon_77 • Submitted: 1 hr ago
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: "rgba(52, 211, 153, 0.2)", color: "#34d399", border: "1px solid #34d399", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Approve</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: "rgba(248, 113, 113, 0.2)", color: "#f87171", border: "1px solid #f87171", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>Reject</motion.button>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
