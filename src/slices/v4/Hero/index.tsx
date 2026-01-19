"use client";

import { FC, useState, useEffect } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { motion } from "framer-motion";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

function useTypingEffect(text: string, speed = 60, delay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, isDone };
}

const Hero: FC<HeroProps> = ({ slice }) => {
  const rawSectionId = slice.primary.section_id || "home";
  const sectionId = typeof rawSectionId === "string" ? rawSectionId.replace(/^#+/, "") : rawSectionId;

  const fullName = `${slice.primary.first_name || ""} ${slice.primary.last_name || ""}`.trim();
  const tagLine = slice.primary.tag_line || "";

  const { displayed: nameTyped, isDone: nameDone } = useTypingEffect(fullName, 70, 800);
  const { displayed: tagTyped, isDone: tagDone } = useTypingEffect(tagLine, 40, 800 + fullName.length * 70 + 400);

  return (
    <section
      id={sectionId}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="terminal-card overflow-hidden"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2">~/portfolio</span>
          </div>

          {/* Terminal content */}
          <div className="p-6 sm:p-8 md:p-10 font-mono space-y-4">
            {/* Greeting line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-sm"
            >
              <span className="text-accent">$</span> cat intro.md
            </motion.div>

            {/* Name */}
            <div className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-terminal-gradient">{nameTyped}</span>
              {!nameDone && <span className="inline-block w-3 h-8 sm:h-12 bg-accent/80 ml-1 cursor-blink align-middle" />}
            </div>

            {/* Tagline */}
            <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
              {tagTyped}
              {nameDone && !tagDone && <span className="inline-block w-2 h-5 bg-accent/80 ml-0.5 cursor-blink align-middle" />}
            </div>

            {/* Terminal prompt after typing */}
            {tagDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 space-y-3"
              >
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-accent-foreground font-mono text-sm font-medium hover:brightness-110 transition-all glow"
                  >
                    <span>./view_projects</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="#about"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card hover:bg-muted hover:border-accent/30 font-mono text-sm font-medium transition-all"
                  >
                    <span>./about_me</span>
                  </a>
                </div>

                {/* Status indicators */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Open to opportunities
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Data Science &amp; CS
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="flex justify-center mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-muted-foreground/40 font-mono text-xs flex flex-col items-center gap-2"
          >
            <span>scroll</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
