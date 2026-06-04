"use client";
import { useEffect } from "react";

export default function PopunderAd() {
  useEffect(() => {
    // Only activate the popunder if the domain contains "vercel.app"
    if (window.location.hostname.includes("vercel.app")) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://pl29637502.effectivecpmnetwork.com/46/dd/e7/46dde7eb18697d6a9b45f93d7e73407f.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
