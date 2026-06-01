"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, doc, updateDoc, runTransaction } from "firebase/firestore";

export default function AdminLedger() {
  const { user } = useAuth();
  const { getGrossPlatformRevenue, getAdminShare, getTotalUserEarnings } = useWallet();

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"withdrawals" | "users">("withdrawals");

  const isAdmin = user?.email === "ruppetask2025@gmail.com" || user?.email === "rupeetask2025@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to withdrawals
    const qW = query(collection(db, "withdrawals"));
    const unsubW = onSnapshot(qW, (snapshot) => {
      const wList: any[] = [];
      snapshot.forEach((doc) => {
        wList.push({ id: doc.id, ...doc.data() });
      });
      // Sort pending first, then by date descending
      wList.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setWithdrawals(wList);
    });

    // Listen to users
    const qU = query(collection(db, "users"));
    const unsubU = onSnapshot(qU, (snapshot) => {
      const uList: any[] = [];
      snapshot.forEach((doc) => {
        uList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by balance descending
      uList.sort((a, b) => (b.balance || 0) - (a.balance || 0));
      setUsers(uList);
    });

    return () => {
      unsubW();
      unsubU();
    };
  }, [isAdmin]);

  const handleApprove = async (withdrawalId: string) => {
    if (!confirm("Are you sure you want to mark this as PAID?")) return;
    try {
      const wRef = doc(db, "withdrawals", withdrawalId);
      await updateDoc(wRef, { status: "paid" });
    } catch (e) {
      console.error(e);
      alert("Error approving");
    }
  };

  const handleReject = async (withdrawalId: string, userId: string, amount: number) => {
    if (!confirm("Are you sure you want to REJECT? This will refund the amount back to the user's wallet.")) return;
    try {
      await runTransaction(db, async (transaction) => {
        const wRef = doc(db, "withdrawals", withdrawalId);
        const uRef = doc(db, "users", userId);
        
        const userDoc = await transaction.get(uRef);
        if (!userDoc.exists()) throw "User not found";
        
        const currentBalance = userDoc.data().balance || 0;
        
        transaction.update(wRef, { status: "rejected" });
        transaction.update(uRef, { balance: currentBalance + amount });
      });
    } catch (e) {
      console.error(e);
      alert("Error rejecting");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#f87171" }}>
        <h2>Access Denied</h2>
        <p>This is a highly restricted area.</p>
      </div>
    );
  }

  const totalRevenue = getGrossPlatformRevenue();
  const adminShare = getAdminShare();
  const userEarnings = getTotalUserEarnings();

  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending");

  return (
    <motion.section 
      id="view-admin" 
      className="admin-view active" 
      style={{ padding: "24px" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ margin: 0 }}>🚨 Secret Admin Dashboard</h2>
        <span style={{ background: "rgba(52,211,153,0.2)", color: "#34d399", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700 }}>Admin Authenticated</span>
      </div>

      <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        {/* Total Ad Revenue */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-brand)" }}>
          <div className="stat-info">
            <span className="stat-label">💰 Total Gross Ad Revenue</span>
            <div className="stat-value">₹{totalRevenue.toFixed(2)}</div>
          </div>
        </motion.div>

        {/* Platform Share */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-success)" }}>
          <div className="stat-info">
            <span className="stat-label">📈 Platform Profit (70%)</span>
            <div className="stat-value">₹{adminShare.toFixed(2)}</div>
          </div>
        </motion.div>

        {/* Pending Payout Liability */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass-card stat-card" style={{ background: "rgba(0,0,0,0.4)", borderLeft: "4px solid var(--color-warning)" }}>
          <div className="stat-info">
            <span className="stat-label">💳 Pending Payouts</span>
            <div className="stat-value">₹{pendingWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0).toFixed(2)}</div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button 
          onClick={() => setActiveTab("withdrawals")}
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "withdrawals" ? "var(--color-brand)" : "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}
        >
          Pending Withdrawals ({pendingWithdrawals.length})
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: activeTab === "users" ? "var(--color-brand)" : "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontWeight: 600 }}
        >
          All Users ({users.length})
        </button>
      </div>

      <div className="glass-card" style={{ padding: "0" }}>
        
        {activeTab === "withdrawals" && (
          <div style={{ padding: "16px" }}>
            {withdrawals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--color-text-muted)" }}>No withdrawals found.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {withdrawals.map((w) => (
                  <div key={w.id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                    <div style={{ minWidth: "200px", flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "1rem", color: w.status === "pending" ? "#f59e0b" : w.status === "paid" ? "#10b981" : "#ef4444" }}>
                        ₹{w.amount} - {w.status.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>User: {w.userEmail || w.userName}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-primary)", marginTop: "4px" }}>Method: {w.method}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-primary)", marginTop: "4px" }}>Details: <span style={{ color: "#fff", fontWeight: 700 }}>{w.details}</span></div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "4px" }}>{new Date(w.createdAt).toLocaleString()}</div>
                    </div>
                    
                    {w.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button onClick={() => handleApprove(w.id)} style={{ background: "rgba(52, 211, 153, 0.2)", color: "#34d399", border: "1px solid #34d399", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>Approve (Mark Paid)</button>
                        <button onClick={() => handleReject(w.id, w.userId, w.amount)} style={{ background: "rgba(248, 113, 113, 0.2)", color: "#f87171", border: "1px solid #f87171", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600 }}>Reject (Refund)</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div style={{ padding: "16px" }}>
            {users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--color-text-muted)" }}>No users found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-light)", color: "var(--color-text-muted)" }}>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Balance</th>
                      <th style={{ padding: "12px" }}>Lifetime Earned</th>
                      <th style={{ padding: "12px" }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "12px" }}>{u.email}</td>
                        <td style={{ padding: "12px", color: "#34d399", fontWeight: 600 }}>₹{(u.balance || 0).toFixed(2)}</td>
                        <td style={{ padding: "12px" }}>₹{(u.lifetimeEarnings || 0).toFixed(2)}</td>
                        <td style={{ padding: "12px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </motion.section>
  );
}
