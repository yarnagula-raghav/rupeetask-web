"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, email: "r***v@gmail.com", earnings: "₹4,250.00", badge: "🥇" },
    { rank: 2, email: "s***a@yahoo.com", earnings: "₹3,800.00", badge: "🥈" },
    { rank: 3, email: "m***k@outlook.com", earnings: "₹3,150.00", badge: "🥉" },
    { rank: 4, email: "p***a@gmail.com", earnings: "₹2,900.00", badge: "🏅" },
    { rank: 5, email: "k***n@gmail.com", earnings: "₹2,600.00", badge: "🏅" },
  ];

  return (
    <motion.section 
      id="view-leaderboard" 
      className="user-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "8px" }}>🏆 Global Leaderboard</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: "24px" }}>
          Top earners on RupeeTask this week. Complete tasks and build your streak to climb the ranks!
        </p>

        <div id="leaderboard-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {leaderboardData.map((user, idx) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "12px",
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ fontSize: "1.5rem" }}>{user.badge}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>{user.email}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                    Rank #{user.rank}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: "var(--color-success)", fontSize: "1.1rem" }}>
                {user.earnings}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
