"use client";

import { motion } from "framer-motion";
import { terminalBootVariants, TERMINAL_EASE } from "@/lib/animations";

export default function SectionDivider() {
  return (
    <div className="relative py-8 flex items-center justify-center">
      <motion.div
        variants={terminalBootVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent origin-center"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.3, duration: 0.3, ease: TERMINAL_EASE }}
        className="absolute w-1.5 h-1.5 rounded-full bg-accent/60"
      />
    </div>
  );
}
