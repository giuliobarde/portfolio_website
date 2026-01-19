"use client";

import { JetBrains_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/v4/ThemeProvider";
import Navbar from "@/components/v4/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
      className={`${jetbrainsMono.variable} ${inter.variable} antialiased`}
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <Navbar />
        <main className="relative">{children}</main>

        {/* Terminal-style footer */}
        <footer className="border-t border-border/50 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-accent">$</span> echo &quot;Built with Next.js + Prismic&quot;
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-accent">&gt;</span> {new Date().getFullYear()} &mdash; All rights reserved
            </p>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
      </ThemeProvider>
    </div>
  );
}
