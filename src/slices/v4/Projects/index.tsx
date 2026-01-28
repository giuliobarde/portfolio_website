"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { motion } from "framer-motion";
import ProjectCarousel from "@/components/v4/ProjectCarousel";

export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

const Projects: FC<ProjectsProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "projects";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;
  const projectList = slice.primary.projects;

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="font-mono text-xs text-accent mb-2">
            <span className="text-muted-foreground">{"// "}</span>projects
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading}
          </h2>
          {isFilled.richText(slice.primary.decsription) && (
            <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
              <PrismicRichText field={slice.primary.decsription} />
            </div>
          )}
        </motion.div>

        <ProjectCarousel projectList={projectList} />
      </div>
    </section>
  );
};

export default Projects;
