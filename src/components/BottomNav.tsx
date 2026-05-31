"use client";

import { motion } from "framer-motion";

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (t:string)=>void }) {
  const tabs = [
    { id: "dashboard", icon: "📊" },
    { id: "tasks", icon: "✅" },
    { id: "wallet", icon: "💸" },
    { id: "referral", icon: "🔗" },
    { id: "profile", icon: "👤" },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {activeTab === tab.id && (
            <motion.div layoutId="nav-pill" className="nav-pill-bg" />
          )}
        </button>
      ))}
    </div>
  );
}
