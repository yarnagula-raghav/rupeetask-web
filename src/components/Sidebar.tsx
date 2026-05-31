"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains("light-theme")) {
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove("light-theme");
      setIsLight(false);
    } else {
      document.body.classList.add("light-theme");
      setIsLight(true);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Overview Dashboard", icon: "📊" },
    { id: "streak", label: "30-Day Streak", icon: "🔥" },
    { id: "tasks", label: "Earning Tasks", icon: "✅" },
    { id: "wallet", label: "Wallet & Cashout", icon: "💸" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { id: "referral", label: "Refer & Earn", icon: "🔗" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <>
      {/* Dark overlay backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="logo-container">
          <img
            src="/icon.png"
            alt="RupeeTask"
            style={{ width: "38px", height: "38px", borderRadius: "12px", boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" }}
          />
          <div>
            <div className="logo-text">RupeeTask</div>
            <span className="logo-badge">🇮🇳 LEGAL ONLY</span>
          </div>
        </div>

        <nav className="nav-links">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <button>
                {tab.icon} {tab.label}
              </button>
            </li>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              style={{
                flex: 1,
                padding: "8px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--border-radius-sm)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "0.85rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span id="theme-icon">{isLight ? "🌙" : "☀️"}</span>{" "}
              <span id="theme-text">{isLight ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
