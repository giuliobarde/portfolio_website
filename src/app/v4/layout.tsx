import type { Metadata } from "next";
import "./globals.css";
import V4LayoutWrapper from "@/components/v4/V4LayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: "Portfolio v4",
    template: "%s | Portfolio",
  },
  description: "Computer Science & AI Engineering Portfolio - Showcasing projects, work experience, and technical expertise",
  keywords: ["portfolio", "computer science", "AI engineering", "data science", "machine learning", "software development"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio v4",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function V4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <V4LayoutWrapper>{children}</V4LayoutWrapper>;
}
