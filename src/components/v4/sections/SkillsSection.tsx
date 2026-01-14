"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample skills data - customize with your actual skills
const skillCategories = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript/TypeScript", level: 90 },
      { name: "Java", level: 85 },
      { name: "C++", level: 80 },
      { name: "SQL", level: 85 },
      { name: "R", level: 75 },
    ],
  },
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "TensorFlow", level: 90 },
      { name: "PyTorch", level: 88 },
      { name: "Scikit-learn", level: 92 },
      { name: "Keras", level: 85 },
      { name: "Hugging Face Transformers", level: 80 },
      { name: "OpenCV", level: 85 },
    ],
  },
  {
    category: "Data Science & Analytics",
    skills: [
      { name: "Pandas", level: 95 },
      { name: "NumPy", level: 93 },
      { name: "Matplotlib/Seaborn", level: 88 },
      { name: "Tableau", level: 82 },
      { name: "Apache Spark", level: 78 },
    ],
  },
  {
    category: "Web Development",
    skills: [
      { name: "React/Next.js", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "FastAPI/Flask", level: 88 },
      { name: "REST APIs", level: 90 },
      { name: "GraphQL", level: 75 },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { name: "AWS", level: 85 },
      { name: "Docker", level: 88 },
      { name: "Kubernetes", level: 75 },
      { name: "Git/GitHub", level: 92 },
      { name: "CI/CD", level: 80 },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 85 },
      { name: "Redis", level: 80 },
      { name: "Vector DBs (Pinecone)", level: 75 },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
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
            Skills & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical expertise across AI, data science, and software development
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className={cn(
                "p-6 rounded-2xl bg-card border border-border",
                "hover:shadow-xl transition-shadow duration-300"
              )}
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                {category.category}
              </h3>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          ease: "easeOut",
                        }}
                        className="h-full bg-gradient-to-r from-accent to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Always learning and exploring new technologies in AI and software development
          </p>
        </motion.div>
      </div>
    </section>
  );
}
