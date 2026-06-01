import React from "react";

export default function TermsOfService() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ marginBottom: "10px", fontSize: "2rem", fontWeight: 800 }}>Terms of Service</h1>
      <p style={{ marginBottom: "30px", color: "var(--color-text-muted)" }}>Last updated: June 2026</p>
      
      <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
        Welcome to RupeeTask ("Platform", "we", "us", or "our"). By accessing or using our website, services, and applications, you agree to comply with and be bound by the following comprehensive Terms of Service. If you do not agree with any part of these terms, you must not use our Platform.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>1. Account Registration & Eligibility</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        1.1. You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use our Platform. By registering, you represent and warrant that you meet this requirement.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        1.2. Users are strictly permitted to maintain only **ONE (1) account per person, per household, and per IP address**. The creation of multiple accounts is considered fraudulent and will result in immediate termination of all associated accounts and forfeiture of all balances.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        1.3. You are responsible for maintaining the confidentiality of your account credentials. We are not liable for any loss or damage arising from unauthorized access to your account.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>2. Earning Mechanisms & Offerwalls</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        2.1. RupeeTask partners with third-party advertisers, survey routers, and offerwalls (collectively, "Partners") to provide earning opportunities. We do not control the criteria for task completion, survey disqualifications, or reward allocations dictated by these Partners.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        2.2. Earnings are credited only when the Partner successfully verifies the completion of a task and transmits a positive postback to our servers. RupeeTask cannot manually credit accounts for tasks that Partners deem incomplete or fraudulent.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        2.3. **Chargebacks & Reversals:** If a Partner reverses a previously credited reward due to advertiser rejection, fraudulent activity, or quality control failure (a "Chargeback"), RupeeTask reserves the right to deduct the corresponding amount from your wallet balance. If your balance becomes negative, future earnings will be applied to clear the deficit.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>3. Strict Anti-Fraud Policy</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        3.1. RupeeTask operates a **Zero-Tolerance Policy** regarding fraud. We utilize advanced, automated security protocols to monitor traffic and user behavior.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        3.2. **Prohibited Technologies:** The use of Virtual Private Networks (VPNs), Proxy servers, Tor nodes, VPS hosting, Emulators, Virtual Machines, or any technology designed to mask, alter, or spoof your true IP address or device fingerprint is strictly forbidden.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        3.3. **Prohibited Behaviors:** You may not use automated bots, macros, scripts, or auto-clickers to interact with our Platform or complete offers. Providing false, misleading, or contradictory information in surveys is also strictly prohibited.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        3.4. Violation of any anti-fraud rule will result in an immediate, permanent, and non-appealable ban. All pending withdrawals will be canceled, and wallet balances will be permanently confiscated and returned to the advertisers.
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>4. Withdrawals & Payouts</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        4.1. Withdrawal requests are subject to internal audit and manual review. While we strive to process payouts rapidly, reviews may take up to 7-14 business days.
      </p>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        4.2. RupeeTask is not responsible for delayed, lost, or misrouted funds caused by user error (e.g., providing incorrect UPI IDs or Bank Account details). 
      </p>

      <h2 style={{ marginTop: "40px", marginBottom: "15px", fontSize: "1.4rem", color: "var(--color-brand)" }}>5. Limitation of Liability</h2>
      <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
        5.1. The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the continuous availability or error-free operation of the Platform.
      </p>

      <div style={{ marginTop: "50px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
        <a href="/" style={{ color: "var(--color-brand)", textDecoration: "none", fontWeight: 600 }}>&larr; Return to Application</a>
      </div>
    </div>
  );
}
