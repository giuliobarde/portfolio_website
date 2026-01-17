"use client";

import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Props for `Biography` slice in v4.
 */
export type BiographyProps = SliceComponentProps<Content.BiographySlice>;

/**
 * V4 Component for "Biography" Slices using Prismic data.
 */
const Biography: FC<BiographyProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "about";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Avatar / Image */}
          {isFilled.image(slice.primary.avatar) && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative group">
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />

                {/* Image Container */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-border shadow-2xl">
                  <PrismicNextImage
                    field={slice.primary.avatar}
                    className="w-full h-auto max-w-md object-cover"
                    fallbackAlt=""
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {slice.primary.heading}
            </h2>

            {/* Description */}
            {isFilled.richText(slice.primary.description) && (
              <div className="text-lg text-muted-foreground prose prose-lg prose-invert max-w-none">
                <PrismicRichText field={slice.primary.description} />
              </div>
            )}

            {/* CTA Button */}
            {isFilled.link(slice.primary.button_link) && slice.primary.button_text && (
              <PrismicNextLink
                field={slice.primary.button_link}
                className={cn(
                  "inline-flex items-center gap-2 px-8 py-4 rounded-full",
                  "bg-accent text-accent-foreground font-semibold",
                  "hover:shadow-xl hover:scale-105",
                  "transition-all duration-300"
                )}
              >
                {slice.primary.button_text}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </PrismicNextLink>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
