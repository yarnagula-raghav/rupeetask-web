"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const triggerSuccess = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {}
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#10b981', '#f59e0b', '#3b82f6']
  });
};

export default function Tasks() {
  const [activeTab, setActiveTab] = useState<"ads" | "surveys" | "apps" | "quiz">("ads");
  const { dailyProgress } = useWallet();

  return (
    <motion.section 
      id="view-tasks" 
      className="user-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-card task-workspace">
        {/* Navigation Tabs */}
        <div className="tabs-navigation" style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '8px' }}>
          <button
            className={`tab-btn ${activeTab === "ads" ? "active" : ""}`}
            onClick={() => setActiveTab("ads")}
            style={{ flexShrink: 0 }}
          >
            📺 Ads ({dailyProgress.videoAds}/10)
          </button>
          <button
            className={`tab-btn ${activeTab === "surveys" ? "active" : ""}`}
            onClick={() => setActiveTab("surveys")}
            style={{ flexShrink: 0 }}
          >
            📋 Surveys ({dailyProgress.surveys}/3)
          </button>
          <button
            className={`tab-btn ${activeTab === "apps" ? "active" : ""}`}
            onClick={() => setActiveTab("apps")}
            style={{ flexShrink: 0 }}
          >
            📱 Installs ({dailyProgress.appInstalls}/1)
          </button>
          <button
            className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
            style={{ flexShrink: 0 }}
          >
            🧠 Quiz ({dailyProgress.quiz}/1)
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "ads" && <AdsTask />}
        {activeTab === "surveys" && <SurveysTask />}
        {activeTab === "apps" && <AppInstallsTask />}
        {activeTab === "quiz" && <QuizTask />}
      </div>
    </motion.section>
  );
}

// ================= 1. Video Ads =================
function AdsTask() {
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [canClaim, setCanClaim] = useState(false);
  const startTimeRef = useRef<number>(0);
  const { addEarnings, incrementTaskProgress, dailyProgress } = useWallet();
  const maxQuota = 10;
  const isDone = dailyProgress.videoAds >= maxQuota;

  const startAd = () => {
    setIsWatching(true);
    setCanClaim(false);
    setTimeLeft(5);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatching && !canClaim) {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = 5 - elapsed;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          setCanClaim(true);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWatching, canClaim]);

  return (
    <div className="tab-content active">
      <div className="task-panel">
        <div className="task-instructions-card">
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "12px" }}>
            📺 Watch Video Ads
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Watch short video ads to complete your daily quota.
          </p>
          <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <strong>Progress:</strong> {dailyProgress.videoAds} / {maxQuota}
          </div>
        </div>

        <div className="task-execute-box">
          {isDone ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
              ✅ Daily Quota Completed!
            </div>
          ) : (
            <>
              {!isWatching && !canClaim && (
                <button className="btn-primary" onClick={startAd}>
                  🚀 Launch Ad Video
                </button>
              )}

              {isWatching && !canClaim && (
                <div className="ad-screen-mock" style={{ display: "block" }}>
                  <div className="ad-overlay-timer">{timeLeft}s remaining</div>
                  <div className="ad-video-title">AdSense Sponsored Content</div>
                  <div style={{ fontSize: "2.5rem", marginTop: "10px" }}>📺</div>
                </div>
              )}

              {canClaim && (
                <button className="btn-primary" onClick={() => { 
                  if (Date.now() - startTimeRef.current < 5000) {
                    alert("Security Alert: Invalid completion time detected.");
                    setIsWatching(false); setCanClaim(false); return;
                  }
                  setIsWatching(false); 
                  setCanClaim(false); 
                  addEarnings(0.50);
                  incrementTaskProgress("videoAds");
                  triggerSuccess();
                }}>
                  💸 Claim Earnings (₹0.50)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= 2. Surveys =================
function SurveysTask() {
  const { addEarnings, incrementTaskProgress, dailyProgress } = useWallet();
  const [loading, setLoading] = useState(false);
  const maxQuota = 3;
  const isDone = dailyProgress.surveys >= maxQuota;

  const handleSurvey = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addEarnings(2.50);
      incrementTaskProgress("surveys");
      triggerSuccess();
    }, 2000);
  };

  return (
    <div className="tab-content active">
      <div className="task-panel">
        <div className="task-instructions-card">
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "12px" }}>
            📋 Fill Surveys (CPX Research)
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Answer simple market research questions.
          </p>
          <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <strong>Progress:</strong> {dailyProgress.surveys} / {maxQuota}
          </div>
        </div>

        <div className="task-execute-box">
          {isDone ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
              ✅ Daily Quota Completed!
            </div>
          ) : (
            <button className="btn-primary" onClick={handleSurvey} disabled={loading}>
              {loading ? "Completing Survey..." : "📋 Start Survey (₹2.50)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= 3. App Installs =================
function AppInstallsTask() {
  const { addEarnings, incrementTaskProgress, dailyProgress } = useWallet();
  const [loading, setLoading] = useState(false);
  const maxQuota = 1;
  const isDone = dailyProgress.appInstalls >= maxQuota;

  const handleInstall = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addEarnings(10.0);
      incrementTaskProgress("appInstalls");
      triggerSuccess();
    }, 3000);
  };

  return (
    <div className="tab-content active">
      <div className="task-panel">
        <div className="task-instructions-card">
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "12px" }}>
            📱 App Installs (OGAds)
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Install and register on our partner applications.
          </p>
          <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <strong>Progress:</strong> {dailyProgress.appInstalls} / {maxQuota}
          </div>
        </div>

        <div className="task-execute-box">
          {isDone ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
              ✅ Daily Quota Completed!
            </div>
          ) : (
            <button className="btn-primary" onClick={handleInstall} disabled={loading}>
              {loading ? "Verifying Install..." : "📲 Install App (₹10.00)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= 4. Quiz =================
function QuizTask() {
  const { addEarnings, incrementTaskProgress, dailyProgress } = useWallet();
  const [loading, setLoading] = useState(false);
  const maxQuota = 1;
  const isDone = dailyProgress.quiz >= maxQuota;

  const handleQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addEarnings(1.00);
      incrementTaskProgress("quiz");
      triggerSuccess();
    }, 1500);
  };

  return (
    <div className="tab-content active">
      <div className="task-panel">
        <div className="task-instructions-card">
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "12px" }}>
            🧠 Answer Quiz
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Test your knowledge to earn a reward.
          </p>
          <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <strong>Progress:</strong> {dailyProgress.quiz} / {maxQuota}
          </div>
        </div>

        <div className="task-execute-box">
          {isDone ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
              ✅ Daily Quota Completed!
            </div>
          ) : (
            <button className="btn-primary" onClick={handleQuiz} disabled={loading}>
              {loading ? "Submitting Quiz..." : "✅ Answer Quiz (₹1.00)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
