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

  const items = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
            "bg-secondary border border-border text-secondary-foreground",
            "hover:border-accent/30 hover:text-accent transition-all duration-200"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const V4ProjectModal: React.FC<V4ProjectModalProps> = ({
  project,
  onClose,
}) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const getWebsiteUrl = (): string | null => {
    if (
      !Array.isArray(project.project_link) ||
      project.project_link.length === 0
    )
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
    if (!url) return "Visit Link";
    const lower = url.toLowerCase();
    if (lower.includes("github.com")) return "GitHub";
    if (lower.includes("gitlab.com")) return "GitLab";
    if (lower.includes("netlify")) return "Netlify";
    if (lower.includes("vercel")) return "Vercel";
    if (lower.includes("figma.com")) return "Figma";
    if (lower.includes("youtube.com") || lower.includes("youtu.be"))
      return "YouTube";
    return "Website";
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
    if ((e.target as HTMLElement).id === "v4-modal-overlay") {
      onClose();
    }
  };

  return (
    <motion.div
      id="v4-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "bg-card rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-3xl w-full relative max-h-[90vh] overflow-hidden",
          "border border-border"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 z-20",
            "bg-secondary/80 backdrop-blur-sm text-muted-foreground hover:text-foreground",
            "w-9 h-9 flex items-center justify-center rounded-full",
            "hover:bg-secondary border border-border hover:border-accent/30",
            "shadow-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
            "group"
          )}
          aria-label="Close modal"
        >
          <svg
            className="w-4 h-4 transform group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-6 md:p-8">
            {/* Header Image */}
            {isFilled.image(project.project_image) && (
              <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/40 to-transparent z-10" />
                <PrismicNextImage
                  field={project.project_image}
                  className="w-full h-full object-cover"
                  fallbackAlt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />
              </div>
            )}

            {/* Project Name */}
            {project.project_name && (
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground tracking-tight">
                {project.project_name}
              </h2>
            )}

            {/* Divider */}
            <div className="w-16 h-0.5 bg-accent rounded-full mb-6" />

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Description + Links */}
              <div className="space-y-6">
                {isFilled.richText(project.project_expanded_description) && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                      About
                    </h3>
                    <div className="text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                      <PrismicRichText
                        field={project.project_expanded_description}
                      />
                    </div>
                  </div>
                )}

                {Array.isArray(project.project_link) &&
                  project.project_link.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                        Links
                      </h3>
                      <div className="flex flex-col gap-2">
                        {project.project_link.map(
                          (link, index) =>
                            isFilled.link(link) && (
                              <PrismicNextLink
                                key={index}
                                field={link}
                                className={cn(
                                  "group/link inline-flex items-center gap-2",
                                  "text-sm text-muted-foreground hover:text-accent transition-colors duration-200",
                                  "px-4 py-2.5 rounded-xl",
                                  "bg-secondary/50 hover:bg-secondary",
                                  "border border-border hover:border-accent/30",
                                  "w-fit"
                                )}
                              >
                                <span>{getLinkLabel(link)}</span>
                                <svg
                                  className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 transition-transform duration-200"
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
              <div className="space-y-6">
                {/* Live Preview */}
                {websiteUrl && !iframeError && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                      Live Preview
                    </h3>
                    <div
                      className="relative w-full rounded-xl overflow-hidden border border-border bg-muted shadow-lg"
                      style={{ aspectRatio: "16/9" }}
                    >
                      {iframeLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-muted-foreground">
                              Loading preview...
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div
                          style={{
                            transform: "scale(0.25)",
                            transformOrigin: "center center",
                            width: "1366px",
                            height: "768px",
                          }}
                        >
                          <iframe
                            src={websiteUrl}
                            className="border-0"
                            title={`Preview of ${project.project_name || "project"}`}
                            onLoad={() => setIframeLoading(false)}
                            onError={() => {
                              setIframeError(true);
                              setIframeLoading(false);
                            }}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            loading="lazy"
                            style={{
                              width: "1366px",
                              height: "768px",
                              border: "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback image when no website URL or iframe error */}
                {isFilled.image(project.project_image) &&
                  (!websiteUrl || iframeError) && (
                    <div>
                      <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                        Preview
                      </h3>
                      <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                        <PrismicNextImage
                          field={project.project_image}
                          className="w-full h-full object-cover"
                          fallbackAlt=""
                        />
                      </div>
                    </div>
                  )}

                {iframeError && websiteUrl && (
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <p className="text-xs text-accent/80">
                      This website blocks iframe embedding. Use the link to view
                      it directly.
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {isFilled.richText(project.tech_stack) && (
                  <div>
                    <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                      Tech Stack
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
