"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/v4/ThemeProvider";
import Navbar from "@/components/v4/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Inter as main font with Apple-like system font fallbacks
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function V4LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${inter.className} antialiased`}
      style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </div>
  );
}
