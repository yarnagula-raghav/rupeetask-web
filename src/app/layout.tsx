import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RupeeTask - Watch, Survey, Install & Earn Real Money | Zero Investment",
  description: "Earn real money, Paytm cash, and UPI rewards online with RupeeTask. Complete simple surveys, watch ads, install apps, and spin the lucky wheel. 100% legal, secure, and zero investment required. Start earning pocket money today!",
  keywords: [
    "earn money online",
    "make money online India",
    "earn Paytm cash",
    "free UPI cash",
    "online earning website for students",
    "zero investment earning app",
    "paid surveys India",
    "watch ads and earn money",
    "app install rewards",
    "RupeeTask",
    "pocket money app"
  ],
  authors: [{ name: "RupeeTask Team" }],
  openGraph: {
    title: "RupeeTask - Earn Real Money & Paytm Cash Online",
    description: "Complete simple tasks, watch ads, and take surveys to earn real money directly into your UPI or Paytm wallet. 100% free and zero investment!",
    url: "https://rupeetask.xyz",
    siteName: "RupeeTask",
    images: [
      {
        url: "https://rupeetask.xyz/icon.png",
        width: 512,
        height: 512,
        alt: "RupeeTask - Earn Money Online",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RupeeTask - Earn Real Money & Paytm Cash Online",
    description: "Secure, zero-investment online earnings platform. Earn real cash directly into your UPI/Paytm wallet.",
    images: ["https://rupeetask.xyz/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import PopunderAd from "@/components/PopunderAd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2054262696231339" crossOrigin="anonymous"></script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} dark-mode`}>
        <AuthProvider>
          <WalletProvider>
            <PopunderAd />
            <div id="app-wrapper">
              {children}
            </div>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
