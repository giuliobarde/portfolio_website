import { Metadata } from "next";
import { isFilled, asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices/v4";
import BackgroundEffects from "@/components/v4/BackgroundEffects";

export default async function V4Page() {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <BackgroundEffects />

      {/* Main Content from Prismic */}
      <div className="relative z-10">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return {
    title: page.data.meta_title ? `${page.data.meta_title} (v4)` : "Portfolio v4",
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title)
        ? `${page.data.meta_title} (v4)`
        : undefined,
      description: isFilled.keyText(page.data.meta_description)
        ? page.data.meta_description
        : undefined,
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : undefined,
    },
  };
}
