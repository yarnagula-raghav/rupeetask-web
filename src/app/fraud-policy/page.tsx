import React from "react";

export default function FraudPolicy() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ marginBottom: "10px", fontSize: "2rem", fontWeight: 800, color: "#ef4444" }}>Fraud & Security Policy</h1>
      <p style={{ marginBottom: "30px", color: "var(--color-text-muted)" }}>Last updated: June 2026</p>
      
      <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: "20px", borderRadius: "8px", marginBottom: "30px" }}>
        <h3 style={{ color: "#ef4444", marginTop: 0, marginBottom: "10px" }}>⚠️ ZERO TOLERANCE POLICY</h3>
        <p style={{ margin: 0, lineHeight: "1.6" }}>
          RupeeTask operates under a strict, automated Zero Tolerance Policy against fraudulent activity. Any attempt to exploit, bypass, or manipulate our earning systems or those of our advertising partners will result in an immediate, irreversible account ban and forfeiture of all balances.
        </p>
      </div>

      <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>1. Automated Detection Systems</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        We utilize enterprise-grade security protocols to monitor traffic quality. Our systems analyze IP reputation, device fingerprinting, behavioral biometrics, and proxy usage in real-time. If our system flags your account with a high fraud score, access to earning features will be automatically restricted.
      </p>

      <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>2. Strictly Prohibited Actions</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        The following actions constitute fraud and are strictly banned on RupeeTask:
      </p>
      <ul style={{ marginLeft: "20px", marginBottom: "20px", lineHeight: "1.8" }}>
        <li><strong>VPNs & Proxies:</strong> The use of Virtual Private Networks, Proxies, Tor browsers, or any IP-masking software.</li>
        <li><strong>Multiple Accounts:</strong> Operating more than one account per person, household, or IP address.</li>
        <li><strong>Emulators:</strong> Using Android/iOS emulators, virtual machines, or rooted devices to complete mobile offers.</li>
        <li><strong>Automation:</strong> Employing auto-clickers, macros, scripts, or bots to navigate the site or complete tasks.</li>
        <li><strong>False Information:</strong> Providing inaccurate, contradictory, or speed-clicking through survey responses.</li>
      </ul>

      <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>3. Advertiser Chargebacks</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        Our third-party advertising partners hold the final authority on task verification. If an advertiser determines that a lead was generated fraudulently or fails their quality control checks, they will issue a "Chargeback". RupeeTask will automatically deduct the reversed earnings from your account balance. Repeated chargebacks will trigger an automated account review.
      </p>

      <h2 style={{ marginTop: "30px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>4. Review & Appeals</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        Accounts banned by our automated fraud system are generally not eligible for appeal, to protect the integrity of our advertising partners. If you believe your account was flagged in error due to a dynamic IP issue from your ISP, you may contact support, but reinstatement is at our sole discretion.
      </p>

      <div style={{ marginTop: "50px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
        <a href="/" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 600 }}>&larr; Return to Application</a>
      </div>
    </div>
  );
}
