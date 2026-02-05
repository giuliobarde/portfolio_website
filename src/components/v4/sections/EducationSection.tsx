"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";
import { sectionHeaderVariants } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface EducationItem {
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
}

export interface EducationSectionProps {
  sectionId?: string;
  heading?: string;
  description?: RichTextField;
  items: EducationItem[];
}

function formatDate(date: string | undefined): string {
  if (!date) return "";
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
}

function formatDuration(start?: string, end?: string): string {
  const s = formatDate(start);
  const e = end ? formatDate(end) : "present";
  if (!s && !e) return "";
  return `${s} — ${e}`;
}

export default function EducationSection({
  sectionId = "education",
  heading,
  description,
  items,
}: EducationSectionProps) {
  // Debug: log items received
  console.log("[EducationSection] items received:", items.length, items);

  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const setCardRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      cardRefs.current[index] = el;
    },
    []
  );

  const setDotRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      dotRefs.current[index] = el;
    },
    []
  );

  const setYearRef = useCallback(
    (el: HTMLSpanElement | null, index: number) => {
      yearRefs.current[index] = el;
    },
    []
  );

  const setConnectorRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      connectorRefs.current[index] = el;
    },
    []
  );

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP pinned horizontal timeline animation (desktop only)
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (isMobile) return;
    if (!sectionRef.current || !pinContainerRef.current) return;
    if (items.length === 0) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const section = sectionRef.current!;
        const totalCards = items.length;
        const scrollEnd = window.innerHeight * (totalCards + 1);

        // Create main ScrollTrigger that pins the section
        ScrollTrigger.create({
          trigger: section,
          pin: pinContainerRef.current,
          start: "top top",
          end: () => `+=${scrollEnd}`,
          scrub: true,
          anticipatePin: 1,
          pinSpacing: true,
        });

        // Animate the timeline progress line
        if (timelineProgressRef.current) {
          gsap.fromTo(
            timelineProgressRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${scrollEnd}`,
                scrub: 0.5,
              },
            }
          );
        }

        // Fade out scroll hint
        if (scrollHintRef.current) {
          gsap.to(scrollHintRef.current, {
            opacity: 0,
            y: 10,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * 0.3}`,
              scrub: true,
            },
          });
        }

        // Animate each card, dot, year label, and connector in sequence
        cardRefs.current.forEach((card, index) => {
          if (!card) return;

          const startFraction = (index + 0.3) / (totalCards + 1);
          const endFraction = (index + 0.85) / (totalCards + 1);

          // Card: slide in from above/below and fade in
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: index % 2 === 0 ? -60 : 60,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * startFraction} top`,
                end: `top+=${scrollEnd * endFraction} top`,
                scrub: 0.8,
              },
            }
          );

          // Stagger internal content
          const children = card.querySelectorAll(".tl-stagger");
          if (children.length > 0) {
            gsap.fromTo(
              children,
              { opacity: 0, y: 15 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.04,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: `top+=${scrollEnd * (startFraction + 0.05)} top`,
                  end: `top+=${scrollEnd * endFraction} top`,
                  scrub: 0.8,
                },
              }
            );
          }

          // Dot: scale in with bounce
          const dot = dotRefs.current[index];
          if (dot) {
            gsap.fromTo(
              dot,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: section,
                  start: `top+=${scrollEnd * (startFraction - 0.05)} top`,
                  end: `top+=${scrollEnd * startFraction} top`,
                  scrub: 0.5,
                  onEnter: () => dot.classList.add("timeline-dot-active"),
                  onLeaveBack: () =>
                    dot.classList.remove("timeline-dot-active"),
                },
              }
            );

            // Pulse ring
            const pulse = dot.querySelector(".tl-dot-pulse");
            if (pulse) {
              gsap.fromTo(
                pulse,
                { scale: 0.5, opacity: 1 },
                {
                  scale: 3,
                  opacity: 0,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: section,
                    start: `top+=${scrollEnd * startFraction} top`,
                    end: `top+=${scrollEnd * (startFraction + 0.08)} top`,
                    scrub: 0.5,
                  },
                }
              );
            }
          }

          // Year label
          const year = yearRefs.current[index];
          if (year) {
            gsap.fromTo(
              year,
              { opacity: 0, scale: 0.7 },
              {
                opacity: 1,
                scale: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: `top+=${scrollEnd * (startFraction - 0.03)} top`,
                  end: `top+=${scrollEnd * startFraction} top`,
                  scrub: 0.5,
                },
              }
            );
          }

          // Connector line from dot to card
          const connector = connectorRefs.current[index];
          if (connector) {
            gsap.fromTo(
              connector,
              { scaleY: 0, opacity: 0 },
              {
                scaleY: 1,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: `top+=${scrollEnd * (startFraction - 0.02)} top`,
                  end: `top+=${scrollEnd * (startFraction + 0.05)} top`,
                  scrub: 0.5,
                },
              }
            );
          }
        });
      }, sectionRef);

      gsapCtxRef.current = ctx;
    }, 150);

    return () => {
      clearTimeout(timer);
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, [isMobile, items.length]);

  // Shared helper: parse coursework comma-separated string into array
  const parseCoursework = (coursework?: string): string[] => {
    if (!coursework) return [];
    return coursework
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  };

  // Shared helper: check if a RichTextField has actual content
  const hasRichText = (field?: RichTextField): boolean => {
    if (!field || !Array.isArray(field) || field.length === 0) return false;
    return field.some(
      (block) => "text" in block && typeof block.text === "string" && block.text.trim() !== ""
    );
  };

  // Desktop: Pinned horizontal timeline
  if (!isMobile) {
    return (
      <section
        ref={sectionRef}
        id={sectionId}
        className="relative z-10 bg-background"
      >
        <div
          ref={pinContainerRef}
          className="relative h-screen w-full overflow-hidden flex flex-col"
        >
          {/* Section Header — top area */}
          <div className="pt-16 sm:pt-20 pb-4 px-4 sm:px-6 lg:px-8 flex-shrink-0">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={sectionHeaderVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                <div className="font-mono text-xs text-accent mb-2">
                  <span className="text-muted-foreground">{"// "}</span>
                  education
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  {heading || "Education"}
                </h2>
                {description && hasRichText(description) ? (
                  <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
                    <PrismicRichText field={description} />
                  </div>
                ) : (
                  <p className="text-base text-muted-foreground max-w-2xl">
                    Academic background and continuous learning journey
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Timeline area — fills remaining space */}
          <div className="flex-1 relative flex items-center">
            {/* Horizontal timeline track (centered vertically) */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-8 sm:px-16">
              {/* Background track line */}
              <div
                ref={timelineTrackRef}
                className="h-[2px] w-full bg-border/20 rounded-full"
              />
              {/* Progress line */}
              <div
                ref={timelineProgressRef}
                className="absolute top-0 left-0 right-0 h-[2px] bg-accent rounded-full origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Education items positioned along the timeline */}
            <div className="absolute inset-0 px-8 sm:px-16">
              {items.map((edu, index) => {
                const positionPercent =
                  ((index + 1) / (items.length + 1)) * 100;
                const isAbove = index % 2 === 0;
                const duration = formatDuration(edu.start_date, edu.end_date);
                const courses = parseCoursework(edu.coursework);
                const schoolSlug =
                  edu.school?.toLowerCase().replace(/\s+/g, "-") ||
                  "university";

                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${positionPercent}%`,
                      top: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      ref={(el) => setDotRef(el, index)}
                      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-border bg-background z-20 transition-colors duration-300 opacity-0"
                    >
                      <div className="tl-dot-pulse absolute inset-[-6px] rounded-full bg-accent/40" />
                      <div className="absolute inset-[3px] rounded-full bg-accent/0 transition-all duration-300" />
                    </div>

                    {/* Year label */}
                    <span
                      ref={(el) => setYearRef(el, index)}
                      className={`absolute left-1/2 -translate-x-1/2 font-mono text-[11px] font-semibold text-accent whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 opacity-0 ${
                        isAbove ? "top-[16px]" : "bottom-[16px]"
                      }`}
                    >
                      {duration}
                    </span>

                    {/* Connector line from dot to card */}
                    <div
                      ref={(el) => setConnectorRef(el, index)}
                      className={`absolute left-1/2 -translate-x-1/2 w-px bg-accent/40 opacity-0 ${
                        isAbove
                          ? "bottom-[8px] h-[40px] origin-bottom"
                          : "top-[8px] h-[40px] origin-top"
                      }`}
                      style={{ transform: "translateX(-50%) scaleY(0)" }}
                    />

                    {/* Terminal card */}
                    <div
                      ref={(el) => setCardRef(el, index)}
                      className={`absolute left-1/2 -translate-x-1/2 opacity-0 ${
                        isAbove ? "bottom-[56px]" : "top-[56px]"
                      }`}
                      style={{
                        width: "clamp(340px, 32vw, 480px)",
                      }}
                    >
                      <div className="terminal-card overflow-hidden shadow-lg shadow-black/10">
                        {/* Terminal header bar */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/60" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                            <div className="w-2 h-2 rounded-full bg-green-500/60" />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {schoolSlug}.edu
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          {/* Degree header */}
                          <div className="tl-stagger">
                            <h3 className="font-mono text-base font-bold text-foreground leading-tight">
                              {edu.degree}
                            </h3>
                            {edu.field_of_study && (
                              <p className="font-mono text-xs text-accent mt-0.5">
                                {edu.field_of_study}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-[11px] text-muted-foreground">
                              <span>{edu.school}</span>
                              {edu.location && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {edu.location}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* GPA badge */}
                          {edu.gpa && (
                            <div className="tl-stagger">
                              <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                                GPA: {edu.gpa}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          {hasRichText(edu.description) && (
                            <div className="tl-stagger text-xs font-mono text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={edu.description} />
                            </div>
                          )}

                          {/* Coursework */}
                          {courses.length > 0 && (
                            <div className="tl-stagger">
                              <h4 className="font-mono text-[10px] text-accent/60 uppercase tracking-wide mb-1.5">
                                # relevant coursework
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {courses.map((course) => (
                                  <span
                                    key={course}
                                    className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-card border border-border/50 text-foreground/80"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Achievements */}
                          {hasRichText(edu.achievements) && (
                            <div className="tl-stagger">
                              <h4 className="font-mono text-[10px] text-accent/60 uppercase tracking-wide mb-1.5">
                                # achievements
                              </h4>
                              <div className="text-xs font-mono prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                                <PrismicRichText field={edu.achievements} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll hint */}
            <div
              ref={scrollHintRef}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            >
              <span className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase">
                scroll to explore
              </span>
              <div className="w-5 h-8 rounded-full border border-border/40 flex items-start justify-center pt-1.5">
                <motion.div
                  className="w-1 h-1.5 rounded-full bg-accent/60"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mobile: Vertical timeline fallback
  return (
    <section
      id={sectionId}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
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
            {heading || "Education"}
          </h2>
          {description && hasRichText(description) ? (
            <div className="text-lg text-muted-foreground prose dark:prose-invert">
              <PrismicRichText field={description} />
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">
              Academic background and continuous learning journey
            </p>
          )}
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative pl-8">
          {/* Background line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/30" />

          <div className="space-y-10">
            {items.map((edu, index) => {
              const duration = formatDuration(edu.start_date, edu.end_date);
              const courses = parseCoursework(edu.coursework);
              const schoolSlug =
                edu.school?.toLowerCase().replace(/\s+/g, "-") || "university";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-25px] top-[10px] w-[11px] h-[11px] rounded-full border-2 border-accent bg-background z-10" />

                  {/* Terminal card */}
                  <div className="terminal-card overflow-hidden">
                    {/* Terminal header bar */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {schoolSlug}.edu
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-mono text-lg font-bold text-foreground">
                          {edu.degree}
                        </h3>
                        {edu.field_of_study && (
                          <p className="font-mono text-sm text-accent mt-0.5">
                            {edu.field_of_study}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-xs text-muted-foreground">
                          <span>{edu.school}</span>
                          {edu.location && <span>{edu.location}</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {duration && (
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-muted border border-border/50 text-muted-foreground">
                            {duration}
                          </span>
                        )}
                        {edu.gpa && (
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {hasRichText(edu.description) && (
                        <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                          <PrismicRichText field={edu.description} />
                        </div>
                      )}

                      {courses.length > 0 && (
                        <div>
                          <h4 className="font-mono text-[10px] text-accent/60 uppercase tracking-wide mb-1.5">
                            # relevant coursework
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {courses.map((course) => (
                              <span
                                key={course}
                                className="px-2 py-0.5 rounded font-mono text-[11px] bg-card border border-border/50 text-foreground/80"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {hasRichText(edu.achievements) && (
                        <div>
                          <h4 className="font-mono text-[10px] text-accent/60 uppercase tracking-wide mb-1.5">
                            # achievements
                          </h4>
                          <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                            <PrismicRichText field={edu.achievements} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
