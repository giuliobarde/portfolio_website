"use client";

import React from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";

type EducationSlice = {
  slice_type: string;
  variation: string;
  primary: {
    section_id?: string;
    heading?: string;
    description?: RichTextField;
    education_items?: Array<{
      degree?: string;
      field_of_study?: string;
      school?: string;
      location?: string;
      start_date?: string;
      end_date?: string;
      gpa?: string;
      description?: RichTextField;
      coursework?: string;
      achievements?: RichTextField;
    }>;
  };
};

export type EducationProps = {
  slice: EducationSlice;
};

const Education: React.FC<EducationProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "education";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;
  const educationItems = slice.primary.education_items || [];

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }).toLowerCase();
  };

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="font-mono text-xs text-accent mb-2">
            <span className="text-muted-foreground">{"// "}</span>education
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading || "Education"}
          </h2>
          {slice.primary.description && (
            <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </motion.div>

        {/* Education Cards */}
        <div className="space-y-6">
          {educationItems.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="terminal-card overflow-hidden"
            >
              {/* Card header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {edu.school?.toLowerCase().replace(/\s+/g, "-") || "university"}.edu
                </span>
              </div>

              <div className="p-6 space-y-4">
                {/* Degree header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="font-mono text-xl font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    {edu.field_of_study && (
                      <p className="font-mono text-sm text-accent mt-0.5">
                        {edu.field_of_study}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono text-xs text-muted-foreground">
                      <span>{edu.school}</span>
                      {edu.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {edu.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-muted border border-border/50 text-muted-foreground">
                      {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                    </span>
                    {edu.gpa && (
                      <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {edu.description && (
                  <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <PrismicRichText field={edu.description} />
                  </div>
                )}

                {/* Coursework as code block */}
                {edu.coursework && (
                  <div className="p-4 rounded bg-muted/30 border border-border/30">
                    <div className="font-mono text-[10px] text-accent/60 mb-2">
                      # relevant coursework
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.coursework.split(",").map((course, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded font-mono text-[11px] bg-card border border-border/50 text-foreground/80"
                        >
                          {course.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {edu.achievements && (
                  <div className="p-4 rounded bg-muted/30 border border-border/30">
                    <div className="font-mono text-[10px] text-accent/60 mb-2">
                      # achievements
                    </div>
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                      <PrismicRichText field={edu.achievements} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
