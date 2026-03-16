import { Metadata } from "next";
import { isFilled, asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices/v4";
import type { RichTextField } from "@prismicio/client";
import BranchingTimeline from "@/components/v4/sections/BranchingTimeline";
import type { EducationItem, WorkItem } from "@/lib/timeline-utils";

const TIMELINE_SLICE_TYPES = ["education", "work_experience"];

export default async function V4Page() {
  const client = createClient();
  const page = await client.getSingle("homepage");
  const slices = page.data.slices;

  // Extract education + work experience slices for the unified timeline
  const eduSlice = slices.find((s) => s.slice_type === "education") as
    | { primary: { section_id?: string; heading?: string; description?: RichTextField; educations?: EducationItem[] } }
    | undefined;
  const workSlice = slices.find((s) => s.slice_type === "work_experience") as
    | { primary: { experiences?: WorkItem[] } }
    | undefined;

  // Find where the first timeline slice appears in the ordering
  const timelineIndex = slices.findIndex((s) =>
    TIMELINE_SLICE_TYPES.includes(s.slice_type),
  );

  // Split remaining slices around the timeline position
  const beforeSlices = slices
    .slice(0, timelineIndex === -1 ? slices.length : timelineIndex)
    .filter((s) => !TIMELINE_SLICE_TYPES.includes(s.slice_type));
  const afterSlices =
    timelineIndex === -1
      ? []
      : slices
          .slice(timelineIndex)
          .filter((s) => !TIMELINE_SLICE_TYPES.includes(s.slice_type));

  const hasTimelineData =
    (eduSlice?.primary?.educations?.length ?? 0) > 0 ||
    (workSlice?.primary?.experiences?.length ?? 0) > 0;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        {/* Slices before the timeline */}
        <SliceZone slices={beforeSlices} components={components} />

        {/* Unified branching timeline */}
        {hasTimelineData && (
          <BranchingTimeline
            sectionId={
              (eduSlice?.primary?.section_id || "timeline").replace(/^#+/, "")
            }
            heading={eduSlice?.primary?.heading}
            description={eduSlice?.primary?.description}
            educationItems={eduSlice?.primary?.educations || []}
            workItems={workSlice?.primary?.experiences || []}
          />
        )}

        {/* Slices after the timeline */}
        <SliceZone slices={afterSlices} components={components} />
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
