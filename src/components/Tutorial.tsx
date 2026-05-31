"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TUTORIAL_STEPS = [
  {
    icon: "🎉",
    title: "Welcome to RupeeTask!",
    desc: "Earn real money by watching ads, completing tasks, and referring friends. 100% legal, zero investment required."
  },
  {
    icon: "✅",
    title: "Complete Earning Tasks",
    desc: "Go to 'Earning Tasks' to watch short ads (₹1.80 each), YouTube videos (₹3.60), upload AI training videos (₹50), or install apps (₹6-12)."
  },
  {
    icon: "🔥",
    title: "Daily Check-In & Streak",
    desc: "Check in every day to maintain your streak! Each daily login earns you ₹20-₹40 bonus. Don't miss a day or your streak resets!"
  },
  {
    icon: "💰",
    title: "Wallet & Withdrawal",
    desc: "Your earnings go into category wallets. Once a category hits its threshold (₹800-₹1600), it transfers to your Combined Wallet for withdrawal via UPI or Bank Transfer."
  },
  {
    icon: "🔗",
    title: "Refer & Earn ₹70",
    desc: "Share your unique referral code with friends. When they sign up and complete tasks, you earn ₹70 per referral deposited to your wallet!"
  }
];

export default function Tutorial() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const isNew = localStorage.getItem("is_new_signup");
    if (isNew) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.removeItem("is_new_signup");
  };

  const handleNext = () => {
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  const currentStep = TUTORIAL_STEPS[step];

  return (
    <div className="onboarding-overlay">
      <motion.div
        className="onboarding-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="onboarding-icon">{currentStep.icon}</div>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="onboarding-dots">
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === step ? "active" : ""}`} />
          ))}
        </div>

        <button className="onboarding-next-btn" onClick={handleNext}>
          {step < TUTORIAL_STEPS.length - 1 ? "Next →" : "Get Started! 🚀"}
        </button>
        <button className="onboarding-skip" onClick={handleClose}>
          Skip Tutorial
        </button>
      </motion.div>
    </div>
  );
}
