import type { Metadata } from "next";
import Script from "next/script";
import { Urbanist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollHandler from "@/components/ScrollHandler";
import { createClient } from "@/prismicio";

const urbanist = Urbanist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const webIconUrl = settings.data.web_icon?.url;
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
    ...(webIconUrl && {
      icons: {
        icon: webIconUrl,
        apple: webIconUrl,
      },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-900 text-slate-100" suppressHydrationWarning>
      <body
        className={`${urbanist.variable} ${jetbrainsMono.variable} ${urbanist.className}`}
      >
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration'in history){history.scrollRestoration='manual'}`,
          }}
        />
        <ScrollHandler />
        <ConditionalHeader />
        {children}
        <ConditionalFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
