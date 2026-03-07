"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";
import { sectionHeaderVariants } from "@/lib/animations";
import {
  type EducationItem,
  type WorkItem,
  getStableNow,
  parseDateTs,
  formatDuration,
  getTimelineRange,
  generateTimeMarkers,
  computePositions,
  computeBranchLanes,
  hasRichText,
} from "@/lib/timeline-utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Vertical offset (px) from main line center to lane 0 */
const LANE_OFFSET = 60;
/** Vertical spacing (px) between adjacent lanes */
const LANE_SPACING = 80;
/** Horizontal run (in percentage points) consumed by the 45° diagonal */
const DIAGONAL_RUN_PCT = 1.2;

function laneY(laneIndex: number): number {
  return LANE_OFFSET + laneIndex * LANE_SPACING;
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface BranchingTimelineProps {
  sectionId?: string;
  heading?: string;
  description?: RichTextField;
  educationItems: EducationItem[];
  workItems: WorkItem[];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BranchingTimeline({
  sectionId = "timeline",
  heading,
  description,
  educationItems,
  workItems,
}: BranchingTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Education refs
  const eduCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eduDotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eduDurationLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const eduConnectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const eduSegmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Work refs
  const workCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const workDurationLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const workConnectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const workSegmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const branchPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  // Ref setters
  const setEduCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    eduCardRefs.current[i] = el;
  }, []);
  const setEduDotRef = useCallback((el: HTMLDivElement | null, i: number) => {
    eduDotRefs.current[i] = el;
  }, []);
  const setEduDurationLabelRef = useCallback(
    (el: HTMLSpanElement | null, i: number) => {
      eduDurationLabelRefs.current[i] = el;
    },
    [],
  );
  const setEduConnectorRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      eduConnectorRefs.current[i] = el;
    },
    [],
  );
  const setEduSegmentRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      eduSegmentRefs.current[i] = el;
    },
    [],
  );
  const setWorkCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    workCardRefs.current[i] = el;
  }, []);
  const setWorkDurationLabelRef = useCallback(
    (el: HTMLSpanElement | null, i: number) => {
      workDurationLabelRefs.current[i] = el;
    },
    [],
  );
  const setWorkConnectorRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      workConnectorRefs.current[i] = el;
    },
    [],
  );
  const setWorkSegmentRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      workSegmentRefs.current[i] = el;
    },
    [],
  );
  const setBranchPathRef = useCallback(
    (el: SVGPathElement | null, i: number) => {
      branchPathRefs.current[i] = el;
    },
    [],
  );

  /* ---- Precompute timeline layout ---- */
  const timelineData = useMemo(() => {
    if (educationItems.length === 0 && workItems.length === 0) return null;
    const now = getStableNow();
    const allEntries = [
      ...educationItems.map((e) => ({
        start_date: e.start_date,
        end_date: e.end_date,
      })),
      ...workItems.map((w) => ({
        start_date: w.start_date,
        end_date: w.end_date,
      })),
    ];
    const range = getTimelineRange(allEntries, now);
    const markers = generateTimeMarkers(range);
    const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44;
    const totalMonths = (range.end - range.start) / MS_PER_MONTH;

    const eduPositions = computePositions(educationItems, range, now);
    const branches = computeBranchLanes(workItems, range, now);
    const maxLane = branches.reduce(
      (max, b) => Math.max(max, b.laneIndex),
      -1,
    );

    return { range, markers, eduPositions, branches, totalMonths, maxLane, now };
  }, [educationItems, workItems]);

  /* ---- Content width in vw ---- */
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

  /* ---- GSAP animations (desktop) ---- */
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

        const scrollEnd = window.innerHeight * Math.max(3, totalYears * 1.2);
        const contentW = contentEl.offsetWidth;
        const center = window.innerWidth / 2;

        // Pin section
        ScrollTrigger.create({
          trigger: section,
          pin: pinContainerRef.current,
          start: "top top",
          end: () => `+=${scrollEnd}`,
          scrub: true,
          anticipatePin: 1,
          pinSpacing: true,
        });

        // Slide content
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
          },
        );

        // Fade scroll hint
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

        const GAP = 0.05;

        /* ---- Education item animations ---- */
        timelineData.eduPositions.forEach((pos, index) => {
          const startFrac = pos.startPct / 100;
          const endFrac = pos.endPct / 100;
          const periodLen = endFrac - startFrac;
          const buffer = Math.min(0.06, periodLen * 0.25);

          const prevEndFrac =
            index > 0
              ? timelineData.eduPositions[index - 1].endPct / 100
              : -Infinity;
          const nextStartFrac =
            index < timelineData.eduPositions.length - 1
              ? timelineData.eduPositions[index + 1].startPct / 100
              : Infinity;

          const rangeStart = Math.max(0, startFrac - buffer, prevEndFrac + GAP);
          const rangeEnd = Math.min(
            1,
            endFrac + buffer,
            nextStartFrac - GAP,
          );
          const totalRange = rangeEnd - rangeStart;
          const appearPart =
            Math.min(buffer, totalRange * 0.2) / totalRange;
          const disappearPart =
            Math.min(buffer, totalRange * 0.2) / totalRange;

          // Segment fill
          const segment = eduSegmentRefs.current[index];
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
              },
            );
          }

          // Dot
          const dot = eduDotRefs.current[index];
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
              },
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
                },
              );
            }
          }

          // Duration label
          const label = eduDurationLabelRefs.current[index];
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
              {
                opacity: 1,
                scale: 1,
                duration: appearPart,
                ease: "power2.out",
              },
              0,
            );
            labelTl.to(
              label,
              {
                opacity: 0,
                scale: 0.7,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
            );
          }

          // Connector
          const connector = eduConnectorRefs.current[index];
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
              {
                scaleY: 1,
                opacity: 1,
                duration: appearPart,
                ease: "power2.out",
              },
              0,
            );
            connTl.to(
              connector,
              {
                scaleY: 0,
                opacity: 0,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
            );
          }

          // Card
          const card = eduCardRefs.current[index];
          if (card) {
            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * rangeStart} top`,
                end: `top+=${scrollEnd * rangeEnd} top`,
                scrub: 0.8,
              },
            });
            cardTl.fromTo(
              card,
              { opacity: 0, y: -50, scale: 0.85 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: appearPart,
                ease: "power3.out",
              },
              0,
            );
            cardTl.to(
              card,
              {
                opacity: 0,
                scale: 0.8,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
            );
          }
        });

        /* ---- Work branch animations ---- */
        timelineData.branches.forEach((branch, bIdx) => {
          const startFrac = branch.startPct / 100;
          const endFrac = branch.endPct / 100;
          const periodLen = endFrac - startFrac;
          const buffer = Math.min(0.06, periodLen * 0.25);

          // Diagonal starts slightly before the job period
          const diagStartFrac = Math.max(
            0,
            startFrac - DIAGONAL_RUN_PCT / 100,
          );
          const diagEndFrac = Math.min(1, endFrac + DIAGONAL_RUN_PCT / 100);

          const rangeStart = Math.max(0, diagStartFrac - buffer);
          const rangeEnd = Math.min(1, diagEndFrac + buffer);
          const totalRange = rangeEnd - rangeStart;
          const appearPart =
            Math.min(buffer, totalRange * 0.2) / totalRange;
          const disappearPart =
            Math.min(buffer, totalRange * 0.2) / totalRange;

          // Branch SVG path draw
          const path = branchPathRefs.current[bIdx];
          if (path) {
            const pathLength = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
            });
            gsap.to(path, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * diagStartFrac} top`,
                end: `top+=${scrollEnd * diagEndFrac} top`,
                scrub: 0.5,
              },
            });
          }

          // Work segment fill (on the branch lane)
          const segment = workSegmentRefs.current[bIdx];
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
              },
            );
          }

          // Work duration label
          const label = workDurationLabelRefs.current[bIdx];
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
              {
                opacity: 1,
                scale: 1,
                duration: appearPart,
                ease: "power2.out",
              },
              0,
            );
            labelTl.to(
              label,
              {
                opacity: 0,
                scale: 0.7,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
            );
          }

          // Work connector
          const connector = workConnectorRefs.current[bIdx];
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
              {
                scaleY: 1,
                opacity: 1,
                duration: appearPart,
                ease: "power2.out",
              },
              0,
            );
            connTl.to(
              connector,
              {
                scaleY: 0,
                opacity: 0,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
            );
          }

          // Work card (enters from below)
          const card = workCardRefs.current[bIdx];
          if (card) {
            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: `top+=${scrollEnd * rangeStart} top`,
                end: `top+=${scrollEnd * rangeEnd} top`,
                scrub: 0.8,
              },
            });
            cardTl.fromTo(
              card,
              { opacity: 0, y: 50, scale: 0.85 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: appearPart,
                ease: "power3.out",
              },
              0,
            );
            cardTl.to(
              card,
              {
                opacity: 0,
                scale: 0.8,
                duration: disappearPart,
                ease: "power2.in",
              },
              1 - disappearPart,
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
  }, [isMobile, educationItems.length, workItems.length, timelineData, contentWidthVW]);

  /* ---- Helpers ---- */
  const parseCoursework = (coursework?: string): string[] => {
    if (!coursework) return [];
    return coursework
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  };

  // Merge and sort all entries chronologically (most recent first) — for mobile
  const allEntries = useMemo(() => {
    const entries: Array<{
      type: "education" | "work";
      sortTs: number;
      education?: EducationItem;
      work?: WorkItem;
    }> = [];

    for (const edu of educationItems) {
      const ts = parseDateTs(edu.start_date) ?? 0;
      entries.push({ type: "education", sortTs: ts, education: edu });
    }
    for (const work of workItems) {
      const ts = parseDateTs(work.start_date) ?? 0;
      entries.push({ type: "work", sortTs: ts, work });
    }

    return entries.sort((a, b) => b.sortTs - a.sortTs);
  }, [educationItems, workItems]);

  /* ================================================================ */
  /*  Desktop: Immersive branching timeline                            */
  /* ================================================================ */
  if (!isMobile && timelineData) {
    const { markers, eduPositions, branches, maxLane } = timelineData;

    // Compute total height needed for branches below the main line
    const branchAreaHeight = maxLane >= 0 ? laneY(maxLane) + 40 : 0;

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
                  timeline
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  {heading || "Education & Experience"}
                </h2>
                {description && hasRichText(description) ? (
                  <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
                    <PrismicRichText field={description} />
                  </div>
                ) : (
                  <p className="text-base text-muted-foreground max-w-2xl">
                    Academic background and professional journey
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Timeline area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Fixed center playhead */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
              <div className="flex-1 w-px bg-gradient-to-b from-transparent via-accent/10 to-accent/25" />
              <div
                className="relative flex items-center justify-center"
                style={{ marginTop: `-${branchAreaHeight / 2}px` }}
              >
                <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_3px] shadow-accent/30 z-10" />
                <div
                  className="absolute w-6 h-6 rounded-full bg-accent/15 animate-ping"
                  style={{ animationDuration: "2s" }}
                />
              </div>
              <div className="flex-1 w-px bg-gradient-to-t from-transparent via-accent/10 to-accent/25" />
            </div>

            {/* Sliding content */}
            <div
              ref={timelineContentRef}
              className="absolute top-0 bottom-0 left-0 will-change-transform"
              style={{ width: `${contentWidthVW}vw` }}
            >
              {/* Main track area — positioned with room for branches below */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `calc(50% - ${branchAreaHeight / 2}px)`,
                }}
              >
                {/* Background main track line */}
                <div className="h-[2px] w-full bg-border/20 rounded-full" />

                {/* Education highlighted segments */}
                {educationItems.map((_, index) => {
                  const pos = eduPositions[index];
                  return (
                    <div
                      key={`edu-seg-${index}`}
                      ref={(el) => setEduSegmentRef(el, index)}
                      className="absolute top-0 h-[2px] bg-accent rounded-full origin-left shadow-[0_0_6px_1px] shadow-accent/40"
                      style={{
                        left: `${pos.startPct}%`,
                        width: `${pos.widthPct}%`,
                        transform: "scaleX(0)",
                      }}
                    />
                  );
                })}

                {/* Work branch highlighted segments (on their lanes) */}
                {branches.map((branch, bIdx) => (
                  <div
                    key={`work-seg-${bIdx}`}
                    ref={(el) => setWorkSegmentRef(el, bIdx)}
                    className="absolute h-[2px] rounded-full origin-left shadow-[0_0_6px_1px]"
                    style={{
                      left: `${branch.startPct}%`,
                      width: `${branch.widthPct}%`,
                      top: `${laneY(branch.laneIndex)}px`,
                      transform: "scaleX(0)",
                      backgroundColor: "hsl(var(--cyan))",
                      boxShadow: "0 0 6px 1px hsl(var(--cyan) / 0.4)",
                    }}
                  />
                ))}

                {/* SVG branch paths (diagonal + parallel + diagonal) */}
                <svg
                  className="absolute inset-0 pointer-events-none overflow-visible"
                  viewBox={`0 0 100 ${branchAreaHeight + 40}`}
                  preserveAspectRatio="none"
                  style={{
                    width: "100%",
                    height: `${branchAreaHeight + 40}px`,
                    top: 0,
                  }}
                >
                  {branches.map((branch, bIdx) => {
                    // SVG viewBox is 0-100 on x-axis, mapping to percentages
                    const diagRunPct = DIAGONAL_RUN_PCT;
                    const x1 = branch.startPct;
                    const x2 = branch.startPct + diagRunPct;
                    const x3 = Math.max(branch.endPct - diagRunPct, x2);
                    const x4 = branch.endPct;
                    const mainY = 1;
                    const branchY = laneY(branch.laneIndex);

                    const d = `M ${x1} ${mainY} L ${x2} ${branchY} L ${x3} ${branchY} L ${x4} ${mainY}`;

                    return (
                      <path
                        key={`branch-path-${bIdx}`}
                        ref={(el) => setBranchPathRef(el, bIdx)}
                        d={d}
                        fill="none"
                        stroke="hsl(var(--cyan))"
                        strokeWidth={2}
                        strokeOpacity={0.5}
                        vectorEffect="non-scaling-stroke"
                        className="branch-path"
                      />
                    );
                  })}
                </svg>

                {/* Year labels */}
                {markers.years.map((yr) => (
                  <div
                    key={yr.year}
                    className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none"
                    style={{ left: `${yr.percent}%`, top: "-20px" }}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground/50 font-semibold select-none">
                      {yr.year}
                    </span>
                    <div className="w-px h-[10px] bg-border/40" />
                  </div>
                ))}

                {/* Month ticks */}
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

              {/* Education dots (inside sliding container) */}
              {educationItems.map((_, index) => {
                const pos = eduPositions[index];
                return (
                  <div
                    key={`edu-dot-${index}`}
                    ref={(el) => setEduDotRef(el, index)}
                    className="absolute w-4 h-4 rounded-full border-2 border-accent bg-background z-20 opacity-0"
                    style={{
                      left: `${pos.startPct}%`,
                      top: `calc(50% - ${branchAreaHeight / 2}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="tl-dot-pulse absolute inset-[-6px] rounded-full bg-accent/40" />
                  </div>
                );
              })}
            </div>

            {/* Fixed card overlay (centered, NOT sliding) */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              {/* Education cards — above the main line */}
              {educationItems.map((edu, index) => {
                const duration = formatDuration(edu.start_date, edu.end_date);
                const courses = parseCoursework(edu.coursework);
                const schoolSlug =
                  edu.school?.toLowerCase().replace(/\s+/g, "-") ||
                  "university";

                return (
                  <div
                    key={`edu-card-${index}`}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: `calc(50% - ${branchAreaHeight / 2}px)`,
                    }}
                  >
                    {/* Duration label */}
                    <span
                      ref={(el) => setEduDurationLabelRef(el, index)}
                      className="absolute left-1/2 -translate-x-1/2 top-[20px] font-mono text-[11px] font-semibold text-accent whitespace-nowrap px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 opacity-0"
                    >
                      {duration}
                    </span>

                    {/* Connector up to card */}
                    <div
                      ref={(el) => setEduConnectorRef(el, index)}
                      className="absolute left-1/2 -translate-x-1/2 w-px bg-accent/40 bottom-[8px] h-[50px] origin-bottom opacity-0"
                      style={{ transform: "translateX(-50%) scaleY(0)" }}
                    />

                    {/* Terminal card */}
                    <div
                      ref={(el) => setEduCardRef(el, index)}
                      className="absolute left-1/2 -translate-x-1/2 bottom-[66px] opacity-0 pointer-events-auto"
                      style={{ width: "clamp(360px, 30vw, 500px)" }}
                    >
                      <div className="terminal-card overflow-hidden shadow-xl shadow-black/15">
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
                          {edu.gpa && (
                            <div>
                              <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                                GPA: {edu.gpa}
                              </span>
                            </div>
                          )}
                          {hasRichText(edu.description) && (
                            <div className="text-xs font-mono text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={edu.description} />
                            </div>
                          )}
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

              {/* Work cards — below their branch lanes */}
              {branches.map((branch, bIdx) => {
                const work = branch.work;
                const duration = formatDuration(
                  work.start_date,
                  work.end_date,
                );
                const companySlug =
                  work.company?.toLowerCase().replace(/\s+/g, "-") ||
                  "company";
                const techTags = work.technologies
                  ? work.technologies
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  : [];

                return (
                  <div
                    key={`work-card-${bIdx}`}
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: `calc(50% - ${branchAreaHeight / 2}px + ${laneY(branch.laneIndex)}px)`,
                    }}
                  >
                    {/* Duration label — below branch line */}
                    <span
                      ref={(el) => setWorkDurationLabelRef(el, bIdx)}
                      className="absolute left-1/2 -translate-x-1/2 top-[12px] font-mono text-[11px] font-semibold whitespace-nowrap px-2.5 py-1 rounded-full border opacity-0"
                      style={{
                        color: "hsl(var(--cyan))",
                        backgroundColor: "hsl(var(--cyan) / 0.1)",
                        borderColor: "hsl(var(--cyan) / 0.2)",
                      }}
                    >
                      {duration}
                    </span>

                    {/* Connector down to card */}
                    <div
                      ref={(el) => setWorkConnectorRef(el, bIdx)}
                      className="absolute left-1/2 -translate-x-1/2 w-px top-[8px] h-[50px] origin-top opacity-0"
                      style={{
                        backgroundColor: "hsl(var(--cyan) / 0.4)",
                        transform: "translateX(-50%) scaleY(0)",
                      }}
                    />

                    {/* Terminal card */}
                    <div
                      ref={(el) => setWorkCardRef(el, bIdx)}
                      className="absolute left-1/2 -translate-x-1/2 top-[66px] opacity-0 pointer-events-auto"
                      style={{ width: "clamp(360px, 30vw, 500px)" }}
                    >
                      <div
                        className="terminal-card overflow-hidden shadow-xl shadow-black/15"
                        style={{
                          borderColor: "hsl(var(--cyan) / 0.2)",
                        }}
                      >
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/60" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                            <div
                              className={`w-2 h-2 rounded-full ${
                                work.is_current
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-green-500/60"
                              }`}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {companySlug}.dev
                          </span>
                          {work.is_current && (
                            <span
                              className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded"
                              style={{
                                color: "hsl(var(--cyan))",
                                backgroundColor: "hsl(var(--cyan) / 0.1)",
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="font-mono text-base font-bold text-foreground leading-tight">
                              {work.position}
                            </h3>
                            <p
                              className="font-mono text-xs mt-0.5"
                              style={{ color: "hsl(var(--cyan))" }}
                            >
                              @ {work.company}
                            </p>
                            {work.location && (
                              <div className="flex items-center gap-1 mt-1 font-mono text-[11px] text-muted-foreground">
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
                                {work.location}
                              </div>
                            )}
                          </div>
                          {hasRichText(work.description) && (
                            <div className="text-xs font-mono text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={work.description} />
                            </div>
                          )}
                          {hasRichText(work.achievements) && (
                            <div className="p-3 rounded bg-muted/30 border border-border/30">
                              <div
                                className="font-mono text-[10px] mb-1.5"
                                style={{
                                  color: "hsl(var(--cyan) / 0.6)",
                                }}
                              >
                                # key achievements
                              </div>
                              <div className="text-xs font-mono prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                                <PrismicRichText field={work.achievements} />
                              </div>
                            </div>
                          )}
                          {techTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {techTags.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-1.5 py-0.5 rounded font-mono text-[10px] border"
                                  style={{
                                    color: "hsl(var(--cyan))",
                                    backgroundColor:
                                      "hsl(var(--cyan) / 0.1)",
                                    borderColor: "hsl(var(--cyan) / 0.2)",
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
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
  /*  Mobile: Unified vertical timeline                                */
  /* ================================================================ */

  return (
    <section id={sectionId} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <div className="font-mono text-xs text-accent mb-2">
            <span className="text-muted-foreground">{"// "}</span>timeline
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {heading || "Education & Experience"}
          </h2>
          {description && hasRichText(description) ? (
            <div className="text-lg text-muted-foreground prose dark:prose-invert">
              <PrismicRichText field={description} />
            </div>
          ) : (
            <p className="text-lg text-muted-foreground">
              Academic background and professional journey
            </p>
          )}
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative pl-8">
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border/30" />

          <div className="space-y-10">
            {allEntries.map((entry, index) => {
              const isEdu = entry.type === "education";
              const edu = entry.education;
              const work = entry.work;

              const title = isEdu ? edu?.degree : work?.position;
              const subtitle = isEdu
                ? edu?.field_of_study
                : `@ ${work?.company}`;
              const place = isEdu ? edu?.school : work?.company;
              const location = isEdu ? edu?.location : work?.location;
              const startDate = isEdu
                ? edu?.start_date
                : work?.start_date;
              const endDate = isEdu ? edu?.end_date : work?.end_date;
              const duration = formatDuration(startDate, endDate);
              const slug = isEdu
                ? edu?.school?.toLowerCase().replace(/\s+/g, "-") ||
                  "university"
                : work?.company?.toLowerCase().replace(/\s+/g, "-") ||
                  "company";
              const terminalSuffix = isEdu ? ".edu" : ".dev";

              return (
                <motion.div
                  key={`${entry.type}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-[-25px] top-[10px] w-[11px] h-[11px] rounded-full border-2 bg-background z-10"
                    style={{
                      borderColor: isEdu
                        ? "hsl(var(--accent))"
                        : "hsl(var(--cyan))",
                    }}
                  />

                  <div className="terminal-card overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div
                          className={`w-2 h-2 rounded-full ${
                            !isEdu && work?.is_current
                              ? "bg-green-500 animate-pulse"
                              : "bg-green-500/60"
                          }`}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {slug}
                        {terminalSuffix}
                      </span>
                      <span
                        className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded"
                        style={{
                          color: isEdu
                            ? "hsl(var(--accent))"
                            : "hsl(var(--cyan))",
                          backgroundColor: isEdu
                            ? "hsl(var(--accent) / 0.1)"
                            : "hsl(var(--cyan) / 0.1)",
                        }}
                      >
                        {isEdu ? "EDU" : "WORK"}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-mono text-lg font-bold text-foreground">
                          {title}
                        </h3>
                        {subtitle && (
                          <p
                            className="font-mono text-sm mt-0.5"
                            style={{
                              color: isEdu
                                ? "hsl(var(--accent))"
                                : "hsl(var(--cyan))",
                            }}
                          >
                            {subtitle}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono text-xs text-muted-foreground">
                          {!isEdu && <span>{place}</span>}
                          {location && <span>{location}</span>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {duration && (
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-muted border border-border/50 text-muted-foreground">
                            {duration}
                          </span>
                        )}
                        {isEdu && edu?.gpa && (
                          <span className="font-mono text-[10px] px-2.5 py-1 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                            GPA: {edu.gpa}
                          </span>
                        )}
                        {!isEdu && work?.is_current && (
                          <span
                            className="font-mono text-[10px] px-2.5 py-1 rounded font-semibold"
                            style={{
                              color: "hsl(var(--cyan))",
                              backgroundColor: "hsl(var(--cyan) / 0.1)",
                              borderColor: "hsl(var(--cyan) / 0.2)",
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Education-specific */}
                      {isEdu && edu && (
                        <>
                          {hasRichText(edu.description) && (
                            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={edu.description} />
                            </div>
                          )}
                          {edu.coursework && (
                            <div>
                              <h4 className="font-mono text-[10px] text-accent/60 uppercase tracking-wide mb-1.5">
                                # relevant coursework
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {parseCoursework(edu.coursework).map(
                                  (course) => (
                                    <span
                                      key={course}
                                      className="px-2 py-0.5 rounded font-mono text-[11px] bg-card border border-border/50 text-foreground/80"
                                    >
                                      {course}
                                    </span>
                                  ),
                                )}
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
                        </>
                      )}

                      {/* Work-specific */}
                      {!isEdu && work && (
                        <>
                          {hasRichText(work.description) && (
                            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                              <PrismicRichText field={work.description} />
                            </div>
                          )}
                          {hasRichText(work.achievements) && (
                            <div className="p-3 rounded bg-muted/30 border border-border/30">
                              <div
                                className="font-mono text-[10px] mb-1.5"
                                style={{
                                  color: "hsl(var(--cyan) / 0.6)",
                                }}
                              >
                                # key achievements
                              </div>
                              <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                                <PrismicRichText field={work.achievements} />
                              </div>
                            </div>
                          )}
                          {work.technologies && (
                            <div className="flex flex-wrap gap-1.5">
                              {work.technologies
                                .split(",")
                                .map((tech) => tech.trim())
                                .filter(Boolean)
                                .map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 rounded font-mono text-[11px] border"
                                    style={{
                                      color: "hsl(var(--cyan))",
                                      backgroundColor:
                                        "hsl(var(--cyan) / 0.1)",
                                      borderColor:
                                        "hsl(var(--cyan) / 0.2)",
                                    }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                            </div>
                          )}
                        </>
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
