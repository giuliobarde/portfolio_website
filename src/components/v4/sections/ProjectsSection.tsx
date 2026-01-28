"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample project data - replace with your actual projects
const projects = [
  {
    id: 1,
    title: "AI-Powered Recommendation System",
    description:
      "Built a machine learning recommendation engine using collaborative filtering and neural networks. Achieved 85% accuracy in user preference prediction.",
    tags: ["Python", "TensorFlow", "Flask", "PostgreSQL"],
    image: "/api/placeholder/600/400",
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Real-Time Data Analytics Platform",
    description:
      "Developed a scalable data pipeline for processing and visualizing large datasets in real-time. Handles 10M+ events per day.",
    tags: ["React", "Node.js", "Apache Kafka", "MongoDB"],
    image: "/api/placeholder/600/400",
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Computer Vision Object Detection",
    description:
      "Implemented YOLO-based object detection system for autonomous vehicles. Optimized for edge deployment with 60+ FPS.",
    tags: ["Python", "PyTorch", "OpenCV", "CUDA"],
    image: "/api/placeholder/600/400",
    link: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Natural Language Processing Chatbot",
    description:
      "Created an intelligent chatbot using transformer models and fine-tuned on domain-specific data. Deployed with 99.9% uptime.",
    tags: ["Python", "Transformers", "FastAPI", "Docker"],
    image: "/api/placeholder/600/400",
    link: "#",
    github: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
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
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of projects showcasing my skills in AI, machine learning, and
            full-stack development
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
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
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">
                    Project Screenshot
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.link}
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
                  </a>
                  <a
                    href={project.github}
                    className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1"
                  >
                    GitHub
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
