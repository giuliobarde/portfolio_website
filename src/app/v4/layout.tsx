import type { Metadata } from "next";
import "./globals.css";
import V4LayoutWrapper from "@/components/v4/V4LayoutWrapper";
import { createClient } from "@/prismicio";
import { extractPrismicUrl } from "@/lib/prismic-helpers";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const name = settings.data.name || "Portfolio";

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description: "Computer Science & AI Engineering Portfolio - Showcasing projects, work experience, and technical expertise",
    keywords: ["portfolio", "computer science", "AI engineering", "data science", "machine learning", "software development"],
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

export default async function V4Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const webIconUrl = settings.data.web_icon?.url ?? undefined;
  const userName = settings.data.name || undefined;
  const version = (settings.data.version === "v3" ? "v3" : "v4") as "v3" | "v4";
  const resumeText = settings.data.resume_text || "Resume";
  const resumeUrl = settings.data.resume_link ? extractPrismicUrl(settings.data.resume_link) || undefined : undefined;
  const websiteVersions = settings.data.website_version?.map((v) => v.version).filter(Boolean) as string[] | undefined;

  return (
    <V4LayoutWrapper
      webIconUrl={webIconUrl}
      userName={userName}
      version={version}
      resumeText={resumeText}
      resumeUrl={resumeUrl}
      websiteVersions={websiteVersions}
    >
      {children}
    </V4LayoutWrapper>
  );
}
