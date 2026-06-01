import React, { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const AdsterraWalletBanner = () => {
  useEffect(() => {
    if (!document.getElementById("adsterra-script-wallet-dae73bfcfc3c34cf577e22bcae422257")) {
      const script = document.createElement("script");
      script.id = "adsterra-script-wallet-dae73bfcfc3c34cf577e22bcae422257";
      script.type = "text/javascript";
      script.dataset.cfasync = "false";
      script.src = "//pl25602351.effectivecpmnetwork.com/dae73bfcfc3c34cf577e22bcae422257/invoke.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ marginTop: '24px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
      <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Want to withdraw faster? Complete more tasks!</h4>
      <div id="container-dae73bfcfc3c34cf577e22bcae422257" style={{ minHeight: '60px', width: '100%', display: 'flex', justifyContent: 'center' }}></div>
    </div>
  );
};

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [isFirstOfMonth, setIsFirstOfMonth] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      if (now.getDate() === 1) {
        setIsFirstOfMonth(true);
        setTimeLeft("Withdrawals are OPEN today!");
        return;
      }
      
      setIsFirstOfMonth(false);
      let nextMonth = now.getMonth() + 1;
      let year = now.getFullYear();
      if (nextMonth > 11) {
        nextMonth = 0;
        year += 1;
      }
      const nextFirst = new Date(year, nextMonth, 1);
      const diffMs = nextFirst.getTime() - now.getTime();
      
      const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diffMs / 1000 / 60) % 60);
      const s = Math.floor((diffMs / 1000) % 60);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
      ⏳ {timeLeft}
    </div>
  );
}

export default function Wallet() {
  const [withdrawMethod, setWithdrawMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [paytmNumber, setPaytmNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { balance, lifetimeEarnings, requestWithdrawal } = useWallet();

  const isFirstOfMonth = new Date().getDate() === 1;

  const handleWithdraw = async () => {
    if (balance < 1000) {
      alert("Minimum withdrawal is ₹1,000.");
      return;
    }
    
    // TEMPORARY BYPASS FOR TESTING - Remove this in production if you want strict dates
    // if (!isFirstOfMonth) {
    //   alert("Withdrawals are only processed on the 1st of every month.");
    //   return;
    // }

    if (withdrawMethod === "UPI") {
      if (!upiId || !upiId.includes("@") || upiId.length < 5) {
        alert("Please enter a valid UPI ID (e.g. name@bank)");
        return;
      }
    }
    if (withdrawMethod === "Bank Transfer") {
      if (!bankName || bankName.length < 3) {
        alert("Please enter a valid Bank Name");
        return;
      }
      if (!accountNumber || accountNumber.length < 8 || !/^\d+$/.test(accountNumber)) {
        alert("Please enter a valid Bank Account Number (digits only, min 8)");
        return;
      }
      if (!ifscCode || ifscCode.length !== 11 || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
        alert("Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)");
        return;
      }
    }
    if (withdrawMethod === "Paytm") {
      if (!paytmNumber || paytmNumber.length !== 10 || !/^\d{10}$/.test(paytmNumber)) {
        alert("Please enter a valid 10-digit Paytm mobile number");
        return;
      }
    }
    
    setIsSubmitting(true);
    let details = "";
    if (withdrawMethod === "UPI") details = upiId;
    else if (withdrawMethod === "Bank Transfer") details = `Bank: ${bankName} | Acct: ${accountNumber} | IFSC: ${ifscCode}`;
    else if (withdrawMethod === "Paytm") details = `Paytm: ${paytmNumber}`;

    const success = await requestWithdrawal(1000, withdrawMethod, details);
    
    setIsSubmitting(false);
    
    if (success) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (e) {}

      alert(`Withdrawal request submitted via ${withdrawMethod}! Your payout will be processed shortly.`);
      setUpiId(""); setBankName(""); setAccountNumber(""); setIfscCode(""); setPaytmNumber("");
    } else {
      alert("Failed to submit withdrawal request. Please try again.");
    }
  };

  const inputStyle = {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid var(--border-light)",
    color: "#fff",
    padding: "12px",
    borderRadius: "var(--border-radius-md)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.88rem",
    outline: "none",
    transition: "var(--transition-smooth)",
    width: "100%",
  };

  return (
    <motion.section
      id="view-wallet"
      className="user-view active"
      style={{ padding: "24px" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="streak-hub-grid">
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>🏦 Withdraw Your Earnings</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            You can withdraw your balance once you reach ₹1,000. Payouts are exclusively processed on the 1st of every month.
          </p>

          <div style={{ 
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)", 
            padding: "16px", 
            borderRadius: "var(--border-radius-md)", 
            border: "1px solid var(--color-brand-glow)" 
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
              TIME UNTIL NEXT PAYOUT WINDOW
            </div>
            <CountdownTimer />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                CURRENT BALANCE
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-success)" }}>
                ₹{balance.toFixed(2)}
              </div>
            </div>
            
            <div style={{ flex: 1, background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "var(--border-radius-md)", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                LIFETIME EARNINGS
              </div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-brand)" }}>
                ₹{(lifetimeEarnings || 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
              SELECT PAYMENT CHANNEL
            </label>
            <select
              className="select-category-dropdown"
              style={{ maxWidth: "100%" }}
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value)}
            >
              <option value="UPI">UPI Instant (e.g. UPI ID @ybl)</option>
              <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
              <option value="Paytm">Paytm Wallet</option>
            </select>

            {/* UPI Fields */}
            {withdrawMethod === "UPI" && (
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g. name@ybl)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={inputStyle}
              />
            )}

            {/* Bank Transfer Fields */}
            {withdrawMethod === "Bank Transfer" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Account Holder Full Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="IFSC Code (e.g. SBIN0001234)"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {/* Paytm Fields */}
            {withdrawMethod === "Paytm" && (
              <input
                type="text"
                placeholder="Paytm Registered Mobile Number"
                value={paytmNumber}
                onChange={(e) => setPaytmNumber(e.target.value)}
                style={inputStyle}
              />
            )}
          </div>

          <AdsterraWalletBanner />

          <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }} onClick={handleWithdraw} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Withdraw ₹1,000"}
          </button>
        </div>

        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>📜 Payout Transaction History</h3>
          <div style={{ flex: 1, minHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "60px" }}>
              No withdrawals yet. Earn ₹1,000 and withdraw on the 1st!
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
