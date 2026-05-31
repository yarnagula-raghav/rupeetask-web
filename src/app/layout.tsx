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
