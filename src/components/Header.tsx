"use client";

import { useState } from "react";

export default function Header({ title, subtitle }: { title: string; subtitle: string }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="content-header">
      <div className="header-title">
        <h1 id="page-title">{title}</h1>
        <p id="page-subtitle">{subtitle}</p>
      </div>

      <div className="header-controls">
        <div className="streak-metric-pill highlight" style={{ cursor: "pointer" }}>
          🔥 Streak: <span id="header-streak-count">0</span> Days
        </div>

        <div style={{ position: "relative" }}>
          <button
            className="notif-bell-btn"
            id="notif-bell"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            🔔
            <span className="notif-badge" id="notif-badge" style={{ display: "none" }}>
              0
            </span>
          </button>

          {notifOpen && (
            <div className="notif-dropdown open" id="notif-dropdown">
              <div className="notif-dropdown-header">
                <h4>Notifications</h4>
                <button className="notif-clear-btn" onClick={() => {}}>
                  Clear All
                </button>
              </div>
              <div id="notif-list">
                <div className="notif-empty">📭 No notifications yet</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
