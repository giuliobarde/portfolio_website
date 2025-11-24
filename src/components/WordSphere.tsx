"use client";

import React, { useEffect, useRef } from "react";
import TagCloud, { TagCloudOptions } from "TagCloud";

type wordSphereProps = {
  wordList: string[];
  sphereSize: number;
}

const WordSphere: React.FC<wordSphereProps> = ({ wordList, sphereSize }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const tagCloudInstanceRef = useRef<ReturnType<typeof TagCloud> | null>(null);
  const hoverHandlersRef = useRef<Map<HTMLElement, { enter: () => void; leave: () => void }>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    const handlersMap = hoverHandlersRef.current;
    if (!container || wordList.length === 0) return;

    // Cleanup previous instance and event listeners
    if (container.innerHTML) {
      // Remove old event listeners
      handlersMap.forEach((handlers, element) => {
        element.removeEventListener("mouseenter", handlers.enter);
        element.removeEventListener("mouseleave", handlers.leave);
      });
      handlersMap.clear();
      
      container.innerHTML = "";
      tagCloudInstanceRef.current = null;
    }

    // Generate color palette with gradient effect
    const colors = [
      "#fbbf24", // yellow-400
      "#f59e0b", // yellow-500
      "#eab308", // yellow-500
      "#facc15", // yellow-400
      "#fde047", // yellow-300
      "#fef08a", // yellow-200
      "#a3a3a3", // gray-400 (for variety)
    ];

    const options: TagCloudOptions = {
      radius: sphereSize,
      maxSpeed: "slow",
      initSpeed: "normal",
      keep: true,
      useHTML: true,
    };

    // Initialize the TagCloud
    tagCloudInstanceRef.current = TagCloud([container], wordList, options);

    // Wait a bit for tags to be rendered, then apply styling
    const applyStyling = () => {
      const tagElements = container?.querySelectorAll("span");
      if (!tagElements || tagElements.length === 0) return;

      tagElements.forEach((tag, index) => {
        const element = tag as HTMLElement;
        const colorIndex = index % colors.length;
        const color = colors[colorIndex];
        
        // Store original color
        const originalColor = color;
        
        // Apply initial styling
        element.style.color = originalColor;
        element.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        element.style.cursor = "pointer";
        element.style.fontWeight = "700";
        element.style.textShadow = `0 2px 4px rgba(0, 0, 0, 0.3)`;
        
        // Create hover handlers
        const handleMouseEnter = () => {
          element.style.transform = "scale(1.15)";
          element.style.color = "#fbbf24"; // Bright yellow on hover
          element.style.textShadow = `0 0 15px #fbbf24, 0 0 25px #f59e0b`;
          element.style.zIndex = "10";
        };
        
        const handleMouseLeave = () => {
          element.style.transform = "";
          element.style.color = originalColor;
          element.style.textShadow = `0 2px 4px rgba(0, 0, 0, 0.3)`;
          element.style.zIndex = "";
        };
        
        // Add event listeners
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);
        
        // Store handlers for cleanup
        handlersMap.set(element, {
          enter: handleMouseEnter,
          leave: handleMouseLeave,
        });
      });
    };

    // Use setTimeout to ensure tags are rendered
    const timeoutId = setTimeout(applyStyling, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      
      // Remove event listeners using captured refs
      handlersMap.forEach((handlers, element) => {
        element.removeEventListener("mouseenter", handlers.enter);
        element.removeEventListener("mouseleave", handlers.leave);
      });
      handlersMap.clear();
      
      if (container) {
        container.innerHTML = "";
        tagCloudInstanceRef.current = null;
      }
    };
  }, [sphereSize, wordList]);

  return (
    <span 
      ref={containerRef}
      className="tagcloud prose prose-slate prose-invert font-bold"
      style={{
        display: "inline-block",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default WordSphere;
