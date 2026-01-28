"use client";

import React, { useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import WordSphere from "@/components/WordSphere";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicRichText } from "@prismicio/react";

export type TechListSliceProps = Content.TechListSlice;

const TechList: React.FC<{ slice: TechListSliceProps }> = ({ slice }) => {
  const wordList = slice.primary.tech_skill
    .map((item) => item.skill)
    .filter((skill): skill is string => typeof skill === "string");

  // Default size (avoids SSR-client mismatch)
  const [sphereSize, setSphereSize] = useState<number>(300);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const updateSphereSize = () => {
      const width = window.innerWidth;

      let newSize: number;
      if (width >= 768) {
        // Desktop: width/4, with min 300px and max 500px
        newSize = Math.min(Math.max(width / 4, 300), 500);
      } else {
        // Mobile: width/2.3, with min 200px and max 350px
        newSize = Math.min(Math.max(width / 2.3, 200), 350);
      }

      setSphereSize((prevSize) => {
        if (prevSize !== newSize) {
          setKey((prevKey) => prevKey + 1); // Force re-render
          return newSize;
        }
        return prevSize;
      });
    };

    updateSphereSize(); // Update after mount
    window.addEventListener("resize", updateSphereSize);

    return () => {
      window.removeEventListener("resize", updateSphereSize);
    };
  }, []);

  // Strip # from section_id if present (HTML IDs shouldn't include #)
  const rawSectionId = slice.primary.section_id || "skills";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;
  
  return (
    <Bounded id={sectionId}>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 items-center">
        {/* Left Column - Heading, Text */}
        <div className="flex flex-col space-y-6">
          <Heading as="h2" size="lg">
            {slice.primary.heading}
          </Heading>
          <div className="prose prose-lg md:prose-xl prose-slate prose-invert">
            <PrismicRichText field={slice.primary.tech_description} />
          </div>
        </div>

        {/* Right Column - Centered Sphere */}
        <div
          className="flex justify-center items-center mt-4 md:mt-0"
          style={{ marginTop: "2rem", height: `${sphereSize + 20}px` }} // Ensures vertical centering
        >
          <WordSphere key={key} wordList={wordList} sphereSize={sphereSize} />
        </div>
        <div className="h-[20vh]"></div>
      </div>
    </Bounded>
  );
};

export default TechList;
