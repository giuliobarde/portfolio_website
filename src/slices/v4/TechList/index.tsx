"use client";

import React from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TechListProps = {
  slice: Content.TechListSlice;
};

/**
 * V4 Component for "TechList" Slices (Skills section) using Prismic data.
 */
const TechList: React.FC<TechListProps> = ({ slice }) => {
  const wordList = slice.primary.tech_skill
    .map((item) => item.skill)
    .filter((skill): skill is string => typeof skill === "string");

  const rawSectionId = slice.primary.section_id || "skills";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading}
          </h2>
          {isFilled.richText(slice.primary.tech_description) && (
            <div className="text-lg text-muted-foreground max-w-2xl mx-auto prose prose-invert">
              <PrismicRichText field={slice.primary.tech_description} />
            </div>
          )}
        </motion.div>

        {/* Skills Cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto"
        >
          {wordList.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -2, 2, -2, 0],
                transition: { duration: 0.3 },
              }}
              className={cn(
                "px-6 py-3 rounded-full",
                "bg-card border border-border",
                "hover:bg-accent hover:text-accent-foreground",
                "hover:border-accent hover:shadow-lg",
                "transition-all duration-300 cursor-default",
                "font-medium text-sm sm:text-base"
              )}
            >
              {skill}
            </motion.div>
          ))}
        </motion.div>

        {/* Optional: Stats or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Always learning and exploring new technologies
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechList;
