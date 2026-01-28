"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample work experience data - replace with your actual experience
const experiences = [
  {
    id: 1,
    company: "Tech Company Inc.",
    position: "Machine Learning Engineer Intern",
    duration: "Jun 2025 - Present",
    location: "San Francisco, CA",
    description:
      "Developing and deploying machine learning models for production systems. Working on natural language processing and computer vision projects.",
    achievements: [
      "Improved model accuracy by 15% through hyperparameter optimization",
      "Reduced inference latency by 40% using model quantization",
      "Collaborated with cross-functional teams on 3 major product launches",
    ],
    tags: ["Python", "TensorFlow", "AWS", "Docker"],
  },
  {
    id: 2,
    company: "StartUp AI",
    position: "Data Science Intern",
    duration: "Jan 2025 - May 2025",
    location: "Remote",
    description:
      "Built data pipelines and performed statistical analysis on large datasets. Created dashboards for business intelligence and reporting.",
    achievements: [
      "Processed and analyzed 10M+ data points for customer insights",
      "Developed automated reporting system saving 20 hours/week",
      "Implemented A/B testing framework for product features",
    ],
    tags: ["Python", "SQL", "Tableau", "Pandas"],
  },
  {
    id: 3,
    company: "University Research Lab",
    position: "Research Assistant",
    duration: "Sep 2024 - Dec 2024",
    location: "University Campus",
    description:
      "Conducted research in deep learning and neural networks. Published findings in academic conferences and journals.",
    achievements: [
      "Co-authored 2 research papers on neural network architectures",
      "Implemented novel attention mechanisms for transformer models",
      "Presented findings at international ML conference",
    ],
    tags: ["PyTorch", "Research", "Deep Learning", "Paper Writing"],
  },
];

export default function WorkExperienceSection() {
  return (
    <section id="work" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey in technology and AI
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

          {/* Experience items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={cn(
                  "relative flex flex-col md:flex-row gap-8",
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                )}
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-0 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background z-10" />

                {/* Content */}
                <div className={cn("flex-1", index % 2 === 0 ? "md:text-right" : "")}>
                  <div
                    className={cn(
                      "inline-block p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow duration-300",
                      "w-full md:max-w-lg"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn(index % 2 === 0 ? "md:text-right md:ml-auto" : "")}>
                        <h3 className="text-xl font-semibold">{exp.position}</h3>
                        <p className="text-accent font-medium">{exp.company}</p>
                      </div>
                    </div>

                    <div className={cn("text-sm text-muted-foreground mb-4", index % 2 === 0 ? "md:text-right" : "")}>
                      <p>{exp.duration}</p>
                      <p>{exp.location}</p>
                    </div>

                    <p className="text-muted-foreground mb-4">{exp.description}</p>

                    {/* Achievements */}
                    <ul className={cn("space-y-2 mb-4", index % 2 === 0 ? "md:text-right" : "")}>
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className={cn("text-accent mt-1", index % 2 === 0 ? "md:order-2" : "")}>
                            •
                          </span>
                          <span className="flex-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className={cn("flex flex-wrap gap-2", index % 2 === 0 ? "md:justify-end" : "")}>
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
