"use client";

import React, { useEffect, useState } from "react";
import {
  Content,
  asLink,
  asText,
  isFilled,
  RichTextField,
  LinkField,
} from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type V4ProjectModalProps = {
  project: Content.ProjectsSliceDefaultPrimaryProjectsItem;
  onClose: () => void;
};

const TechStackBadges: React.FC<{ field: RichTextField }> = ({ field }) => {
  const text = asText(field);
  if (!text) return null;
  const items = text.split(",").map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded font-mono text-[11px]",
            "bg-accent/10 text-accent border border-accent/20",
            "hover:bg-accent/20 transition-colors duration-200"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const V4ProjectModal: React.FC<V4ProjectModalProps> = ({ project, onClose }) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const getWebsiteUrl = (): string | null => {
    if (!Array.isArray(project.project_link) || project.project_link.length === 0)
      return null;
    const extractUrl = (link: LinkField): string | null => {
      if (!isFilled.link(link)) return null;
      const resolved = asLink(link);
      if (typeof resolved === "string") return resolved;
      if (resolved && typeof resolved === "object" && "url" in resolved) {
        return (resolved as { url?: string }).url || null;
      }
      return null;
    };
    const webLink = project.project_link.find((link) => {
      const url = extractUrl(link);
      return url && !url.toLowerCase().includes("github.com");
    });
    return webLink ? extractUrl(webLink) : null;
  };

  const websiteUrl = getWebsiteUrl();

  const getLinkLabel = (link: LinkField): string => {
    const extractUrl = (l: LinkField): string | null => {
      if (!isFilled.link(l)) return null;
      const resolved = asLink(l);
      if (typeof resolved === "string") return resolved;
      if (resolved && typeof resolved === "object" && "url" in resolved) {
        return (resolved as { url?: string }).url || null;
      }
      return null;
    };
    const url = extractUrl(link);
    if (!url) return "link";
    const lower = url.toLowerCase();
    if (lower.includes("github.com")) return "github";
    if (lower.includes("gitlab.com")) return "gitlab";
    if (lower.includes("netlify")) return "netlify";
    if (lower.includes("vercel")) return "vercel";
    if (lower.includes("figma.com")) return "figma";
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
    return "website";
  };

  useEffect(() => {
    setIframeError(false);
    setIframeLoading(true);
  }, [websiteUrl]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "v4-modal-overlay") onClose();
  };

  return (
    <motion.div
      id="v4-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "terminal-card max-w-[90vw] sm:max-w-3xl w-full relative max-h-[90vh] overflow-hidden"
        )}
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
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2">
              {project.project_name ? project.project_name.toLowerCase().replace(/\s+/g, "-") : "project"} — details
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-48px)]">
          <div className="p-6">
            {/* Header Image */}
            {isFilled.image(project.project_image) && (
              <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden mb-6 border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent z-10" />
                <PrismicNextImage
                  field={project.project_image}
                  className="w-full h-full object-cover"
                  fallbackAlt=""
                />
              </div>
            )}

            {/* Project Name */}
            {project.project_name && (
              <h2 className="font-mono text-xl md:text-2xl font-bold mb-2 text-foreground">
                {project.project_name}
              </h2>
            )}

            <div className="w-12 h-px bg-accent mb-6" />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Description + Links */}
              <div className="space-y-5">
                {isFilled.richText(project.project_expanded_description) && (
                  <div>
                    <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                      # About
                    </h3>
                    <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                      <PrismicRichText field={project.project_expanded_description} />
                    </div>
                  </div>
                )}

                {Array.isArray(project.project_link) && project.project_link.length > 0 && (
                  <div>
                    <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                      # Links
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {project.project_link.map(
                        (link, index) =>
                          isFilled.link(link) && (
                            <PrismicNextLink
                              key={index}
                              field={link}
                              className={cn(
                                "group/link inline-flex items-center gap-2",
                                "font-mono text-xs text-muted-foreground hover:text-accent transition-colors",
                                "px-3 py-2 rounded",
                                "bg-muted/30 hover:bg-muted/60",
                                "border border-border/50 hover:border-accent/30",
                                "w-fit"
                              )}
                            >
                              <span className="text-accent/60">$</span>
                              <span>open {getLinkLabel(link)}</span>
                              <svg
                                className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </PrismicNextLink>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Preview + Tech Stack */}
              <div className="space-y-5">
                {websiteUrl && !iframeError && (
                  <div>
                    <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                      # Preview
                    </h3>
                    <div
                      className="relative w-full rounded-lg overflow-hidden border border-border/50 bg-muted"
                      style={{ aspectRatio: "16/9" }}
                    >
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <span className="font-mono text-[10px] text-muted-foreground">
                              loading...
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div style={{ transform: "scale(0.25)", transformOrigin: "center center", width: "1366px", height: "768px" }}>
                          <iframe
                            src={websiteUrl}
                            className="border-0"
                            title={`Preview of ${project.project_name || "project"}`}
                            onLoad={() => setIframeLoading(false)}
                            onError={() => { setIframeError(true); setIframeLoading(false); }}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            loading="lazy"
                            style={{ width: "1366px", height: "768px", border: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isFilled.image(project.project_image) && (!websiteUrl || iframeError) && (
                  <div>
                    <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                      # Preview
                    </h3>
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border/50">
                      <PrismicNextImage
                        field={project.project_image}
                        className="w-full h-full object-cover"
                        fallbackAlt=""
                      />
                    </div>
                  </div>
                )}

                {iframeError && websiteUrl && (
                  <div className="p-3 rounded bg-accent/5 border border-accent/20 font-mono text-[11px] text-muted-foreground">
                    <span className="text-amber-500">warn:</span> iframe blocked — use link to view directly
                  </div>
                )}

                {isFilled.richText(project.tech_stack) && (
                  <div>
                    <h3 className="font-mono text-xs text-accent mb-2 uppercase tracking-wider">
                      # Tech Stack
                    </h3>
                    <TechStackBadges field={project.tech_stack} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default V4ProjectModal;
