"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  const [showPayment, setShowPayment] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showPrivacy, setShowPrivacy] = React.useState(false);

  // Payment Form State
  const [payMethod, setPayMethod] = React.useState("upi");
  const [upiId, setUpiId] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [bankAcc, setBankAcc] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (user && showPayment) {
      getDoc(doc(db, "users", user.uid)).then(d => {
        if(d.exists() && d.data().paymentDetails) {
           const p = d.data().paymentDetails;
           setPayMethod(p.method || "upi");
           setUpiId(p.upiId || "");
           setBankName(p.bankName || "");
           setBankAcc(p.bankAcc || "");
           setIfsc(p.ifsc || "");
        }
      });
    }
  }, [user, showPayment]);

  const handleSavePayment = async () => {
    if(!user) return;
    setSaving(true);
    await setDoc(doc(db, "users", user.uid), {
      paymentDetails: {
        method: payMethod,
        upiId,
        bankName,
        bankAcc,
        ifsc
      }
    }, { merge: true });
    setSaving(false);
    setShowPayment(false);
    alert("Payment details saved securely!");
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (!user) return null;

  const displayName = user.displayName || (user.email ? user.email.split('@')[0] : "User");

  return (
    <motion.section 
      id="view-profile" 
      className="user-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-section">
        <div className="profile-header-card">
          <div className="profile-avatar-large" id="profile-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2 id="profile-name">{displayName}</h2>
            <p id="profile-email">{user.email}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Member since Today
            </p>
          </div>
        </div>

        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <div className="stat-num">₹{balance.toFixed(2)}</div>
            <div className="stat-lbl">Lifetime Earned</div>
          </div>
          <div className="profile-stat-item">
            <div className="stat-num">0</div>
            <div className="stat-lbl">Tasks Completed</div>
          </div>
          <div className="profile-stat-item">
            <div className="stat-num">0 Days</div>
            <div className="stat-lbl">Longest Streak</div>
          </div>
        </div>

        <div className="profile-actions-grid">
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => setShowSettings(true)}>
            <span className="action-icon">⚙️</span> Account Settings
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => setShowPayment(true)}>
            <span className="action-icon">💳</span> Payment Methods
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn" onClick={() => setShowPrivacy(true)}>
            <span className="action-icon">🛡️</span> Legal & Security
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} className="profile-action-btn danger" onClick={handleLogout}>
            <span className="action-icon">🚪</span> Log Out
          </motion.button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPayment && (
          <Modal onClose={() => setShowPayment(false)} title="💳 Payment Methods">
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              Securely store your details for fast withdrawals.
            </p>
            
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button 
                className={`btn-primary ${payMethod === 'upi' ? '' : 'outline'}`} 
                style={{flex:1}} 
                onClick={() => setPayMethod("upi")}
              >
                UPI
              </button>
              <button 
                className={`btn-primary ${payMethod === 'bank' ? '' : 'outline'}`} 
                style={{flex:1}} 
                onClick={() => setPayMethod("bank")}
              >
                Bank Transfer
              </button>
            </div>

            {payMethod === "upi" ? (
              <div className="auth-input-group">
                <label>UPI ID</label>
                <input type="text" className="auth-input" placeholder="e.g. 9876543210@paytm" value={upiId} onChange={e=>setUpiId(e.target.value)} />
              </div>
            ) : (
              <>
                <div className="auth-input-group">
                  <label>Full Name (As per Bank)</label>
                  <input type="text" className="auth-input" placeholder="John Doe" value={bankName} onChange={e=>setBankName(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <label>Account Number</label>
                  <input type="text" className="auth-input" placeholder="XXXX XXXX XXXX" value={bankAcc} onChange={e=>setBankAcc(e.target.value)} />
                </div>
                <div className="auth-input-group">
                  <label>IFSC Code</label>
                  <input type="text" className="auth-input" placeholder="SBIN000XXXX" value={ifsc} onChange={e=>setIfsc(e.target.value)} />
                </div>
              </>
            )}

            <button className="btn-primary" style={{ width: "100%", marginTop: "16px" }} onClick={handleSavePayment} disabled={saving}>
              {saving ? "Saving..." : "Save Details"}
            </button>
          </Modal>
        )}

        {showSettings && (
          <Modal onClose={() => setShowSettings(false)} title="⚙️ Account Settings">
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              Update your personal details and app preferences.
            </p>
            <div className="auth-input-group">
              <label>Full Name</label>
              <input type="text" className="auth-input" defaultValue={displayName} disabled />
            </div>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" className="auth-input" defaultValue={user.email || ""} disabled />
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-warning)" }}>* Name and email cannot be changed after registration.</p>
          </Modal>
        )}

        {showPrivacy && (
          <Modal onClose={() => setShowPrivacy(false)} title="🛡️ Legal & Security">
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "16px" }}>
              Review our policies to ensure compliance. We strictly prohibit VPNs and multiple accounts.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <button className="btn-primary outline" style={{ width: "100%", textAlign: "left", padding: "12px", display: "flex", justifyContent: "space-between" }} onClick={() => window.location.href = "/fraud-policy"}>
                <span>🚨 Fraud & Zero-Tolerance Policy</span>
                <span>→</span>
              </button>
              <button className="btn-primary outline" style={{ width: "100%", textAlign: "left", padding: "12px", display: "flex", justifyContent: "space-between" }} onClick={() => window.location.href = "/terms"}>
                <span>📜 Terms of Service</span>
                <span>→</span>
              </button>
              <button className="btn-primary outline" style={{ width: "100%", textAlign: "left", padding: "12px", display: "flex", justifyContent: "space-between" }} onClick={() => window.location.href = "/privacy"}>
                <span>🔒 Privacy Policy</span>
                <span>→</span>
              </button>
              <button className="btn-primary outline" style={{ width: "100%", textAlign: "left", padding: "12px", display: "flex", justifyContent: "space-between" }} onClick={() => window.location.href = "/faq"}>
                <span>❓ Frequently Asked Questions</span>
                <span>→</span>
              </button>
            </div>

            <button className="btn-primary" style={{ width: "100%", background: "var(--color-danger)" }} onClick={() => alert("Contact ruppetask2025@gmail.com to request account deletion.")}>
              Request Account Deletion
            </button>
          </Modal>
        )}
      </AnimatePresence>

    </motion.section>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        zIndex: 5000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{ maxWidth: "400px", width: "100%", padding: "24px", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
