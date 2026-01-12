import type { Metadata } from "next";
import { Urbanist, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/v3/Header";
import Footer from "@/components/v3/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollHandler from "@/components/v3/ScrollHandler";

const urbanist = Urbanist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio v3",
    template: "%s | Portfolio v3",
  },
  description: "Professional portfolio showcasing projects and skills (Version 3)",
  keywords: ["portfolio", "developer", "web development", "projects"],
  authors: [{ name: "Portfolio Owner" }],
  creator: "Portfolio Owner",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio v3",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function V3Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100">
      <body
        className={`${urbanist.variable} ${jetbrainsMono.variable} ${urbanist.className}`}
      >
        <ScrollHandler />
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
