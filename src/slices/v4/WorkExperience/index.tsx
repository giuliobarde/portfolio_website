"use client";

import React from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type WorkExperienceSlice = {
  slice_type: string;
  variation: string;
  primary: {
    section_id?: string;
    heading?: string;
    description?: RichTextField;
    experiences?: Array<{
      company?: string;
      position?: string;
      location?: string;
      start_date?: string;
      end_date?: string;
      is_current?: boolean;
      description?: RichTextField;
      achievements?: RichTextField;
      technologies?: string;
    }>;
  };
};

export type WorkExperienceProps = {
  slice: WorkExperienceSlice;
};

const WorkExperience: React.FC<WorkExperienceProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "work";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;
  const experiences = slice.primary.experiences || [];

  const formatDate = (date: string | undefined, isCurrent: boolean = false) => {
    if (!date) return "";
    if (isCurrent) return "present";
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
            <span className="text-muted-foreground">{"// "}</span>experience
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading || "Work Experience"}
          </h2>
          {slice.primary.description && (
            <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </motion.div>

        {/* Git-log style timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/50" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Git commit dot */}
                <div className="absolute left-[14px] top-[10px] w-[11px] h-[11px] rounded-full border-2 border-accent bg-background z-10" />

                {/* Experience card */}
                <div className={cn(
                  "terminal-card overflow-hidden",
                  exp.is_current && "border-accent/30"
                )}>
                  {/* Card header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        exp.is_current ? "bg-green-500 animate-pulse" : "bg-green-500/60"
                      )} />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {exp.company?.toLowerCase().replace(/\s+/g, "-") || "company"}.log
                    </span>
                    {exp.is_current && (
                      <span className="ml-auto font-mono text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Position & Company */}
                    <div>
                      <h3 className="font-mono text-lg font-bold text-foreground">
                        {exp.position}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono text-xs text-muted-foreground">
                        <span className="text-accent">{exp.company}</span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </span>
                        )}
                        <span>
                          {formatDate(exp.start_date)} — {formatDate(exp.end_date, exp.is_current)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                        <PrismicRichText field={exp.description} />
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && (
                      <div className="p-3 rounded bg-muted/30 border border-border/30">
                        <div className="font-mono text-[10px] text-accent/60 mb-1.5">
                          # key achievements
                        </div>
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                          <PrismicRichText field={exp.achievements} />
                        </div>
                      </div>
                    )}

                    {/* Technologies */}
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.technologies.split(",").map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded font-mono text-[10px] bg-accent/10 text-accent border border-accent/20"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
