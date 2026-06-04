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
  title: "RupeeTask - Earn Money Online",
  description: "Secure, zero-investment online earnings platform.",
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
