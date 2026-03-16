"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  sectionHeaderVariants,
  getAlternatingCardVariants,
} from "@/lib/animations";
import SectionDivider from "@/components/v4/SectionDivider";
import WorkExperienceModal from "@/components/v4/WorkExperienceModal";

// ── Types ────────────────────────────────────────────────────────────────
type Experience = {
  company?: string;
  position?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: RichTextField;
  achievements?: RichTextField;
  technologies?: string;
};

type WorkExperienceSlice = {
  slice_type: string;
  variation: string;
  primary: {
    section_id?: string;
    heading?: string;
    description?: RichTextField;
    experiences?: Experience[];
  };
};

export type WorkExperienceProps = {
  slice: WorkExperienceSlice;
};

const formatDate = (date: string | undefined, isCurrent: boolean = false) => {
  if (!date) return "";
  if (isCurrent) return "present";
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
};

// ── Floating Particles ───────────────────────────────────────────────────
const PARTICLE_CHARS = ["{", "}", ";", "0", "1", "/", "*", "=>", "//"];

const FloatingParticles: React.FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        char: PARTICLE_CHARS[i % PARTICLE_CHARS.length],
        left: `${5 + ((i * 7) % 90)}%`,
        startY: (i * 11) % 100,
        duration: 10 + (i % 5) * 2,
        delay: i * 0.7,
        opacity: 0.04 + (i % 3) * 0.03,
        size: 10 + (i % 3) * 2,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute font-mono text-accent select-none"
          style={{
            left: p.left,
            top: `${p.startY}%`,
            fontSize: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -200],
            x: [0, p.id % 2 === 0 ? 8 : -8, 0],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: "linear" },
            x: {
              duration: p.duration * 0.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
            delay: p.delay,
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

// ── Glow Border Card ─────────────────────────────────────────────────────
const GlowBorderCard: React.FC<{
  isExpanded: boolean;
  isInViewCenter: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isExpanded, isInViewCenter, children, className }) => (
  <div
    className={cn(
      "glow-border-wrapper relative rounded-lg p-px",
      isExpanded && "glow-border-active",
      isInViewCenter && !isExpanded && "glow-border-subtle",
      className,
    )}
  >
    <div className="relative rounded-lg overflow-hidden bg-card/95 backdrop-blur-md">
      {children}
    </div>
  </div>
);

// ── Scroll Progress Indicator ────────────────────────────────────────────
const ScrollProgressIndicator: React.FC<{
  scrollYProgress: MotionValue<number>;
  total: number;
}> = ({ scrollYProgress, total }) => {
  const [current, setCurrent] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(Math.ceil(latest * total), total);
    setCurrent(Math.max(idx, 1));
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="sticky top-4 ml-auto w-fit font-mono text-[10px] text-muted-foreground/60 bg-card/60 backdrop-blur-sm px-2 py-1 rounded border border-border/30 z-20 mb-4"
    >
      <span className="text-accent">{current}</span>
      <span> / {total}</span>
    </motion.div>
  );
};

// ── Experience Card ──────────────────────────────────────────────────────
const ExperienceCard: React.FC<{
  exp: Experience;
  index: number;
  onClick: () => void;
  scrollYProgress: MotionValue<number>;
}> = ({ exp, index, onClick, scrollYProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-45% 0px -45% 0px" });

  // Parallax depth
  const parallaxFactor = ((index % 3) - 1) * 0.5;
  const yParallax = useTransform(scrollYProgress, [0, 1], [
    parallaxFactor * 20,
    -parallaxFactor * 20,
  ]);

  // 3D tilt hover
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof window !== "undefined" && window.innerWidth < 768) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rotateX.set(-((e.clientY - cy) / (rect.height / 2)) * 3);
      rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 3);
    },
    [rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      variants={getAlternatingCardVariants(index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative pl-12"
      style={{ y: yParallax }}
    >
      {/* Timeline dot with enhanced glow */}
      <div className="absolute left-[14px] top-[14px] z-10">
        <motion.div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--terminal) / 0.4), transparent 70%)",
          }}
          animate={
            isInView
              ? { scale: [1, 3, 1], opacity: [0.6, 0, 0.6] }
              : { scale: 1, opacity: 0 }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(
            "w-[11px] h-[11px] rounded-full border-2 border-accent bg-background relative",
            isInView && "timeline-dot-active",
          )}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: index * 0.08,
          }}
        />
      </div>

      {/* 3D tilt perspective wrapper */}
      <div style={{ perspective: 800 }}>
        <motion.div
          ref={cardRef}
          style={{ rotateX: springRotateX, rotateY: springRotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <GlowBorderCard isExpanded={false} isInViewCenter={isInView}>
            <button
              onClick={onClick}
              className="w-full text-left px-4 py-3 flex items-center gap-3 group cursor-pointer"
            >
              {/* Traffic lights */}
              <div className="flex gap-1 shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    exp.is_current
                      ? "bg-green-500 animate-pulse"
                      : "bg-green-500/60",
                  )}
                />
              </div>

              {/* Position + Company */}
              <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-mono text-sm font-bold text-foreground truncate">
                  {exp.position}
                </span>
                <span className="font-mono text-xs text-accent">
                  @ {exp.company}
                </span>
              </div>

              {/* Date range (desktop) */}
              <span className="font-mono text-[10px] text-muted-foreground shrink-0 hidden sm:block">
                {formatDate(exp.start_date)} —{" "}
                {formatDate(exp.end_date, exp.is_current)}
              </span>

              {/* Active badge */}
              {exp.is_current && (
                <span className="font-mono text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded shrink-0">
                  ACTIVE
                </span>
              )}

              {/* Open icon */}
              <svg
                className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v6"
                />
              </svg>
            </button>
          </GlowBorderCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────
const WorkExperience: React.FC<WorkExperienceProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "work";
  const sectionId =
    typeof rawSectionId === "string"
      ? rawSectionId.replace(/^#+/, "")
      : rawSectionId;
  const experiences = slice.primary.experiences || [];

  // Modal state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Scroll-linked timeline
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const lineScaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
          {/* Section Header */}
          <motion.div
            variants={sectionHeaderVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
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

          {/* Timeline container */}
          <div ref={timelineRef} className="relative">
            {/* Floating particles behind everything */}
            <FloatingParticles />

            {/* Scroll progress indicator */}
            {experiences.length > 3 && (
              <ScrollProgressIndicator
                scrollYProgress={scrollYProgress}
                total={experiences.length}
              />
            )}

            {/* Dim background line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border/20" />

            {/* Scroll-linked glowing progress line */}
            <motion.div
              className="absolute left-[18px] top-2 bottom-2 w-[3px] rounded-full origin-top timeline-glow-line"
              style={{
                scaleY: lineScaleY,
                background:
                  "linear-gradient(to bottom, hsl(var(--terminal)), hsl(var(--cyan)), hsl(var(--terminal) / 0.2))",
              }}
            />

            {/* Cards */}
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <ExperienceCard
                  key={index}
                  exp={exp}
                  index={index}
                  onClick={() => setSelectedIndex(index)}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Work Experience Modal */}
        {selectedIndex !== null && experiences[selectedIndex] && (
          <WorkExperienceModal
            experience={experiences[selectedIndex]}
            experiences={experiences}
            currentIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onNavigate={(index) => setSelectedIndex(index)}
          />
        )}
      </section>
    </>
  );
};

export default WorkExperience;
