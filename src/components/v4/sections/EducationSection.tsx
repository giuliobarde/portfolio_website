"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample education data - replace with your actual education
const education = [
  {
    id: 1,
    degree: "Bachelor of Science in Computer Science",
    specialization: "Specialization in Artificial Intelligence",
    school: "University Name",
    location: "City, State",
    duration: "2022 - 2026",
    gpa: "3.9/4.0",
    highlights: [
      "Dean's List all semesters",
      "AI Research Fellowship recipient",
      "Lead Teaching Assistant for Machine Learning course",
    ],
    coursework: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Data Structures & Algorithms",
      "Database Systems",
      "Software Engineering",
      "Cloud Computing",
    ],
    achievements: [
      "Published 2 research papers in ML conferences",
      "Winner of University AI Hackathon 2025",
      "President of AI & Data Science Club",
    ],
  },
  {
    id: 2,
    degree: "Online Certifications & Courses",
    school: "Various Platforms",
    duration: "2023 - Present",
    coursework: [
      "Deep Learning Specialization (Coursera)",
      "AWS Machine Learning Engineer",
      "Advanced NLP with Transformers",
      "MLOps: Production ML Systems",
    ],
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
            Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic background and continuous learning journey
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={cn(
                "p-8 rounded-2xl bg-card border border-border",
                "hover:shadow-xl transition-all duration-300"
              )}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-semibold mb-1">{edu.degree}</h3>
                  {edu.specialization && (
                    <p className="text-accent font-medium mb-2">{edu.specialization}</p>
                  )}
                  <p className="text-lg text-muted-foreground">{edu.school}</p>
                  {edu.location && (
                    <p className="text-sm text-muted-foreground">{edu.location}</p>
                  )}
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className="px-4 py-2 rounded-full bg-secondary text-sm font-medium">
                    {edu.duration}
                  </span>
                  {edu.gpa && (
                    <span className="text-sm font-semibold">GPA: {edu.gpa}</span>
                  )}
                </div>
              </div>

              {/* Highlights */}
              {edu.highlights && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Highlights
                  </h4>
                  <ul className="space-y-2">
                    {edu.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-accent mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Relevant Coursework */}
              {edu.coursework && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    {edu.id === 1 ? "Relevant Coursework" : "Certifications"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map((course) => (
                      <span
                        key={course}
                        className="px-3 py-1 rounded-full bg-secondary text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {edu.achievements && (
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Notable Achievements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {edu.achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <p className="text-sm font-medium">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="#"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-secondary hover:bg-secondary/80",
              "border border-border",
              "font-medium transition-all duration-200",
              "hover:scale-105"
            )}
          >
            Download Resume
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
