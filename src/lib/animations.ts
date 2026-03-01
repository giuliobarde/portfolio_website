import { Variants } from "framer-motion";

// Custom cubic-bezier: snappy start, smooth settle — feels "digital"
export const TERMINAL_EASE = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
  stagger: 0.06,
} as const;

// Section header — fade-up with subtle blur-in
export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.normal, ease: TERMINAL_EASE },
  },
};

// Card entry — fade-up with subtle scale
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.normal, ease: TERMINAL_EASE },
  },
};

// Stagger container — orchestrates children
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: DURATION.stagger,
      delayChildren: 0.1,
    },
  },
};

// List item — for staggered lists
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.fast, ease: TERMINAL_EASE },
  },
};

// Terminal "power on" wipe — for section dividers
export const terminalBootVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: DURATION.slow, ease: TERMINAL_EASE },
  },
};

// Card inner-content stagger — sequential reveal within a card
export const cardContentStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// Individual inner-content item — fade-up
export const cardContentItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.fast, ease: TERMINAL_EASE },
  },
};

// Tech tag pop-in
export const techTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: TERMINAL_EASE },
  },
};

// Tech tag container — fast stagger
export const techTagContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// Compact card entry — smaller, snappier
export const compactCardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.fast, ease: TERMINAL_EASE },
  },
};

// Expand content — for AnimatePresence height animation
export const expandContentVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.35, ease: TERMINAL_EASE },
      opacity: { duration: 0.25, delay: 0.1 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      opacity: { duration: 0.15 },
      height: { duration: 0.3, ease: TERMINAL_EASE },
    },
  },
};

// Factory for alternating-side card entry
export const getAlternatingCardVariants = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    x: index % 2 === 0 ? -60 : 60,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: TERMINAL_EASE,
    },
  },
});
