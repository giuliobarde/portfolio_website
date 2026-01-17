"use client";

import React from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Temporary type until Prismic types are generated
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
      technologies?: string; // Comma-separated
    }>;
  };
};

export type WorkExperienceProps = {
  slice: WorkExperienceSlice;
};

/**
 * V4 Component for "WorkExperience" Slices using Prismic data.
 */
const WorkExperience: React.FC<WorkExperienceProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "work";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;
  const experiences = slice.primary.experiences || [];

  const formatDate = (date: string | undefined, isCurrent: boolean = false) => {
    if (!date) return '';
    if (isCurrent) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading || "Work Experience"}
          </h2>
          {slice.primary.description && (
            <div className="text-lg text-muted-foreground max-w-2xl mx-auto prose prose-invert">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "relative grid grid-cols-1 md:grid-cols-2 gap-8",
                    isEven ? "md:text-right" : ""
                  )}
                >
                  {/* Left side (desktop) */}
                  <div className={cn("space-y-2", isEven ? "" : "md:col-start-2")}>
                    <div
                      className={cn(
                        "p-6 rounded-2xl bg-card border border-border",
                        "hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      )}
                    >
                      {/* Company & Position */}
                      <h3 className="text-2xl font-bold mb-1">{exp.company}</h3>
                      <p className="text-xl text-accent font-semibold mb-2">{exp.position}</p>

                      {/* Location & Date */}
                      <div className="flex flex-wrap gap-2 mb-4 text-sm text-muted-foreground">
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(exp.start_date)} - {formatDate(exp.end_date, exp.is_current)}
                        </span>
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <div className="mb-4 prose prose-sm prose-invert max-w-none">
                          <PrismicRichText field={exp.description} />
                        </div>
                      )}

                      {/* Achievements */}
                      {exp.achievements && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Key Achievements</h4>
                          <div className="prose prose-sm prose-invert max-w-none">
                            <PrismicRichText field={exp.achievements} />
                          </div>
                        </div>
                      )}

                      {/* Technologies */}
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.split(',').map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline dot (desktop) */}
                  <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-accent border-4 border-background" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
