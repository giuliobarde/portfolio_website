"use client";

import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Work", href: "#work" },
  { name: "Skills", href: "#skills" },
  { name: "Education", href: "#education" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = React.useState("home");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => handleClick(e, "#home")}
            className="text-xl md:text-2xl font-semibold tracking-tight"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-gradient">Portfolio</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  activeSection === item.href.slice(1)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveSection(item.href.slice(1))}
              >
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-secondary rounded-lg"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Add functionality later if needed */}
    </motion.nav>
  );
}
