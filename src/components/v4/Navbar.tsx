"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { VersionToggle } from "./VersionToggle";

const navItems = [
  { name: "about me", href: "#about_me" },
  { name: "timeline", href: "#timeline" },
  { name: "skills", href: "#skills" },
  { name: "projects", href: "#projects" },
];

interface NavbarProps {
  userName?: string;
  webIconUrl?: string;
  currentVersion?: "v3" | "v4";
  resumeText?: string;
  resumeUrl?: string;
  websiteVersions?: string[];
}

export default function Navbar({
  userName = "Portfolio",
  webIconUrl,
  currentVersion = "v4",
  resumeText = "Resume",
  resumeUrl,
  websiteVersions,
}: NavbarProps) {
  const [activeSection, setActiveSection] = React.useState("home");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Track active section based on scroll position
  React.useEffect(() => {
    const sections = navItems.map((item) => item.href.slice(1));
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sections.includes(sectionId)) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    const checkInitialSection = () => {
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    const timeoutId = setTimeout(checkInitialSection, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Close mobile menu on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  React.useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_0_20px_hsl(var(--terminal)/0.03)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => handleClick(e, "#home")}
              className="flex items-center gap-2.5 font-mono text-sm md:text-base group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {webIconUrl ? (
                <Image
                  src={webIconUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-1 ring-border/50 group-hover:ring-accent/30 transition-all"
                />
              ) : (
                <span className="text-accent text-lg">$</span>
              )}
              <span className="text-foreground font-semibold tracking-tight">{userName}</span>
              <span className="w-[2px] h-4 bg-accent/70 cursor-blink inline-block" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={cn(
                      "relative px-3 py-1.5 rounded-md text-xs font-mono transition-colors",
                      isActive
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-accent/8 border border-accent/15 rounded-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      <span className="text-accent/50">./</span>
                      {item.name}
                    </span>
                  </motion.a>
                );
              })}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Resume Button - Desktop */}
              {resumeUrl && (
                <motion.a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-accent/25 text-accent text-xs font-mono
                    hover:bg-accent/10 hover:border-accent/40 hover:shadow-[0_0_12px_hsl(var(--terminal)/0.15)]
                    active:scale-95 transition-all duration-200"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {resumeText}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.a>
              )}

              <div className="hidden md:block w-px h-5 bg-border/50" />

              <VersionToggle
                currentVersion={currentVersion}
                versions={websiteVersions}
              />
              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1.5 rounded-md border border-border/60 hover:border-accent/30 hover:bg-accent/5 transition-all font-mono text-xs"
                aria-label="Toggle menu"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileOpen ? (
                    <motion.svg
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-5">
              {/* Version toggle at top */}
              <VersionToggle
                currentVersion={currentVersion}
                versions={websiteVersions}
              />

              <div className="w-16 h-px bg-border/30 my-1" />

              {/* Nav items */}
              {navItems.map((item, index) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.04 }}
                    className={cn(
                      "font-mono text-lg transition-colors",
                      isActive
                        ? "text-accent glow-text"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    <span className="text-accent/50">$ cd </span>
                    {item.name}
                    {isActive && (
                      <span className="ml-2 text-accent animate-pulse">_</span>
                    )}
                  </motion.a>
                );
              })}

              {/* Resume button in mobile menu */}
              {resumeUrl && (
                <>
                  <div className="w-16 h-px bg-border/30 my-1" />
                  <motion.a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: navItems.length * 0.04 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md border border-accent/30 text-accent font-mono text-base
                      hover:bg-accent/10 hover:border-accent/50 transition-all"
                  >
                    {resumeText}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
