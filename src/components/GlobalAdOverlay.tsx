"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { X, PlayCircle } from "lucide-react";

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
          <div style={{ textAlign: "center", maxWidth: "400px", padding: "20px" }}>
            <PlayCircle size={64} color="var(--primary)" style={{ margin: "0 auto 24px auto" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", color: "white" }}>Sponsor Advertisement</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
              Please wait while we load our sponsors to keep RupeeTask free.
              <br /><br />
              <span style={{ fontSize: "0.85rem", color: "var(--secondary)" }}>(In production, an AdSense/AdMob interstitial will appear here)</span>
            </p>
            
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
