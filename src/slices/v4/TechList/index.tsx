"use client";

import React from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion } from "framer-motion";

export type TechListProps = {
  slice: Content.TechListSlice;
};

// Categorize skills by domain for a DS/CS portfolio
function categorizeSkills(skills: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    "Languages": [],
    "ML / Data": [],
    "Web / Frameworks": [],
    "Tools / Infra": [],
  };

  const categoryMap: Record<string, string> = {
    // Languages
    python: "Languages", java: "Languages", javascript: "Languages",
    typescript: "Languages", c: "Languages", "c++": "Languages",
    "c#": "Languages", r: "Languages", sql: "Languages",
    rust: "Languages", go: "Languages", scala: "Languages",
    kotlin: "Languages", swift: "Languages", matlab: "Languages",
    julia: "Languages", ruby: "Languages", php: "Languages",
    html5: "Languages", css3: "Languages", bash: "Languages",
    // ML / Data
    tensorflow: "ML / Data", pytorch: "ML / Data", keras: "ML / Data",
    scikit: "ML / Data", "scikit-learn": "ML / Data", pandas: "ML / Data",
    numpy: "ML / Data", matplotlib: "ML / Data", seaborn: "ML / Data",
    jupyter: "ML / Data", "machine learning": "ML / Data",
    "deep learning": "ML / Data", nlp: "ML / Data", opencv: "ML / Data",
    spark: "ML / Data", hadoop: "ML / Data", tableau: "ML / Data",
    "power bi": "ML / Data", huggingface: "ML / Data", openai: "ML / Data",
    openrouter: "ML / Data", langchain: "ML / Data", llama: "ML / Data",
    langgraph: "ML / Data",
    // Web / Frameworks
    react: "Web / Frameworks", "next.js": "Web / Frameworks",
    nextjs: "Web / Frameworks", vue: "Web / Frameworks",
    angular: "Web / Frameworks", node: "Web / Frameworks",
    "node.js": "Web / Frameworks", express: "Web / Frameworks",
    django: "Web / Frameworks", flask: "Web / Frameworks",
    fastapi: "Web / Frameworks", spring: "Web / Frameworks",
    tailwindcss: "Web / Frameworks", "tailwind css": "Web / Frameworks",
    bootstrap: "Web / Frameworks", svelte: "Web / Frameworks",
    // Tools / Infra
    git: "Tools / Infra", docker: "Tools / Infra", kubernetes: "Tools / Infra",
    aws: "Tools / Infra", gcp: "Tools / Infra", azure: "Tools / Infra",
    linux: "Tools / Infra", mongodb: "Tools / Infra", postgresql: "Tools / Infra",
    mysql: "Tools / Infra", redis: "Tools / Infra", firebase: "Tools / Infra",
    vercel: "Tools / Infra", netlify: "Tools / Infra", heroku: "Tools / Infra",
    figma: "Tools / Infra", prismic: "Tools / Infra", pinecone: "Tools / Infra",
  };

  skills.forEach((skill) => {
    const key = skill.toLowerCase().trim();
    const category = categoryMap[key] || "Tools / Infra";
    categories[category].push(skill);
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, items]) => items.length > 0)
  );
}

const TechList: React.FC<TechListProps> = ({ slice }) => {
  const wordList = slice.primary.tech_skill
    .map((item) => item.skill)
    .filter((skill): skill is string => typeof skill === "string");

  const rawSectionId = slice.primary.section_id || "skills";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;

  const categorized = categorizeSkills(wordList);

  return (
    <section
      id={sectionId}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="font-mono text-xs text-accent mb-2">
            <span className="text-muted-foreground">{"// "}</span>skills
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {slice.primary.heading}
          </h2>
          {isFilled.richText(slice.primary.tech_description) && (
            <div className="text-base text-muted-foreground max-w-2xl prose dark:prose-invert">
              <PrismicRichText field={slice.primary.tech_description} />
            </div>
          )}
        </motion.div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(categorized).map(([category, skills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              className="terminal-card overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {category.toLowerCase().replace(/\s+\/\s+/g, "-")}.config
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-mono text-sm font-semibold text-accent mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: catIndex * 0.1 + index * 0.03 }}
                      className="group flex items-center gap-3"
                    >
                      <span className="font-mono text-[10px] text-accent/50 w-4 text-right shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground group-hover:text-accent transition-colors">
                          {skill}
                        </span>
                        <div className="flex-1 border-b border-dotted border-border/30" />
                        <span className="w-2 h-2 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-border/30 font-mono text-[10px] text-muted-foreground">
                  {skills.length} {skills.length === 1 ? "item" : "items"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center font-mono text-xs text-muted-foreground"
        >
          <span className="text-accent">$</span> wc -l skills.txt{" "}
          <span className="text-accent">{wordList.length}</span> total
        </motion.div>
      </div>
    </section>
  );
};

export default TechList;
