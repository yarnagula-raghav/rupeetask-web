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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2054262696231339" crossOrigin="anonymous"></script>
        <script type='text/javascript' src='https://pl29637502.effectivecpmnetwork.com/46/dd/e7/46dde7eb18697d6a9b45f93d7e73407f.js'></script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} dark-mode`}>
        <AuthProvider>
          <WalletProvider>
            <div id="app-wrapper">
              {children}
            </div>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
