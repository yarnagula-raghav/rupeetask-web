"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { X, PlayCircle, ExternalLink } from "lucide-react";

const AdsterraGlobalBanner = () => {
  useEffect(() => {
    if (!document.getElementById("adsterra-script-global-76664a52f883381fb41cc64b7769cd22")) {
      const script = document.createElement("script");
      script.id = "adsterra-script-global-76664a52f883381fb41cc64b7769cd22";
      script.type = "text/javascript";
      script.dataset.cfasync = "false";
      script.src = "//pl29627501.effectivecpmnetwork.com/76664a52f883381fb41cc64b7769cd22/invoke.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return <div id="container-76664a52f883381fb41cc64b7769cd22" style={{ minHeight: '60px', width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}></div>;
};

export default function GlobalAdOverlay() {
  const { showGlobalAd, setShowGlobalAd, registerGlobalClick } = useWallet();
  const [countdown, setCountdown] = useState(5);

  // Global click tracker attached to document
  useEffect(() => {
    const handleClick = () => {
      // Don't count clicks if an ad is already showing
      if (!showGlobalAd) {
        registerGlobalClick();
      }
    };

    document.addEventListener("click", handleClick, true); // true for capture phase
    return () => document.removeEventListener("click", handleClick, true);
  }, [showGlobalAd, registerGlobalClick]);

  // Simulated ad countdown
  useEffect(() => {
    if (showGlobalAd) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showGlobalAd]);

  return (
    <AnimatePresence>
      {showGlobalAd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <div style={{ textAlign: "center", width: "90%", maxWidth: "450px", padding: "24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "16px", color: "var(--text-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <ExternalLink size={20} color="var(--color-accent)" /> Sponsor Advertisement
            </h2>
            
            {/* Inject Real Adsterra Ad Here */}
            <div style={{ marginBottom: '24px' }}>
              <AdsterraGlobalBanner />
            </div>
            
            <button
              onClick={() => setShowGlobalAd(false)}
              disabled={countdown > 0}
              style={{
                width: "100%",
                padding: "16px",
                background: countdown > 0 ? "rgba(255,255,255,0.1)" : "var(--primary)",
                color: countdown > 0 ? "var(--text-muted)" : "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: countdown > 0 ? "not-allowed" : "pointer"
              }}
            >
              {countdown > 0 ? `Skip Ad in ${countdown}s` : "Close Ad"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
