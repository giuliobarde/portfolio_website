"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PrismicRichText } from "@prismicio/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/lib/timeline-utils";

type WorkExperienceModalProps = {
  experience: WorkItem;
  experiences: WorkItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const formatDate = (date: string | undefined, isCurrent: boolean = false) => {
  if (!date) return "";
  if (isCurrent) return "present";
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
};

const WorkExperienceModal: React.FC<WorkExperienceModalProps> = ({
  experience,
  experiences,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [mounted, setMounted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const hasNavigation = experiences.length > 1;

  const handlePrev = useCallback(() => {
    if (!hasNavigation) return;
    setSlideDirection("left");
    const newIndex = (currentIndex - 1 + experiences.length) % experiences.length;
    onNavigate(newIndex);
  }, [hasNavigation, currentIndex, experiences.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (!hasNavigation) return;
    setSlideDirection("right");
    const newIndex = (currentIndex + 1) % experiences.length;
    onNavigate(newIndex);
  }, [hasNavigation, currentIndex, experiences.length, onNavigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasNavigation) {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasNavigation, handlePrev, handleNext]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "work-modal-overlay") onClose();
  };

  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
  };

  if (!mounted) return null;

  const modalContent = (
    <motion.div
      id="work-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[100] p-4"
      onClick={handleOverlayClick}
      style={{ zIndex: 100 }}
    >
      {/* Left Navigation Arrow */}
      {hasNavigation && (
        <button
          onClick={handlePrev}
          className={cn(
            "absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110]",
            "w-10 h-10 md:w-12 md:h-12 rounded-full",
            "terminal-card border-accent/30",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-accent hover:border-accent/50",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Previous experience"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Navigation Arrow */}
      {hasNavigation && (
        <button
          onClick={handleNext}
          className={cn(
            "absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110]",
            "w-10 h-10 md:w-12 md:h-12 rounded-full",
            "terminal-card border-accent/30",
            "flex items-center justify-center",
            "text-muted-foreground hover:text-accent hover:border-accent/50",
            "transition-all duration-200",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Next experience"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="terminal-card max-w-[90vw] sm:max-w-2xl w-full relative max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                aria-label="Close modal"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  experience.is_current
                    ? "bg-green-500 animate-pulse"
                    : "bg-green-500/80"
                )}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2 truncate">
              {experience.company?.toLowerCase().replace(/\s+/g, "-") || "work"} — details
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors shrink-0"
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-48px)] overflow-x-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-6 space-y-5"
            >
              {/* Position + Company */}
              <div>
                <h2 className="font-mono text-xl md:text-2xl font-bold text-foreground">
                  {experience.position}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-mono text-sm text-accent">
                    @ {experience.company}
                  </span>
                  {experience.is_current && (
                    <span className="font-mono text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>

              <div className="w-12 h-px bg-accent" />

              {/* Meta: location + dates */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                {experience.location && (
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
                    {experience.location}
                  </span>
                )}
                <span>
                  {formatDate(experience.start_date)} —{" "}
                  {formatDate(experience.end_date, experience.is_current)}
                </span>
              </div>

              {/* Description */}
              {experience.description && (
                <div>
                  <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                    # About
                  </h3>
                  <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                    <PrismicRichText field={experience.description} />
                  </div>
                </div>
              )}

              {/* Achievements */}
              {experience.achievements && (
                <div className="p-4 rounded bg-muted/30 border border-border/30">
                  <div className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                    # Key Achievements
                  </div>
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-li:text-muted-foreground">
                    <PrismicRichText field={experience.achievements} />
                  </div>
                </div>
              )}

              {/* Tech tags */}
              {experience.technologies && (
                <div>
                  <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                    # Technologies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {experience.technologies.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded font-mono text-[10px] bg-accent/10 text-accent border border-accent/20"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation indicator */}
              {hasNavigation && (
                <div className="pt-4 border-t border-border/30 flex items-center justify-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {currentIndex + 1} / {experiences.length}
                  </span>
                  <span className="text-border mx-2">|</span>
                  <span className="font-mono text-[10px] text-muted-foreground/60 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">←</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">→</kbd>
                    <span className="ml-1">navigate</span>
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
};

export default WorkExperienceModal;
