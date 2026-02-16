import { Metadata } from "next";
import { isFilled, asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices/v4";

export default async function V4Page() {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return (
    <div className="relative min-h-screen">
      {/* Main Content from Prismic */}
      <div className="relative z-10">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const [page, settings] = await Promise.all([
    client.getSingle("homepage"),
    client.getSingle("settings"),
  ]);
  const name = settings.data.name || "Portfolio";

  return {
    title: page.data.meta_title || name,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title)
        ? page.data.meta_title
        : name,
      description: isFilled.keyText(page.data.meta_description)
        ? page.data.meta_description
        : undefined,
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : undefined,
    },
  };
}
