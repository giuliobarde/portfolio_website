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
