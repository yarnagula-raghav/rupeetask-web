"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthOverlay() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { user, login, signup } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "signup" && !agreeTerms) {
      setError("You must agree to the Terms and Conditions to create an account.");
      return;
    }
    setLoading(true);
    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        await signup(name, email, password, referralCodeInput);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" id="login-overlay" style={{ display: "flex" }}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <motion.img
              src="/icon.png"
              alt="RupeeTask Logo"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              style={{ width: "120px", height: "120px", borderRadius: "28px", boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)" }}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: "2.5rem", fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              RupeeTask
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem" }}
            >
              Earn legally. Withdraw securely.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ marginTop: "30px" }}
            >
              <div className="splash-loader">
                <div className="splash-loader-bar" />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            className="login-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <img
                src="/icon.png"
                alt="RupeeTask"
                style={{ width: "56px", height: "56px", borderRadius: "14px", boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)" }}
              />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "4px" }}>
                RupeeTask
              </h1>
              <p className="login-subtitle">
                Legal, secure, and zero-investment online earnings.
              </p>
            </div>

            <div className="auth-tabs">
              <button
                className={`auth-tab-btn ${tab === "signin" ? "active" : ""}`}
                onClick={() => setTab("signin")}
              >
                Log In
              </button>
              <button
                className={`auth-tab-btn ${tab === "signup" ? "active" : ""}`}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-container">
              {error && (
                <div className="auth-error-msg visible" style={{ display: 'block', marginBottom: '10px' }}>
                  {error}
                </div>
              )}

              {tab === "signup" && (
                <>
                  <div className="auth-form-group">
                    <label className="auth-label">Full Name</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">Referral Code (Optional)</label>
                    <input
                      type="text"
                      className="auth-input"
                      placeholder="RT-XXXXXX"
                      value={referralCodeInput}
                      onChange={(e) => setReferralCodeInput(e.target.value)}
                      style={{ textTransform: "uppercase" }}
                    />
                  </div>
                </>
              )}

              <div className="auth-form-group">
                <label className="auth-label">Email Address</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <label className="auth-label">Password</label>
                  {tab === "signin" && (
                    <a href="#" className="forgot-password-link">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder={tab === "signup" ? "Min. 12 characters" : "•••••••••"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {tab === "signup" && (
                <div className="auth-form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--color-brand)" }}
                  />
                  <label htmlFor="terms-checkbox" style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", cursor: "pointer", userSelect: "none" }}>
                    I agree to the <span onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} style={{ color: "var(--color-brand)", textDecoration: "underline" }}>Terms and Conditions</span>
                  </label>
                </div>
              )}

              <button type="submit" className={`auth-submit-btn ${loading ? "loading" : ""}`} disabled={loading}>
                <span className="btn-text">
                  {tab === "signin" ? "Sign In" : "Sign Up"}
                </span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              style={{
                backgroundColor: "#060814",
                padding: "30px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                maxWidth: "500px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                color: "white"
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "20px" }}>Terms of Service</h2>
              
              <p style={{ marginBottom: "15px", lineHeight: "1.6", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                By accessing or using RupeeTask, you agree to be bound by these Terms. If you disagree with any part of the terms, you do not have permission to access the Service.
              </p>
              
              <h3 style={{ marginTop: "20px", marginBottom: "8px", fontSize: "1.1rem" }}>Earning and Payouts</h3>
              <p style={{ marginBottom: "15px", lineHeight: "1.6", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                Users may earn digital currency by completing tasks, surveys, and offers provided by our third-party advertising partners. All earnings are subject to verification. We reserve the right to withhold payouts, reverse earnings, or ban accounts if we detect fraudulent activity, VPN usage, proxy usage, or automated bots.
              </p>
              
              <h3 style={{ marginTop: "20px", marginBottom: "8px", fontSize: "1.1rem" }}>User Conduct</h3>
              <p style={{ marginBottom: "25px", lineHeight: "1.6", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, Services, or general business of RupeeTask.
              </p>
              
              <button
                type="button"
                onClick={() => { setShowTermsModal(false); setAgreeTerms(true); }}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "var(--color-brand)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                I Agree & Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
