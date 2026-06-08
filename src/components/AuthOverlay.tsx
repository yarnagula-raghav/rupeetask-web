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
            key="landing"
            className="landing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <div className="hero-grid">
              {/* Left Side: Headline & Value Prop */}
              <div className="hero-text-side">
                <span className="hero-badge">🇮🇳 India's #1 Rewards Platform</span>
                <h1 className="hero-headline">
                  Earn Real Pocket Money. <span>Zero Investment</span> Required.
                </h1>
                <p className="hero-subtext">
                  Join thousands of Indian students and young adults earning daily Paytm cash, UPI rewards, and bank transfers by doing simple online digital tasks in your spare time.
                </p>
                <div className="hero-bullets">
                  <div className="bullet-item">
                    <span className="bullet-icon">🛡️</span>
                    <span><strong>100% Legal & Safe:</strong> Safe task tracking, direct payouts, and zero financial risk.</span>
                  </div>
                  <div className="bullet-item">
                    <span className="bullet-icon">⚡</span>
                    <span><strong>Instant Withdrawals:</strong> Cash out straight to UPI, Paytm, or your bank account.</span>
                  </div>
                  <div className="bullet-item">
                    <span className="bullet-icon">🎁</span>
                    <span><strong>Gamified Earnings:</strong> Build daily streaks and spin the lucky wheel to multiply earnings.</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Auth Card */}
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <div className="login-card" style={{ margin: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <img
                      src="/icon.png"
                      alt="RupeeTask"
                      style={{ width: "56px", height: "56px", borderRadius: "14px", boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)" }}
                    />
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "4px" }}>
                      RupeeTask
                    </h2>
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
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <section style={{ width: "100%" }}>
              <h2 className="landing-section-title">How RupeeTask Works</h2>
              <p className="landing-section-subtitle">Start earning your daily pocket money in 3 simple steps.</p>
              <div className="how-it-works-grid">
                <div className="step-card">
                  <div className="step-badge">1</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Register for Free</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    Create a free account in 1 minute using your email. No initial capital or fees required.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-badge">2</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Complete Micro-Tasks</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    Take surveys, download popular mobile apps, spin the lucky wheel, and claim daily check-in bonuses.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-badge">3</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Instant Withdrawals</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    Once you hit the threshold, cash out directly into your Paytm wallet, UPI ID, or bank account.
                  </p>
                </div>
              </div>
            </section>

            {/* Features & Benefits */}
            <section style={{ width: "100%" }}>
              <h2 className="landing-section-title">Why Choose RupeeTask?</h2>
              <p className="landing-section-subtitle">We offer the most secure and rewarding user experience in the industry.</p>
              <div className="features-grid">
                <div className="landing-feature-card glass-card">
                  <span style={{ fontSize: "2rem" }}>🚫</span>
                  <h3>Zero-Investment Model</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    RupeeTask is 100% free. We will never ask you for any activation fee, credit card information, or premium deposits.
                  </p>
                </div>
                <div className="landing-feature-card glass-card">
                  <span style={{ fontSize: "2rem" }}>🛡️</span>
                  <h3>100% Safe & Secure</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    Your data is secure with us. We use advanced verification protocols to track and credit your task payouts accurately.
                  </p>
                </div>
                <div className="landing-feature-card glass-card">
                  <span style={{ fontSize: "2rem" }}>💰</span>
                  <h3>High-Payout Partners</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    We partner with global market research networks like CPX Research, TheoremReach, and AdGem to bring you the highest-paying tasks.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section style={{ width: "100%" }}>
              <h2 className="landing-section-title">Frequently Asked Questions</h2>
              <p className="landing-section-subtitle">Find answers to the most common queries about RupeeTask.</p>
              <div className="faq-list">
                <div className="faq-item">
                  <h3 className="faq-question">Is RupeeTask legal and safe to use?</h3>
                  <p className="faq-answer">
                    Yes! RupeeTask is 100% legal and secure. We work with verified advertising networks and pay out real money directly to our users. We do not participate in any get-rich-quick or pyramid schemes.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="faq-question">How much money can I earn daily?</h3>
                  <p className="faq-answer">
                    Your earnings depend on the number of tasks, surveys, and app installs you complete. Active users easily make between ₹100 to ₹500 daily during their spare time.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="faq-question">What are the withdrawal methods?</h3>
                  <p className="faq-answer">
                    You can easily withdraw your earned balance via UPI (like PhonePe, Google Pay, or BHIM), Paytm wallet transfer, or direct bank transfer. Payouts are manually audited and processed.
                  </p>
                </div>
                <div className="faq-item">
                  <h3 className="faq-question">Can I create multiple accounts to earn more?</h3>
                  <p className="faq-answer">
                    No. To prevent fraud, we strictly enforce a limit of **ONE account per person, household, and IP address**. Using VPNs, proxies, or multiple accounts will result in a permanent ban and forfeiture of balance.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
              <div>&copy; {new Date().getFullYear()} RupeeTask. All rights reserved. Made in India.</div>
              <div className="landing-footer-links">
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <a href="/faq" target="_blank" rel="noopener noreferrer">FAQ</a>
              </div>
            </footer>
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
