"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

const Biography: FC<BiographyProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "about";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="font-mono text-xs text-accent mb-2">
            <span className="text-muted-foreground">{"// "}</span>about
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {slice.primary.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          {isFilled.image(slice.primary.avatar) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="terminal-card overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">avatar.png</span>
                </div>
                <div className="p-4">
                  <div className="relative rounded-lg overflow-hidden border border-border/50">
                    <PrismicNextImage
                      field={slice.primary.avatar}
                      className="w-full h-auto object-cover aspect-square"
                      fallbackAlt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-accent/5 pointer-events-none" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <div className="font-mono text-accent text-lg font-bold">CS</div>
                      <div className="font-mono text-[10px] text-muted-foreground">Major</div>
                    </div>
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <div className="font-mono text-accent text-lg font-bold">DS</div>
                      <div className="font-mono text-[10px] text-muted-foreground">Focus</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bio content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={cn(
              "lg:col-span-2",
              !isFilled.image(slice.primary.avatar) && "lg:col-span-3"
            )}
          >
            <div className="terminal-card h-full">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">README.md</span>
              </div>

              <div className="p-6 space-y-6">
                {isFilled.richText(slice.primary.description) && (
                  <div className="text-base text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent">
                    <PrismicRichText field={slice.primary.description} />
                  </div>
                )}

                <div className="font-mono text-xs space-y-1.5 p-4 rounded bg-muted/30 border border-border/50">
                  <div className="text-muted-foreground">
                    <span className="text-accent">$</span> cat interests.txt
                  </div>
                  <div className="text-foreground pl-2 space-y-0.5">
                    <div><span className="text-accent">&#x25B8;</span> Machine Learning &amp; Deep Learning</div>
                    <div><span className="text-accent">&#x25B8;</span> Data Analysis &amp; Visualization</div>
                    <div><span className="text-accent">&#x25B8;</span> Full-Stack Development</div>
                    <div><span className="text-accent">&#x25B8;</span> Algorithm Design</div>
                  </div>
                </div>

                {isFilled.link(slice.primary.button_link) && slice.primary.button_text && (
                  <PrismicNextLink
                    field={slice.primary.button_link}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-md",
                      "bg-accent text-accent-foreground font-mono text-sm font-medium",
                      "hover:brightness-110 transition-all glow"
                    )}
                  >
                    <span className="text-accent-foreground/60">$</span>
                    {slice.primary.button_text}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </PrismicNextLink>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
