"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import AuthOverlay from "@/components/AuthOverlay";
import Dashboard from "@/components/Dashboard";
import Tasks from "@/components/Tasks";
import Wallet from "@/components/Wallet";
import Leaderboard from "@/components/Leaderboard";
import Referral from "@/components/Referral";
import Profile from "@/components/Profile";
import Streak from "@/components/Streak";
import Tutorial from "@/components/Tutorial";
import GlobalAdOverlay from "@/components/GlobalAdOverlay";

const TAB_INFO: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Overview Dashboard", subtitle: "Track your legal earnings, streaks, and withdrawal thresholds." },
  streak: { title: "30-Day Streak", subtitle: "Maintain your daily check-in streak to earn bonus rewards." },
  tasks: { title: "Earning Tasks", subtitle: "Complete tasks to earn money in different categories." },
  wallet: { title: "Wallet & Cashout", subtitle: "Withdraw your earnings via UPI, Bank Transfer, or Paytm." },
  leaderboard: { title: "Leaderboard", subtitle: "See the top earners on the platform." },
  referral: { title: "Refer & Earn", subtitle: "Invite friends and earn ₹70 per referral." },
  profile: { title: "My Profile", subtitle: "View and manage your account details." },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabInfo = TAB_INFO[activeTab] || TAB_INFO.dashboard;

  return (
    <>
      <AuthOverlay />
      <GlobalAdOverlay />
      <Tutorial />

      {/* Desktop Sidebar (hidden on mobile via CSS) */}
      <div className="desktop-sidebar-wrapper">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className="main-content">
        <Header title={tabInfo.title} subtitle={tabInfo.subtitle} />

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <Dashboard key="dashboard" />}
          {activeTab === "streak" && <Streak key="streak" />}
          {activeTab === "tasks" && <Tasks key="tasks" />}
          {activeTab === "wallet" && <Wallet key="wallet" />}
          {activeTab === "leaderboard" && <Leaderboard key="leaderboard" />}
          {activeTab === "referral" && <Referral key="referral" />}
          {activeTab === "profile" && <Profile key="profile" />}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
