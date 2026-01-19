"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import V4ProjectModal from "./ProjectModal";

type ProjectCarouselProps = {
  projectList: Content.ProjectsSliceDefaultPrimaryProjectsItem[];
};

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projectList = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Content.ProjectsSliceDefaultPrimaryProjectsItem | null>(null);

  const itemCount = projectList.length || 1;
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollAccumulatorRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => (prev + 1) % itemCount);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700);
  }, [itemCount]);

  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700);
  }, [itemCount]);

  // Horizontal wheel/trackpad scrolling
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const horizontalDelta = e.deltaX;
      const verticalDelta = e.deltaY;
      if (Math.abs(verticalDelta) > Math.abs(horizontalDelta)) return;
      if (Math.abs(horizontalDelta) === 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (isTransitioningRef.current) return;
      scrollAccumulatorRef.current += horizontalDelta;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      const threshold = 60;
      if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
        if (scrollAccumulatorRef.current > 0) handleNext();
        else handlePrev();
        scrollAccumulatorRef.current = 0;
      }
      scrollTimeoutRef.current = setTimeout(() => {
        scrollAccumulatorRef.current = 0;
      }, 150);
    },
    [handleNext, handlePrev]
  );

  // Touch gestures
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isTransitioningRef.current) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchMoveRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current || isTransitioningRef.current) return;
    const touch = e.touches[0];
    touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchMoveRef.current || isTransitioningRef.current) {
      touchStartRef.current = null;
      touchMoveRef.current = null;
      return;
    }
    const deltaX = touchMoveRef.current.x - touchStartRef.current.x;
    const deltaY = touchMoveRef.current.y - touchStartRef.current.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) handlePrev();
      else handleNext();
    }
    touchStartRef.current = null;
    touchMoveRef.current = null;
  }, [handleNext, handlePrev]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || itemCount === 0) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleWheel, itemCount]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || itemCount === 0) return;
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, itemCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, selectedProject]);

  const getCardPosition = (index: number) => {
    let diff = index - currentIndex;
    if (diff > itemCount / 2) diff -= itemCount;
    else if (diff < -itemCount / 2) diff += itemCount;
    return diff;
  };

  const getCardTransform = (index: number) => {
    const position = getCardPosition(index);
    const angle = position * (isMobile ? 35 : 45);
    const radius = isMobile ? 200 : 300;
    const zOffset = Math.abs(position) * -50;
    const xOffset = Math.sin((angle * Math.PI) / 180) * radius;
    const zPosition = Math.cos((angle * Math.PI) / 180) * radius + zOffset;

    return {
      transform: `translateX(${xOffset}px) translateZ(${zPosition}px) rotateY(${-angle}deg)`,
      opacity: position === 0 ? 1 : Math.max(0.3, 1 - Math.abs(position) * 0.3),
      scale: position === 0 ? 1 : Math.max(0.7, 1 - Math.abs(position) * 0.15),
      zIndex: itemCount - Math.abs(position),
      pointerEvents: Math.abs(position) > 1 ? ("none" as const) : ("auto" as const),
    };
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full flex flex-col items-center justify-center py-12 md:py-20"
    >
      {/* 3D Carousel */}
      <div
        className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
        >
          {projectList.map((item, index) => {
            const cardStyle = getCardTransform(index);
            const position = getCardPosition(index);
            const isVisible = Math.abs(position) <= 2;
            if (!isVisible) return null;

            return (
              <div
                key={index}
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                  width: isMobile ? "240px" : "300px",
                  height: isMobile ? "340px" : "400px",
                  left: "50%",
                  top: "50%",
                  marginLeft: isMobile ? "-120px" : "-150px",
                  marginTop: isMobile ? "-170px" : "-200px",
                  transform: cardStyle.transform,
                  transformOrigin: "center center",
                  opacity: cardStyle.opacity,
                  transformStyle: "preserve-3d",
                  zIndex: cardStyle.zIndex,
                  pointerEvents: cardStyle.pointerEvents,
                }}
              >
                <div
                  className={cn(
                    "group w-full h-full rounded-lg overflow-hidden cursor-pointer",
                    "bg-card/90 backdrop-blur-sm border border-border",
                    "transition-all duration-300",
                    "hover:border-accent/40 hover:shadow-[0_0_30px_-5px_hsl(var(--terminal)/0.2)]",
                    "relative flex flex-col"
                  )}
                  style={{
                    transform: `scale(${cardStyle.scale})`,
                    backfaceVisibility: "hidden",
                  }}
                  onClick={() => {
                    if (Math.abs(position) <= 1) setSelectedProject(item);
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && Math.abs(position) <= 1) {
                      e.preventDefault();
                      setSelectedProject(item);
                    }
                  }}
                  role="button"
                  tabIndex={Math.abs(position) <= 1 ? 0 : -1}
                  aria-label={`View details for ${item.project_name || "project"}`}
                >
                  {/* Terminal window header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/40 shrink-0">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                      <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground truncate">
                      {item.project_name ? item.project_name.toLowerCase().replace(/\s+/g, "-") : "project"}.md
                    </span>
                  </div>

                  {/* Project Image */}
                  {isFilled.image(item.project_image) && (
                    <div className="relative w-full h-32 md:h-40 overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10" />
                      <PrismicNextImage
                        field={item.project_image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackAlt=""
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 relative z-10">
                    {item.project_name && (
                      <h3 className="font-mono text-sm font-semibold mb-2 text-foreground group-hover:text-accent transition-colors tracking-tight">
                        {item.project_name}
                      </h3>
                    )}

                    {isFilled.richText(item.project_description) && (
                      <div
                        className="text-xs text-muted-foreground overflow-hidden flex-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        <PrismicRichText field={item.project_description} />
                      </div>
                    )}

                    {/* Tech Stack */}
                    {isFilled.richText(item.tech_stack) && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {asText(item.tech_stack)
                          .split(",")
                          .slice(0, 3)
                          .map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded font-mono text-[10px] bg-accent/10 text-accent border border-accent/20"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        {asText(item.tech_stack).split(",").length > 3 && (
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-muted text-muted-foreground">
                            +{asText(item.tech_stack).split(",").length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View indicator */}
                    <div className="mt-auto pt-3 flex items-center gap-1.5 text-muted-foreground group-hover:text-accent transition-colors font-mono text-[10px]">
                      <span className="text-accent/60">$</span>
                      <span>open --details</span>
                      <svg
                        className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={handlePrev}
          className={cn(
            "px-4 py-2 rounded-md font-mono text-xs",
            "bg-card border border-border",
            "hover:border-accent/40 hover:text-accent",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          )}
          aria-label="Previous project"
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            prev
          </span>
        </button>

        {/* Dot indicators */}
        {!isMobile && (
          <div className="flex items-center gap-1.5">
            {projectList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-accent",
                  index === currentIndex
                    ? "bg-accent w-6"
                    : "bg-border hover:bg-muted-foreground w-1.5"
                )}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          className={cn(
            "px-4 py-2 rounded-md font-mono text-xs",
            "bg-card border border-border",
            "hover:border-accent/40 hover:text-accent",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          )}
          aria-label="Next project"
        >
          <span className="flex items-center gap-1.5">
            next
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Counter */}
      <div className="font-mono text-xs text-muted-foreground mt-3">
        [{currentIndex + 1}/{itemCount}]
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <V4ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCarousel;
