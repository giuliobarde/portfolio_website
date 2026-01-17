"use client";

import React from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Temporary type until Prismic types are generated
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
      coursework?: string; // Comma-separated
      achievements?: RichTextField;
    }>;
  };
};

export type EducationProps = {
  slice: EducationSlice;
};

/**
 * V4 Component for "Education" Slices using Prismic data.
 */
const Education: React.FC<EducationProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "education";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;
  const educationItems = slice.primary.education_items || [];

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30"
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
            {slice.primary.heading || "Education"}
          </h2>
          {slice.primary.description && (
            <div className="text-lg text-muted-foreground max-w-2xl mx-auto prose prose-invert">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </motion.div>

        {/* Education Cards */}
        <div className="space-y-8">
          {educationItems.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={cn(
                "p-8 rounded-2xl bg-card border border-border",
                "hover:shadow-xl transition-all duration-300"
              )}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-1">{edu.degree}</h3>
                  {edu.field_of_study && (
                    <p className="text-accent font-medium mb-2">{edu.field_of_study}</p>
                  )}
                  <p className="text-lg text-muted-foreground">{edu.school}</p>
                  {edu.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {edu.location}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className="px-4 py-2 rounded-full bg-secondary text-sm font-medium">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </span>
                  {edu.gpa && (
                    <span className="text-sm font-semibold">GPA: {edu.gpa}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {edu.description && (
                <div className="mb-6">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <PrismicRichText field={edu.description} />
                  </div>
                </div>
              )}

              {/* Coursework */}
              {edu.coursework && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.split(',').map((course, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-secondary text-sm"
                      >
                        {course.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {edu.achievements && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Notable Achievements
                  </h4>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <PrismicRichText field={edu.achievements} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Optional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Committed to continuous learning and professional development
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
