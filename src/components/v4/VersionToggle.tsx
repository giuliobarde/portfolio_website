"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VersionToggleProps {
  currentVersion: "v3" | "v4";
  versions?: string[];
}

const fallbackVersions = ["v3", "v4"];

export function VersionToggle({ currentVersion, versions }: VersionToggleProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const allVersions = versions && versions.length > 0 ? versions : fallbackVersions;

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[11px] transition-all duration-200",
          isOpen
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border"
        )}
        aria-label="Switch website version"
        aria-expanded={isOpen}
      >
        <span className="text-accent/60">~</span>
        <span className="font-semibold">{currentVersion}</span>
        <motion.svg
          className="w-3 h-3 opacity-50"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 min-w-[120px] rounded-lg border border-border/60 bg-card/95 backdrop-blur-xl shadow-lg shadow-black/10 overflow-hidden"
          >
            <div className="px-2.5 py-2 border-b border-border/40">
              <p className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                versions
              </p>
            </div>
            <div className="py-1">
              {allVersions.map((v) => {
                const isActive = v === currentVersion;
                return (
                  <a
                    key={v}
                    href={`/${v}`}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 font-mono text-xs transition-all duration-150",
                      isActive
                        ? "text-accent bg-accent/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        isActive ? "bg-accent shadow-[0_0_6px_hsl(var(--terminal)/0.5)]" : "bg-border"
                      )}
                    />
                    <span className="font-semibold">{v}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] text-accent/60">current</span>
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
