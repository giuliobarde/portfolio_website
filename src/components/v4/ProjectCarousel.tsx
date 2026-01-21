"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { cn } from "@/lib/utils";
import V4ProjectModal from "./ProjectModal";

type ProjectCarouselProps = {
  projectList?: Content.ProjectsSliceDefaultPrimaryProjectsItem[];
};

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projectList = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const itemCount = projectList.length || 1;
  const [selectedProject, setSelectedProject] = useState<Content.ProjectsSliceDefaultPrimaryProjectsItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollAccumulatorRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchMoveRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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

  const handleWheel = useCallback((e: WheelEvent) => {
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
  }, [handleNext, handlePrev]);

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

  const openModal = (item: Content.ProjectsSliceDefaultPrimaryProjectsItem) => {
    setSelectedProject(item);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const getCardPosition = (index: number) => {
    let diff = index - currentIndex;
    if (diff > itemCount / 2) diff -= itemCount;
    else if (diff < -itemCount / 2) diff += itemCount;
    return diff;
  };

  const getCardTransform = (index: number) => {
    const position = getCardPosition(index);
    const angle = position * (isMobile ? 35 : 45);
    const radius = isMobile ? 160 : 240;
    const zOffset = Math.abs(position) * -40;
    const xOffset = Math.sin((angle * Math.PI) / 180) * radius;
    const zPosition = Math.cos((angle * Math.PI) / 180) * radius + zOffset;

    return {
      transform: `translateX(${xOffset}px) translateZ(${zPosition}px) rotateY(${-angle}deg)`,
      opacity: position === 0 ? 1 : Math.max(0.3, 1 - Math.abs(position) * 0.3),
      scale: position === 0 ? 1 : Math.max(0.7, 1 - Math.abs(position) * 0.15),
      zIndex: itemCount - Math.abs(position),
      pointerEvents: Math.abs(position) > 1 ? "none" as const : "auto" as const,
    };
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full flex flex-col items-center justify-center py-12 md:py-20"
    >
      {/* Terminal status bar */}
      <div className="mb-6 font-mono text-xs text-muted-foreground flex items-center gap-2">
        <span className="text-accent">$</span>
        <span>ls ./projects</span>
        <span className="text-accent">|</span>
        <span>showing {currentIndex + 1} of {itemCount}</span>
        <span className="w-2 h-4 bg-accent/80 cursor-blink ml-1" />
      </div>

      {/* 3D Carousel Container */}
      <div
        className="relative w-full h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          {projectList.map((item, index) => {
            const cardStyle = getCardTransform(index);
            const position = getCardPosition(index);
            const isVisible = Math.abs(position) <= 2;

            if (!isVisible) return null;

            return (
              <div
                key={index}
                className="absolute transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  width: isMobile ? "180px" : "220px",
                  height: isMobile ? "260px" : "300px",
                  left: "50%",
                  top: "50%",
                  marginLeft: isMobile ? "-90px" : "-110px",
                  marginTop: isMobile ? "-130px" : "-150px",
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
                    "terminal-card",
                    "transition-all duration-300",
                    "hover:border-accent/50",
                    position === 0 && "glow"
                  )}
                  style={{
                    transform: `scale(${cardStyle.scale})`,
                    backfaceVisibility: "hidden",
                  }}
                  onClick={() => {
                    if (Math.abs(position) <= 1) {
                      openModal(item);
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && Math.abs(position) <= 1) {
                      e.preventDefault();
                      openModal(item);
                    }
                  }}
                  role="button"
                  tabIndex={Math.abs(position) <= 1 ? 0 : -1}
                  aria-label={`View details for ${item.project_name || "project"}`}
                >
                  {/* Terminal window header */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border/50 bg-muted/40">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/70 group-hover:bg-red-500 transition-colors" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors" />
                      <div className="w-2 h-2 rounded-full bg-green-500/70 group-hover:bg-green-500 transition-colors" />
                    </div>
                    <span className="font-mono text-[8px] text-muted-foreground truncate">
                      {item.project_name ? item.project_name.toLowerCase().replace(/\s+/g, "-") : "project"}.md
                    </span>
                  </div>

                  {/* Project Image */}
                  {isFilled.image(item.project_image) && (
                    <div className="relative w-full h-24 md:h-28 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10 pointer-events-none" />
                      <PrismicNextImage
                        field={item.project_image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        fallbackAlt=""
                      />
                      {/* Scanline overlay effect */}
                      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-3 relative">
                    {/* Project Name */}
                    {item.project_name && (
                      <h3 className="font-mono text-xs font-bold mb-1.5 text-foreground group-hover:text-accent transition-colors tracking-tight">
                        {item.project_name}
                      </h3>
                    )}

                    {/* Description */}
                    {isFilled.richText(item.project_description) && (
                      <div
                        className="text-[10px] text-muted-foreground overflow-hidden flex-1"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        <PrismicRichText field={item.project_description} />
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    {isFilled.richText(item.tech_stack) && (
                      <div className="flex flex-wrap gap-0.5 mt-2">
                        {asText(item.tech_stack)
                          .split(",")
                          .slice(0, 2)
                          .map((tag, i) => (
                            <span
                              key={i}
                              className="px-1 py-0.5 rounded font-mono text-[8px] bg-accent/10 text-accent border border-accent/20"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        {asText(item.tech_stack).split(",").length > 2 && (
                          <span className="px-1 py-0.5 rounded font-mono text-[8px] bg-muted text-muted-foreground">
                            +{asText(item.tech_stack).split(",").length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* View indicator */}
                    <div className="mt-auto pt-2 flex items-center gap-1 text-muted-foreground group-hover:text-accent transition-colors font-mono text-[9px]">
                      <span className="text-accent/60">$</span>
                      <span>view</span>
                      <svg
                        className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform"
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
      <div className="flex justify-center items-center gap-4 md:gap-6 mt-8">
        <button
          onClick={handlePrev}
          className={cn(
            "px-4 py-2 rounded-md font-mono text-xs",
            "terminal-card",
            "hover:border-accent/40 hover:text-accent",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
            "flex items-center gap-2"
          )}
          aria-label="Previous project"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">prev</span>
        </button>

        {/* Index dots */}
        <div className="flex items-center gap-1.5">
          {projectList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-accent",
                index === currentIndex
                  ? "bg-accent w-6 glow"
                  : "bg-border hover:bg-muted-foreground w-1.5"
              )}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={cn(
            "px-4 py-2 rounded-md font-mono text-xs",
            "terminal-card",
            "hover:border-accent/40 hover:text-accent",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
            "flex items-center gap-2"
          )}
          aria-label="Next project"
        >
          <span className="hidden sm:inline">next</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-4 font-mono text-[10px] text-muted-foreground/60 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">→</kbd>
          <span className="ml-1">navigate</span>
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[9px]">↵</kbd>
          <span className="ml-1">select</span>
        </span>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <V4ProjectModal
          project={selectedProject}
          projectList={projectList}
          currentProjectIndex={projectList.indexOf(selectedProject)}
          onClose={closeModal}
          onNavigate={(index: number) => {
            setSelectedProject(projectList[index]);
            setCurrentIndex(index);
          }}
        />
      )}
    </div>
  );
};

export default ProjectCarousel;
