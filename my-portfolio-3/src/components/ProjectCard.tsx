"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import ProjectModal from "@/components/ProjectModal";

type ProjectCardProps = {
  projectList?: Content.ProjectsSliceDefaultPrimaryProjectsItem[];
};

const ProjectCards: React.FC<ProjectCardProps> = ({ projectList = [] }) => {
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
    if (isTransitioningRef.current) {
      return; // Ignore if already transitioning
    }
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => (prev + 1) % itemCount);
    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700); // Match transition duration
  }, [itemCount]);

  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) {
      return; // Ignore if already transitioning
    }
    isTransitioningRef.current = true;
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700); // Match transition duration
  }, [itemCount]);

  // Handle wheel/trackpad scrolling - one card at a time, horizontal only
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only respond to horizontal scrolling
    const horizontalDelta = e.deltaX;
    const verticalDelta = e.deltaY;
    
    // Ignore vertical scrolling - allow normal page scrolling
    if (Math.abs(verticalDelta) > Math.abs(horizontalDelta)) {
      return;
    }

    // Ignore if there's no horizontal scroll
    if (Math.abs(horizontalDelta) === 0) {
      return;
    }

    // Prevent default scrolling behavior only for horizontal scrolls
    e.preventDefault();
    e.stopPropagation();

    // Ignore if already transitioning
    if (isTransitioningRef.current) {
      return;
    }

    // Accumulate horizontal scroll delta (trackpad gives small increments, so we accumulate)
    scrollAccumulatorRef.current += horizontalDelta;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Threshold for triggering navigation
    const threshold = 60;
    
    // Check if we've accumulated enough scroll to navigate one card
    if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
      const direction = scrollAccumulatorRef.current > 0 ? 1 : -1;
      
      // Move exactly one card
      if (direction > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      
      // Reset accumulator completely
      scrollAccumulatorRef.current = 0;
    }

    // Reset accumulator after scroll stops (debounce)
    scrollTimeoutRef.current = setTimeout(() => {
      scrollAccumulatorRef.current = 0;
    }, 150);
  }, [handleNext, handlePrev]);

  // Handle touch/swipe gestures for mobile
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
    
    // Only prevent default if horizontal swipe is dominant
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
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger swipe if horizontal movement is dominant and significant
    if (absDeltaX > absDeltaY && absDeltaX > 50) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    touchStartRef.current = null;
    touchMoveRef.current = null;
  }, [handleNext, handlePrev]);

  // Add native wheel event listener for better trackpad support
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement || itemCount === 0) return;

    // Native event listener with passive: false for preventDefault to work
    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e);
    };

    carouselElement.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      carouselElement.removeEventListener("wheel", wheelHandler);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleWheel, itemCount]);

  // Add touch event listeners for mobile swipe support
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement || itemCount === 0) return;

    carouselElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    carouselElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    carouselElement.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      carouselElement.removeEventListener("touchstart", handleTouchStart);
      carouselElement.removeEventListener("touchmove", handleTouchMove);
      carouselElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, itemCount]);

  const openModal = (item: Content.ProjectsSliceDefaultPrimaryProjectsItem) => {
    setSelectedProject(item);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  // Calculate the relative position of each card
  const getCardPosition = (index: number) => {
    let diff = index - currentIndex;
    
    // Handle wrapping around
    if (diff > itemCount / 2) {
      diff -= itemCount;
    } else if (diff < -itemCount / 2) {
      diff += itemCount;
    }

    return diff;
  };

  // Calculate 3D transform for each card
  const getCardTransform = (index: number) => {
    const position = getCardPosition(index);
    // Responsive angle and radius based on screen size
    const angle = position * (isMobile ? 35 : 45); // Smaller angle on mobile
    const radius = isMobile ? 200 : 300; // Closer on mobile
    const zOffset = Math.abs(position) * -50; // Push back cards that are further away
    
    // Calculate X position based on angle - ensure rotation is centered
    // Cards rotate around the center point (0, 0, 0) in 3D space
    const xOffset = Math.sin((angle * Math.PI) / 180) * radius;
    const zPosition = Math.cos((angle * Math.PI) / 180) * radius + zOffset;

    return {
      // Transform order matters: translate first, then rotate around center
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
      className="relative w-full flex flex-col items-center justify-center bg-transparent py-12 md:py-20"
    >
      {/* 3D Carousel Container */}
      <div 
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
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
            const isVisible = Math.abs(position) <= 2; // Show up to 2 cards on each side

            if (!isVisible) return null;

            return (
              <div
                key={index}
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                  width: isMobile ? "200px" : "240px",
                  height: isMobile ? "300px" : "340px",
                  left: "50%",
                  top: "50%",
                  marginLeft: isMobile ? "-100px" : "-120px", // Half of width
                  marginTop: isMobile ? "-150px" : "-170px", // Half of height
                  transform: cardStyle.transform,
                  transformOrigin: "center center",
                  opacity: cardStyle.opacity,
                  transformStyle: "preserve-3d",
                  zIndex: cardStyle.zIndex,
                  pointerEvents: cardStyle.pointerEvents,
                }}
              >
                <div 
                  className="group w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-yellow-500/20 hover:shadow-2xl focus-within:shadow-yellow-500/20 focus-within:shadow-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 relative border border-slate-600/50"
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
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/10 group-hover:via-yellow-400/5 group-hover:to-yellow-400/10 transition-all duration-300 pointer-events-none z-10" />
                  
                  {/* Project Image */}
                  {item.project_image?.url && (
                    <div className="relative w-full h-36 md:h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 via-transparent to-transparent z-10" />
                      <Image
                        src={item.project_image.url}
                        alt={item.project_image.alt ?? "Project Image"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 200px, 240px"
                      />
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 md:p-5 relative z-10">
                    {/* Project Name */}
                    {item.project_name && (
                      <h3 className="text-base md:text-lg font-bold mb-2 text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-yellow-200 transition-all duration-300">
                        {item.project_name}
                      </h3>
                    )}

                    {/* Divider */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto mb-3" />

                    {/* Project Description */}
                    {item.project_description && (
                      <div className="text-xs md:text-sm text-slate-300 text-center overflow-hidden flex-1 flex items-center" style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}>
                        <PrismicRichText field={item.project_description} />
                      </div>
                    )}

                    {/* View More Indicator */}
                    <div className="mt-3 flex items-center justify-center gap-2 text-yellow-400/70 group-hover:text-yellow-400 transition-colors duration-300">
                      <span className="text-xs font-semibold code-style">
                        <span className="code-keyword">view</span>
                        <span className="code-bracket">()</span>
                      </span>
                      <svg 
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="bg-slate-800 text-white px-6 py-3 rounded-md shadow-md hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 font-bold text-lg code-style border border-slate-700 hover:border-yellow-400/50"
          aria-label="Previous project"
        >
          <span className="code-bracket">{"<"}</span> Prev
        </button>
        {!isMobile && (
          <div className="flex items-center gap-2">
            {projectList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  index === currentIndex ? "bg-yellow-400 scale-125" : "bg-slate-600 hover:bg-slate-500"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
        <button
          onClick={handleNext}
          className="bg-slate-800 text-white px-6 py-3 rounded-md shadow-md hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 font-bold text-lg code-style border border-slate-700 hover:border-yellow-400/50"
          aria-label="Next project"
        >
          Next <span className="code-bracket">{">"}</span>
        </button>
      </div>

      {/* Project Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={closeModal} />}
    </div>
  );
};

export default ProjectCards;
