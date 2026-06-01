import React from "react";

export default function FAQ() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ marginBottom: "30px", fontSize: "2rem", fontWeight: 800 }}>Frequently Asked Questions</h1>
      
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "var(--color-brand)", marginBottom: "10px", fontSize: "1.2rem" }}>Q: I completed a task, but I haven't received my money. Why?</h3>
        <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
          A: Earnings are strictly controlled by our third-party advertisers (like CPX Research or OGAds). Sometimes, tracking can take up to 24-48 hours to sync. If you sped through a survey, provided fake details, or used an ad-blocker, the advertiser will reject the completion and you will not be credited.
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "var(--color-brand)", marginBottom: "10px", fontSize: "1.2rem" }}>Q: How long do withdrawals take to process?</h3>
        <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
          A: All withdrawals are manually reviewed by our compliance team to ensure no fraudulent activity occurred during your earning process. Because of this, it can take between 7 to 14 business days to receive your payout via UPI or Bank Transfer.
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "var(--color-brand)", marginBottom: "10px", fontSize: "1.2rem" }}>Q: Why was my account balance reduced suddenly?</h3>
        <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
          A: If an advertiser later determines that a task you completed was fraudulent or failed their quality checks, they will issue a "Chargeback". We automatically deduct reversed amounts from your wallet. Provide high-quality survey answers to avoid this!
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "var(--color-brand)", marginBottom: "10px", fontSize: "1.2rem" }}>Q: Can I use a VPN to access more surveys?</h3>
        <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
          A: Absolutely NOT. Using a VPN, Proxy, or Emulator is a severe violation of our Fraud Policy. Our automated systems will detect it, your account will be permanently banned, and all funds will be confiscated.
        </p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ color: "var(--color-brand)", marginBottom: "10px", fontSize: "1.2rem" }}>Q: Can I have multiple accounts in my household?</h3>
        <p style={{ lineHeight: "1.6", color: "var(--color-text-secondary)" }}>
          A: No. We strictly enforce a limit of ONE (1) account per person, per household, and per IP address to prevent referral abuse and fraud.
        </p>
      </div>

      <div style={{ marginTop: "50px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
        <a href="/" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 600 }}>&larr; Return to Application</a>
      </div>
    </div>
  );
}
