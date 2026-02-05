"use client";

import React from "react";
import type { RichTextField } from "@prismicio/client";
import EducationSection, {
  type EducationItem,
} from "@/components/v4/sections/EducationSection";

type EducationSlice = {
  slice_type: string;
  variation: string;
  primary: {
    section_id?: string;
    heading?: string;
    description?: RichTextField;
    educations?: EducationItem[];
  };
};

export type EducationProps = {
  slice: EducationSlice;
};

const Education: React.FC<EducationProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "education";
  const sectionId =
    typeof rawSectionId === "string"
      ? rawSectionId.replace(/^#+/, "")
      : rawSectionId;

  const educationItems = slice.primary.educations || [];

  return (
    <EducationSection
      sectionId={sectionId}
      heading={slice.primary.heading}
      description={slice.primary.description}
      items={educationItems}
    />
  );
};

export default Education;
