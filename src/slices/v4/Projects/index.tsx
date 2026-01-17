"use client";

import { FC } from "react";
import { Content, isFilled, asText } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

/**
 * Props for `Projects` slice in v4.
 */
export type ProjectsProps = SliceComponentProps<Content.ProjectsSlice>;

/**
 * V4 Component for "Projects" Slices using Prismic data.
 */
const Projects: FC<ProjectsProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "projects";
  const sectionId = typeof rawSectionId === 'string' ? rawSectionId.replace(/^#+/, '') : rawSectionId;
  const projectList = slice.primary.projects;

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading}
          </h2>
          {isFilled.richText(slice.primary.decsription) && (
            <div className="text-lg text-muted-foreground max-w-2xl mx-auto prose prose-invert">
              <PrismicRichText field={slice.primary.decsription} />
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectList.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative rounded-2xl overflow-hidden",
                "bg-card border border-border",
                "hover:shadow-2xl transition-all duration-300",
                "hover:scale-[1.02]"
              )}
            >
              {/* Project Image */}
              {isFilled.image(project.project_image) && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <PrismicNextImage
                    field={project.project_image}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    fallbackAlt=""
                  />
                </div>
              )}

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                    {project.project_name}
                  </h3>
                  {isFilled.date(project.project_date) && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(project.project_date).getFullYear()}
                    </span>
                  )}
                </div>

                {/* Description */}
                {isFilled.richText(project.project_description) && (
                  <div className="text-muted-foreground mb-4 prose prose-sm prose-invert max-w-none">
                    <PrismicRichText field={project.project_description} />
                  </div>
                )}

                {/* Tech Stack Tags */}
                {isFilled.richText(project.tech_stack) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {asText(project.tech_stack)
                      .split(",")
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                )}

                {/* Links */}
                {project.project_link && project.project_link.length > 0 && (
                  <div className="flex gap-4">
                    {project.project_link.map((link, linkIndex) => (
                      isFilled.link(link) && (
                        <PrismicNextLink
                          key={linkIndex}
                          field={link}
                          className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1"
                        >
                          View Project
                          <svg
                            className="w-4 h-4"
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
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
