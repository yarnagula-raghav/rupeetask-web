"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
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
  const [activeTab, setActiveTab] = useState<"ads" | "surveys" | "apps" | "monlix" | "theoremreach">("ads");
  const { dailyProgress } = useWallet();
  const clickCount = useRef(0);

  const handleTabClick = (tab: "ads" | "surveys" | "apps" | "monlix" | "theoremreach") => {
    clickCount.current += 1;
    if (clickCount.current % 3 === 0) {
      window.open("https://www.effectivecpmnetwork.com/k1ye76y66?key=999459b25434f9e34bb4e0a0927dd366", "_blank");
    }
    setActiveTab(tab);
  };

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
        <div className="tabs-navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingBottom: '8px' }}>
          <button
            className={`tab-btn ${activeTab === "ads" ? "active" : ""}`}
            onClick={() => handleTabClick("ads")}
            style={{ flexShrink: 0 }}
          >
            📺 Ads ({dailyProgress.videoAds}/10)
          </button>
          <button
            className={`tab-btn ${activeTab === "surveys" ? "active" : ""}`}
            onClick={() => handleTabClick("surveys")}
            style={{ flexShrink: 0 }}
          >
            📋 Surveys ({dailyProgress.surveys}/3)
          </button>
          <button
            className={`tab-btn ${activeTab === "apps" ? "active" : ""}`}
            onClick={() => handleTabClick("apps")}
            style={{ flexShrink: 0 }}
          >
            📱 Installs ({dailyProgress.appInstalls}/1)
          </button>


          <button
            className={`tab-btn ${activeTab === "monlix" ? "active" : ""}`}
            onClick={() => handleTabClick("monlix")}
            style={{ flexShrink: 0, border: "1px solid #10b981", color: "#10b981" }}
          >
            🤑 Monlix
          </button>
          <button
            className={`tab-btn ${activeTab === "theoremreach" ? "active" : ""}`}
            onClick={() => handleTabClick("theoremreach")}
            style={{ flexShrink: 0, border: "1px solid #a855f7", color: "#a855f7" }}
          >
            📊 TheoremReach
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "ads" && <AdsTask />}
        {activeTab === "surveys" && <SurveysTask />}
        {activeTab === "apps" && <AppInstallsTask />}


        {activeTab === "monlix" && <MonlixTask />}
        {activeTab === "theoremreach" && <TheoremReachTask />}
      </div>
    </motion.section>
  );
}

// ================= Adsterra Component =================
const AdsterraBanner = () => {
  React.useEffect(() => {
    if (!document.getElementById("adsterra-script-dae73bfcfc3c34cf577e22bcae422257")) {
      const script = document.createElement("script");
      script.id = "adsterra-script-dae73bfcfc3c34cf577e22bcae422257";
      script.type = "text/javascript";
      script.dataset.cfasync = "false";
      script.src = "//pl29606250.effectivecpmnetwork.com/dae73bfcfc3c34cf577e22bcae422257/invoke.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return <div id="container-dae73bfcfc3c34cf577e22bcae422257" style={{ minHeight: '60px', width: '100%', display: 'flex', justifyContent: 'center', margin: '16px 0', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}></div>;
};

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
          
          {/* Adsterra Real Ad Injection */}
          <AdsterraBanner />

          {isDone && (
            <div style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', marginBottom: '16px' }}>
              ✅ Daily Quota Completed! Keep earning!
            </div>
          )}
          {!isWatching && !canClaim && (
            <button className="btn-primary" onClick={startAd}>
              🚀 Launch Ad Video
            </button>
          )}

          {isWatching && !canClaim && (
            <div className="ad-screen-mock" style={{ display: "block", background: "transparent", border: "1px dashed var(--color-accent)" }}>
              <div className="ad-overlay-timer" style={{ position: "relative", top: 0, right: 0, margin: "0 auto", width: "fit-content", background: "var(--color-accent)", padding: "4px 12px", borderRadius: "12px", fontSize: "0.9rem" }}>
                ⏳ Please view the Ad above for {timeLeft} seconds to claim your reward!
              </div>
            </div>
          )}

          {canClaim && (
            <button className="btn-primary" style={{ background: "linear-gradient(90deg, #10b981 0%, #059669 100%)", animation: "pulse 2s infinite" }} onClick={() => { 
              if (Date.now() - startTimeRef.current < 5000) {
                alert("Security Alert: Invalid completion time detected.");
                setIsWatching(false); setCanClaim(false); return;
              }
              setIsWatching(false); 
              setCanClaim(false); 
              addEarnings(0.01);
              incrementTaskProgress("videoAds");
              triggerSuccess();
            }}>
              🎁 Claim ₹0.01 Reward!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= 2. Surveys =================
function SurveysTask() {
  const { user } = useAuth();
  
  const providers = [
    { name: "CPX Research", color: "#3b82f6", payout: "₹15-40 / survey", status: "Active" },
    { name: "Pollfish", color: "#10b981", payout: "₹10-25 / survey", status: "Pending API" },
    { name: "Bitlabs", color: "#f59e0b", payout: "₹15-35 / survey", status: "Pending API" },
    { name: "Theorem Reach", color: "#8b5cf6", payout: "₹10-30 / survey", status: "Pending API" },
  ];

  return (
    <div className="tab-content active">
      <div className="task-panel" style={{ background: "transparent", border: "none", padding: 0 }}>
        
        {providers.map((p, i) => (
          <div key={i} className="glass-card" style={{ marginBottom: "16px", padding: "16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${p.color}` }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>📋 {p.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Earn {p.payout}</p>
            </div>
            <button 
              className="btn-primary" 
              style={{ background: p.status === "Active" ? p.color : "rgba(255,255,255,0.1)", color: p.status === "Active" ? "white" : "var(--color-text-secondary)" }}
              onClick={() => {
                if (p.status === "Active" && user) {
                  window.open(`https://offers.cpx-research.com/index.php?app_id=33407&ext_user_id=${user.uid}`, '_blank');
                } else {
                  alert(`${p.name} is awaiting API Approval!`);
                }
              }}
            >
              {p.status === "Active" ? "Open Wall" : "Pending Approval"}
            </button>
          </div>
        ))}
        
        {/* Passive AdBlock between tasks */}
        <AdsterraBanner />
        
      </div>
    </div>
  );
}

// ================= 3. App Installs =================
function AppInstallsTask() {
  const providers = [
    { name: "OGAds Offerwall", color: "#ef4444", payout: "₹25-50 / install", status: "Pending API" },
    { name: "AdGate Media", color: "#3b82f6", payout: "₹20-40 / install", status: "Pending API" },
    { name: "Lootably", color: "#10b981", payout: "₹15-30 / install", status: "Pending API" },
    { name: "AdScend Media", color: "#f59e0b", payout: "₹10-25 / install", status: "Pending API" },
  ];

  return (
    <div className="tab-content active">
      <div className="task-panel" style={{ background: "transparent", border: "none", padding: 0 }}>
        
        {providers.map((p, i) => (
          <div key={i} className="glass-card" style={{ marginBottom: "16px", padding: "16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${p.color}` }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>📱 {p.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Earn {p.payout}</p>
            </div>
            <button 
              className="btn-primary" 
              style={{ background: "rgba(255,255,255,0.1)", color: "var(--color-text-secondary)" }}
              onClick={() => alert(`${p.name} is awaiting API Approval!`)}
            >
              Pending Approval
            </button>
          </div>
        ))}
        
        {/* Passive AdBlock between tasks */}
        <AdsterraBanner />
        
      </div>
    </div>
  );
}




// ================= 6. Monlix =================
function MonlixTask() {
  return (
    <div className="tab-content active">
      <div className="task-panel">
        <div className="task-instructions-card">
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "12px", color: "#10b981" }}>
            🤑 Monlix Offerwall (NEW)
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Access premium surveys, play games, and install apps for high payouts!
          </p>
        </div>

        <div className="task-execute-box">
          <button 
            className="btn-primary"
            style={{ background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }}
            onClick={() => alert("Monlix is currently pending network approval. Once your API keys are generated, this button will go live automatically!")}
          >
            🤑 Open Monlix (Pending Approval)
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= 5. TheoremReach Task =================
function TheoremReachTask() {
  const { user } = useAuth();
  
  if (!user) return <p>Please log in to view this offerwall.</p>;

  const trApiKey = "9e9dc6f2227928fa8bbaeaf4b1db";
  const iframeUrl = `https://theoremreach.com/respondent_entry/header?api_key=${trApiKey}&user_id=${user.uid}`;

  return (
    <div className="tab-content active" style={{ height: "700px" }}>
      <iframe 
        src={iframeUrl}
        width="100%" 
        height="100%" 
        frameBorder="0"
        style={{ border: "none", borderRadius: "8px", background: "#fff" }}
        allow="camera; microphone"
      ></iframe>
    </div>
  );
}
