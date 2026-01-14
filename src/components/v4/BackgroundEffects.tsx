"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `
            linear-gradient(to right, rgba(228, 228, 231, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(228, 228, 231, 0.1) 1px, transparent 1px)
          `,
        }}
      />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
        }}
      />

      {/* Animated Gradient Orbs - Apple Style */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
