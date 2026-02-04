"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { isFilled, DateField, RichTextField, KeyTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sectionHeaderVariants } from "@/lib/animations";
import SectionDivider from "@/components/v4/SectionDivider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Type definition matching Prismic structure
type EducationSliceVariation = {
  slice_type: "education";
  variation: "default";
  primary: {
    section_id?: KeyTextField;
    educations?: Array<{
      degree?: KeyTextField;
      field_of_study?: KeyTextField;
      school?: KeyTextField;
      location?: KeyTextField;
      start_date?: DateField;
      end_date?: DateField;
      gpa?: KeyTextField;
      achievements?: RichTextField;
      additional_info?: KeyTextField;
      coursework?: KeyTextField | RichTextField;
    }>;
  };
};

export type EducationProps = {
  slice: EducationSliceVariation;
};

// --- ExpandableSection sub-component ---
function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;

    if (isOpen) {
      const height = innerRef.current.offsetHeight;
      gsap.to(contentRef.current, {
        height,
        opacity: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-t border-border/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 font-mono text-[10px] text-accent/60 hover:text-accent hover:bg-muted/20 transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: defaultOpen ? "auto" : 0, opacity: defaultOpen ? 1 : 0 }}>
        <div ref={innerRef} className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Main Education Timeline ---
const Education: React.FC<EducationProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "education";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;
  const educations = useMemo(() => slice.primary.educations || [], [slice.primary.educations]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setEntryRef = useCallback((el: HTMLDivElement | null, index: number) => {
    entryRefs.current[index] = el;
  }, []);

  const setDotRef = useCallback((el: HTMLDivElement | null, index: number) => {
    dotRefs.current[index] = el;
  }, []);

  const formatDate = (dateField: DateField | undefined) => {
    if (!dateField || !isFilled.date(dateField)) return "";
    const date = new Date(dateField);
    return date
      .toLocaleDateString("en-US", { month: "short", year: "numeric" })
      .toLowerCase();
  };

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!timelineRef.current || !progressLineRef.current || educations.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Progress line — scrubs with scroll
      gsap.to(progressLineRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.3,
        },
      });

      // 2. Entry cards — fade + slide in on scroll
      entryRefs.current.forEach((entry) => {
        if (!entry) return;

        gsap.to(entry, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // Stagger internal content
        const staggerChildren = entry.querySelectorAll(".timeline-stagger-child");
        if (staggerChildren.length > 0) {
          gsap.from(staggerChildren, {
            opacity: 0,
            y: 10,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      // 3. Timeline dots — activate on scroll, reverse on leave
      dotRefs.current.forEach((dot, index) => {
        if (!dot) return;
        const entry = entryRefs.current[index];
        if (!entry) return;

        gsap.to(dot, {
          scale: 1.3,
          duration: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: entry,
            start: "top 75%",
            toggleActions: "play none none reverse",
            onEnter: () => dot.classList.add("timeline-dot-active"),
            onLeaveBack: () => dot.classList.remove("timeline-dot-active"),
          },
        });

        // Pulse ring
        const pulseEl = dot.querySelector(".timeline-dot-pulse");
        if (pulseEl) {
          gsap.to(pulseEl, {
            scale: 2.5,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [educations]);

  return (
    <>
      <SectionDivider />
      <section
        id={sectionId}
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header — Framer Motion for consistency */}
          <motion.div
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12"
          >
            <div className="font-mono text-xs text-accent mb-2">
              <span className="text-muted-foreground">{"// "}</span>education
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Education
            </h2>
          </motion.div>

          {/* Timeline container — GSAP territory */}
          <div ref={timelineRef} className="relative pl-8 md:pl-12">
            {/* Background line (full height, dim) */}
            <div className="absolute left-[15px] md:left-[19px] top-0 bottom-0 w-px bg-border/30" />
            {/* Progress line (GSAP scrubs scaleY 0→1) */}
            <div
              ref={progressLineRef}
              className="absolute left-[15px] md:left-[19px] top-0 bottom-0 w-px bg-accent timeline-line-glow origin-top"
              style={{ transform: "scaleY(0)" }}
            />

            <div className="space-y-12">
              {educations.map((edu, index) => (
                <div
                  key={index}
                  ref={(el) => setEntryRef(el, index)}
                  className="relative"
                  style={{ opacity: 0, transform: "translateY(30px)" }}
                >
                  {/* Timeline dot */}
                  <div
                    ref={(el) => setDotRef(el, index)}
                    className="absolute left-[-25px] md:left-[-29px] top-[10px] w-[11px] h-[11px] rounded-full border-2 border-border bg-background z-10 transition-colors duration-300"
                  >
                    {/* Pulse ring */}
                    <div className="timeline-dot-pulse absolute inset-[-3px] rounded-full bg-accent/30 scale-0 opacity-100" />
                  </div>

                  {/* Terminal card */}
                  <div className="terminal-card overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {isFilled.keyText(edu.school)
                          ? edu.school.toLowerCase().replace(/\s+/g, "-")
                          : "university"}.edu
                      </span>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Degree header */}
                      <div className="timeline-stagger-child flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <h3 className="font-mono text-xl font-bold text-foreground">
                            {isFilled.keyText(edu.degree) ? edu.degree : ""}
                          </h3>
                          {isFilled.keyText(edu.field_of_study) && (
                            <p className="font-mono text-sm text-accent mt-0.5">
                              {edu.field_of_study}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-mono text-xs text-muted-foreground">
                            {isFilled.keyText(edu.school) && <span>{edu.school}</span>}
                            {isFilled.keyText(edu.location) && (
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

                        <div className="timeline-stagger-child flex flex-wrap items-center gap-2 shrink-0">
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-muted border border-border/50 text-muted-foreground">
                            {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                          </span>
                          {isFilled.keyText(edu.gpa) && (
                            <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                              GPA: {edu.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable: Achievements */}
                    {isFilled.richText(edu.achievements) && (
                      <ExpandableSection title="# achievements" defaultOpen={index === 0}>
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                          <PrismicRichText field={edu.achievements} />
                        </div>
                      </ExpandableSection>
                    )}

                    {/* Expandable: Coursework */}
                    {edu.coursework && (
                      <ExpandableSection title="# relevant coursework" defaultOpen={index === 0}>
                        {typeof edu.coursework === "string" ? (
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
                        ) : (
                          <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                            <PrismicRichText field={edu.coursework as RichTextField} />
                          </div>
                        )}
                      </ExpandableSection>
                    )}

                    {/* Expandable: Additional Info */}
                    {isFilled.keyText(edu.additional_info) && (
                      <ExpandableSection title="# additional info">
                        <p className="text-sm text-muted-foreground font-mono">
                          {edu.additional_info}
                        </p>
                      </ExpandableSection>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Education;
