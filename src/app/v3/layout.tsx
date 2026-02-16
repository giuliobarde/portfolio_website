import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollHandler from "@/components/v3/ScrollHandler";
import { createClient } from "@/prismicio";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const name = settings.data.name || "Portfolio";

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description: "Professional portfolio showcasing projects and skills",
    keywords: ["portfolio", "developer", "web development", "projects"],
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: name,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
