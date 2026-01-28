import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/v3/Header";
import Footer from "@/components/v3/Footer";
import ScrollHandler from "@/components/v3/ScrollHandler";

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
    <>
      <ScrollHandler />
      <Header />
      {children}
      <Footer />
    </>
  );
}
