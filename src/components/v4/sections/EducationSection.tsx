"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

function parseDateTs(date: string | undefined): number | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.getTime();
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

/* ------------------------------------------------------------------ */
/*  Timeline range & marker helpers                                    */
/* ------------------------------------------------------------------ */

interface TimelineRange {
  start: number;
  end: number;
}

function getTimelineRange(items: EducationItem[]): TimelineRange {
  let minDate = Infinity;
  let maxDate = -Infinity;
  for (const item of items) {
    const s = parseDateTs(item.start_date);
    const e = item.end_date ? parseDateTs(item.end_date) : Date.now();
    if (s !== null) minDate = Math.min(minDate, s);
    if (e !== null) maxDate = Math.max(maxDate, e);
  }
  if (minDate === Infinity) minDate = Date.now() - 5 * 365.25 * 86400000;
  if (maxDate === -Infinity) maxDate = Date.now();

  const sd = new Date(minDate);
  const ed = new Date(maxDate);
  const paddedStart = new Date(sd.getFullYear(), sd.getMonth() - 1, 1).getTime();
  const paddedEnd = new Date(ed.getFullYear(), ed.getMonth() + 4, 1).getTime();
  return { start: paddedStart, end: paddedEnd };
}

function dateToPercent(ts: number, range: TimelineRange): number {
  if (range.end === range.start) return 50;
  return ((ts - range.start) / (range.end - range.start)) * 100;
}

interface YearMarker {
  year: number;
  percent: number;
}
interface MonthMarker {
  percent: number;
  month: number;
}

function generateTimeMarkers(range: TimelineRange) {
  const startDate = new Date(range.start);
  const endDate = new Date(range.end);
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const years: YearMarker[] = [];
  const months: MonthMarker[] = [];

  for (let y = startYear; y <= endYear + 1; y++) {
    for (let m = 0; m < 12; m++) {
      const ts = new Date(y, m, 1).getTime();
      if (ts < range.start || ts > range.end) continue;
      const pct = dateToPercent(ts, range);
      if (m === 0) {
        years.push({ year: y, percent: pct });
      } else {
        months.push({ percent: pct, month: m });
      }
    }
  }
  return { years, months };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function EducationSection({
  sectionId = "education",
  heading,
  description,
  items,
}: EducationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const durationLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const setCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    cardRefs.current[i] = el;
  }, []);
  const setDotRef = useCallback((el: HTMLDivElement | null, i: number) => {
    dotRefs.current[i] = el;
  }, []);
  const setDurationLabelRef = useCallback(
    (el: HTMLSpanElement | null, i: number) => {
      durationLabelRefs.current[i] = el;
    },
    []
  );
  const setConnectorRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      connectorRefs.current[i] = el;
    },
    []
  );
  const setSegmentRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      segmentRefs.current[i] = el;
    },
    []
  );

  /* ---- Precompute timeline positions ---- */
  const timelineData = useMemo(() => {
    if (items.length === 0) return null;
    const range = getTimelineRange(items);
    const markers = generateTimeMarkers(range);
    const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44;
    const totalMonths = (range.end - range.start) / MS_PER_MONTH;

    const positions = items.map((edu) => {
      const startTs = parseDateTs(edu.start_date) ?? range.start;
      const endTs = edu.end_date
        ? (parseDateTs(edu.end_date) ?? range.end)
        : Date.now();
      const startPct = dateToPercent(startTs, range);
      const endPct = dateToPercent(endTs, range);
      const midPct = (startPct + endPct) / 2;
      return {
        startPct,
        endPct,
        midPct,
        widthPct: endPct - startPct,
      };
    });

    return { range, markers, positions, totalMonths };
  }, [items]);

  /* ---- Content width in vw (responsive, SSR-safe) ---- */
  const contentWidthVW = useMemo(() => {
    if (!timelineData) return 100;
    const years = timelineData.totalMonths / 12;
    return Math.max(150, years * 30);
  }, [timelineData]);

  /* ---- Mobile detection ---- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---- GSAP: immersive sliding timeline (desktop) ---- */
  const gsapCtxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (
      isMobile ||
      !sectionRef.current ||
      !pinContainerRef.current ||
      !timelineContentRef.current ||
      !timelineData
    )
      return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const section = sectionRef.current!;
        const contentEl = timelineContentRef.current!;
        const totalYears = timelineData.totalMonths / 12;

        // Scroll distance proportional to time span
        const scrollEnd = window.innerHeight * Math.max(3, totalYears * 1.2);

        // Measurements for sliding
        const contentW = contentEl.offsetWidth;
        const center = window.innerWidth / 2;

        // Pin the section
        ScrollTrigger.create({
          trigger: section,
          pin: pinContainerRef.current,
          start: "top top",
          end: () => `+=${scrollEnd}`,
          scrub: true,
          anticipatePin: 1,
          pinSpacing: true,
        });

        // Slide the entire timeline content so the indicator
        // starts at 0% and ends at 100% of the timeline
        gsap.fromTo(
          contentEl,
          { x: center },
          {
            x: -(contentW - center),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${scrollEnd}`,
              scrub: 0.3,
            },
          }
        );

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

        // Per-item animations
        timelineData.positions.forEach((pos, index) => {
          const startFrac = pos.startPct / 100;
          const endFrac = pos.endPct / 100;
          const periodLen = endFrac - startFrac;
          const isAbove = index % 2 === 0;

          // Buffer for appear / disappear (fraction of total scroll)
          const buffer = Math.min(0.06, periodLen * 0.25);
          const rangeStart = Math.max(0, startFrac - buffer);
          const rangeEnd = Math.min(1, endFrac + buffer);
          const totalRange = rangeEnd - rangeStart;
          const appearPart = buffer / totalRange;
          const disappearPart = buffer / totalRange;

          // --- Highlighted segment: fills as indicator passes through ---
          const segment = segmentRefs.current[index];
          if (segment) {
            gsap.fromTo(
              segment,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: `top+=${scrollEnd * startFrac} top`,
                  end: `top+=${scrollEnd * endFrac} top`,
                  scrub: 0.5,
                },
              }
            );
          }

          // --- Dot: appears and stays ---
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
                  start: `top+=${scrollEnd * Math.max(0, startFrac - 0.02)} top`,
                  end: `top+=${scrollEnd * startFrac} top`,
                  scrub: 0.5,
                },
              }
            );
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
                    start: `top+=${scrollEnd * startFrac} top`,
                    end: `top+=${scrollEnd * (startFrac + 0.04)} top`,
                    scrub: 0.5,
                  },
                }
              );
            }
          }

          // --- Duration label: appear + disappear ---
          const label = durationLabelRefs.current[index];
          if (label) {
            const labelTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * rangeStart} top`,
                end: `top+=${scrollEnd * rangeEnd} top`,
                scrub: 0.5,
              },
            });
            labelTl.fromTo(
              label,
              { opacity: 0, scale: 0.7 },
              { opacity: 1, scale: 1, duration: appearPart, ease: "power2.out" },
              0
            );
            labelTl.to(
              label,
              { opacity: 0, scale: 0.7, duration: disappearPart, ease: "power2.in" },
              1 - disappearPart
            );
          }

          // --- Connector: appear + disappear ---
          const connector = connectorRefs.current[index];
          if (connector) {
            const connTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * rangeStart} top`,
                end: `top+=${scrollEnd * rangeEnd} top`,
                scrub: 0.5,
              },
            });
            connTl.fromTo(
              connector,
              { scaleY: 0, opacity: 0 },
              { scaleY: 1, opacity: 1, duration: appearPart, ease: "power2.out" },
              0
            );
            connTl.to(
              connector,
              { scaleY: 0, opacity: 0, duration: disappearPart, ease: "power2.in" },
              1 - disappearPart
            );
          }

          // --- Card: appear + zoom-out disappear ---
          const card = cardRefs.current[index];
          if (card) {
            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * rangeStart} top`,
                end: `top+=${scrollEnd * rangeEnd} top`,
                scrub: 0.8,
              },
            });

            // Appear: slide in from direction + scale up + fade in
            cardTl.fromTo(
              card,
              { opacity: 0, y: isAbove ? -50 : 50, scale: 0.85 },
              { opacity: 1, y: 0, scale: 1, duration: appearPart, ease: "power3.out" },
              0
            );

            // Disappear: zoom out + fade out
            cardTl.to(
              card,
              { opacity: 0, scale: 0.8, duration: disappearPart, ease: "power2.in" },
              1 - disappearPart
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
  }, [isMobile, items.length, timelineData, contentWidthVW]);

  /* ---- Shared helpers ---- */
  const parseCoursework = (coursework?: string): string[] => {
    if (!coursework) return [];
    return coursework
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  };

  const hasRichText = (field?: RichTextField): boolean => {
    if (!field || !Array.isArray(field) || field.length === 0) return false;
    return field.some(
      (block) =>
        "text" in block &&
        typeof block.text === "string" &&
        block.text.trim() !== ""
    );
  };

  /* ================================================================ */
  /*  Desktop: Immersive sliding timeline                              */
  /* ================================================================ */
  if (!isMobile && timelineData) {
    const { markers, positions } = timelineData;

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
          {/* Section Header */}
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

          {/* Timeline area — fills remaining viewport height */}
          <div className="flex-1 relative overflow-hidden">
            {/* ---- Fixed center indicator (playhead) ---- */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
              {/* Upper gradient line */}
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-accent/10 to-accent/25" />
              {/* Glowing dot on the timeline */}
              <div className="relative flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_3px] shadow-accent/30 z-10" />
                <div
                  className="absolute w-6 h-6 rounded-full bg-accent/15 animate-ping"
                  style={{ animationDuration: "2s" }}
                />
              </div>
              {/* Lower gradient line */}
              <div className="flex-1 w-px bg-gradient-to-t from-transparent via-accent/10 to-accent/25" />
            </div>

            {/* ---- Sliding timeline content ---- */}
            <div
              ref={timelineContentRef}
              className="absolute top-0 bottom-0 left-0 will-change-transform"
              style={{ width: `${contentWidthVW}vw` }}
            >
              {/* Track + markers at vertical center */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                {/* Background track line */}
                <div className="h-[2px] w-full bg-border/20 rounded-full" />

                {/* Highlighted segments for each education period */}
                {items.map((_, index) => {
                  const pos = positions[index];
                  return (
                    <div
                      key={`seg-${index}`}
                      ref={(el) => setSegmentRef(el, index)}
                      className="absolute top-0 h-[2px] bg-accent rounded-full origin-left shadow-[0_0_6px_1px] shadow-accent/40"
                      style={{
                        left: `${pos.startPct}%`,
                        width: `${pos.widthPct}%`,
                        transform: "scaleX(0)",
                      }}
                    />
                  );
                })}

                {/* Year labels below the track */}
                {markers.years.map((yr) => (
                  <div
                    key={yr.year}
                    className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${yr.percent}%`, top: "2px" }}
                  >
                    <div className="w-px h-[10px] bg-border/40" />
                    <span className="mt-0.5 font-mono text-[10px] text-muted-foreground/50 font-semibold select-none">
                      {yr.year}
                    </span>
                  </div>
                ))}

                {/* Month ticks below the track */}
                {markers.months.map((mo, i) => (
                  <div
                    key={`mo-${i}`}
                    className="absolute -translate-x-1/2 pointer-events-none"
                    style={{ left: `${mo.percent}%`, top: "2px" }}
                  >
                    <div
                      className={`w-px ${
                        mo.month % 3 === 0
                          ? "h-[6px] bg-border/25"
                          : "h-[3px] bg-border/12"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Education items positioned along the timeline */}
              {items.map((edu, index) => {
                const pos = positions[index];
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
                      left: `${pos.midPct}%`,
                      top: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      ref={(el) => setDotRef(el, index)}
                      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-accent bg-background z-20 opacity-0"
                    >
                      <div className="tl-dot-pulse absolute inset-[-6px] rounded-full bg-accent/40" />
                    </div>

                    {/* Duration label */}
                    <span
                      ref={(el) => setDurationLabelRef(el, index)}
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
                        width: "clamp(340px, 28vw, 460px)",
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
                          <div>
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
                            <div>
                              <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                                GPA: {edu.gpa}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          {hasRichText(edu.description) && (
                            <div className="text-xs font-mono text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={edu.description} />
                            </div>
                          )}

                          {/* Coursework */}
                          {courses.length > 0 && (
                            <div>
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
                            <div>
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

            {/* Scroll hint (stays fixed, not inside sliding container) */}
            <div
              ref={scrollHintRef}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30"
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

  /* ================================================================ */
  /*  Mobile: Vertical timeline fallback                               */
  /* ================================================================ */
  return (
    <section id={sectionId} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
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
