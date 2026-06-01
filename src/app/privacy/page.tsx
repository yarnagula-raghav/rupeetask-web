import React from "react";

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ marginBottom: "10px", fontSize: "2rem", fontWeight: 800 }}>Privacy Policy</h1>
      <p style={{ marginBottom: "30px", color: "var(--color-text-muted)" }}>Last updated: June 2026</p>
      
      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        RupeeTask ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy informs you as to how we collect, process, and safeguard your information when you visit our application and interact with our services. We adhere to data protection regulations, including the principles outlined in the GDPR and CCPA.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>1. Data We Collect</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        <strong>1.1. Account Information:</strong> When you register via Google Authentication or email, we collect your email address, display name, and unique user identifier (UID).
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        <strong>1.2. Technical Data:</strong> We automatically collect your IP address, browser type, operating system, and device identifiers to ensure platform security and prevent fraudulent activity.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        <strong>1.3. Payment Information:</strong> When requesting a withdrawal, you may provide payment details such as a UPI ID or Bank Account number. We use this strictly for processing your payout.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>2. How We Use Your Data</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        We utilize the collected information to:
        <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
          <li style={{ marginBottom: "8px" }}>Provide, operate, and maintain our Platform.</li>
          <li style={{ marginBottom: "8px" }}>Process transactions and send related payout information.</li>
          <li style={{ marginBottom: "8px" }}>Detect, prevent, and address fraud, VPN usage, and unauthorized access.</li>
          <li style={{ marginBottom: "8px" }}>Attribute task completions from third-party networks to your specific account.</li>
        </ul>
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>3. Third-Party Sharing & Offerwalls</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        To provide you with earning opportunities, we integrate with third-party advertising networks and survey routers (e.g., CPX Research, BitLabs, OGAds). 
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        When you engage with a third-party offerwall, we may pass a non-personally identifiable "Sub-ID" (such as your UID) to the partner. This allows them to notify us when you successfully complete a task so we can credit your account. <strong>We do not sell your personal email or name to these third parties.</strong> However, any information you explicitly provide directly to a survey or offerwall is governed by their respective privacy policies.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>4. Cookies and Tracking Technologies</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        We use cookies and similar tracking technologies to track activity on our Platform. Cookies are essential for maintaining your session state and properly attributing ad clicks. You can instruct your browser to refuse all cookies, but doing so may render certain earning features unusable.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>5. Data Retention & Deletion</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        We retain your personal data only for as long as is necessary for the purposes set out in this policy. You have the right to request the deletion of your account and associated data at any time by contacting our support team. Upon deletion, all unwithdrawn balances will be forfeited.
      </p>

      <div style={{ marginTop: "50px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
        <a href="/" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 600 }}>&larr; Return to Application</a>
      </div>
    </div>
  );
}
