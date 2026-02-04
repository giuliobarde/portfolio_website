"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  angle: number;
  rotationSpeed: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  phase: number; // unique phase for pulsing
}

interface CodeChar {
  x: number;
  y: number;
  vy: number;
  char: string;
  opacity: number;
  fontSize: number;
}

const CODE_CHARS = ["{", "}", "0", "1", "/", ">", "$", "_", ";", "(", ")", "<", "="];

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentTheme = theme === "system" ? systemTheme : theme;
    setIsDark(currentTheme === "dark");
  }, [theme, systemTheme, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let animationId: number;
    let particles: Particle[] = [];
    let orbs: Orb[] = [];
    let codeChars: CodeChar[] = [];
    let time = 0;
    let lastFrameTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;

    const resize = () => {
      const w = width();
      const h = height();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const initCodeChars = () => {
      const w = width();
      const h = height();
      const count = 22;
      codeChars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: -(Math.random() * 0.2 + 0.1), // slow upward drift
        char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
        opacity: Math.random() * 0.05 + 0.03, // extremely subtle
        fontSize: Math.random() * 4 + 10, // 10-14px
      }));
    };

    const initParticles = () => {
      const w = width();
      const h = height();

      if (isDark) {
        const count = 15;
        orbs = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 100 + 50,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.25 + 0.1,
          phase: Math.random() * Math.PI * 2, // unique pulse phase
        }));
        particles = [];
      } else {
        const count = Math.min(Math.floor((w * h) / 15000), 80);
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 4 + 3,
          opacity: Math.random() * 0.4 + 0.2,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
        }));
        orbs = [];
      }

      initCodeChars();
    };

    const drawCodeChars = () => {
      const w = width();
      const h = height();
      const color = isDark ? "147, 197, 253" : "59, 130, 246";

      codeChars.forEach((c) => {
        ctx.save();
        ctx.font = `${c.fontSize}px monospace`;
        ctx.fillStyle = `rgba(${color}, ${c.opacity})`;
        ctx.fillText(c.char, c.x, c.y);
        ctx.restore();

        // Update position
        c.y += c.vy;

        // Respawn at bottom when exiting top
        if (c.y < -20) {
          c.y = h + 20;
          c.x = Math.random() * w;
          c.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        }
      });
    };

    const drawDarkMode = () => {
      const w = width();
      const h = height();
      ctx.clearRect(0, 0, w, h);

      // Draw floating orbs with pulsing glow
      orbs.forEach((orb) => {
        // Sinusoidal opacity pulse
        const pulseOpacity = orb.opacity + Math.sin(time * 0.02 + orb.phase) * 0.05;
        const clampedOpacity = Math.max(0.05, Math.min(pulseOpacity, 0.35));

        // Outer glow
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * 2
        );
        gradient.addColorStop(0, `rgba(96, 165, 250, ${clampedOpacity})`);
        gradient.addColorStop(0.5, `rgba(96, 165, 250, ${clampedOpacity * 0.6})`);
        gradient.addColorStop(1, `rgba(96, 165, 250, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core orb
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${Math.min(clampedOpacity * 3, 0.8)})`;
        ctx.fill();

        // Update position
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < -orb.radius) orb.vx = Math.abs(orb.vx);
        if (orb.x > w + orb.radius) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.radius) orb.vy = Math.abs(orb.vy);
        if (orb.y > h + orb.radius) orb.vy = -Math.abs(orb.vy);
      });

      // Draw connecting lines with enhanced styling
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 350) {
            const opacity = (1 - dist / 350) * 0.15;
            const lineWidth = 1 + (1 - dist / 350) * 0.5;

            // Connecting line
            ctx.beginPath();
            ctx.strokeStyle = `rgba(147, 197, 253, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            ctx.stroke();

            // Midpoint glow dot
            const mx = (orbs[i].x + orbs[j].x) / 2;
            const my = (orbs[i].y + orbs[j].y) / 2;
            ctx.beginPath();
            ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(147, 197, 253, ${opacity * 1.5})`;
            ctx.fill();
          }
        }
      }

      // Draw floating code characters
      drawCodeChars();
    };

    const drawLightMode = () => {
      const w = width();
      const h = height();
      ctx.clearRect(0, 0, w, h);

      // Draw geometric shapes
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;

        const shapeType = Math.floor(p.x + p.y) % 2;

        if (shapeType === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(-p.size * 0.866, p.size * 0.5);
          ctx.lineTo(p.size * 0.866, p.size * 0.5);
          ctx.closePath();
          ctx.fillStyle = "rgba(96, 165, 250, 0.5)";
          ctx.fill();
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.rotationSpeed;

        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = h + p.size;
        if (p.y > h + p.size) p.y = -p.size;
      });

      // Draw subtle wave pattern
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const y = h * 0.2 + i * (h * 0.2);
        const amplitude = 30;
        const frequency = 0.008;
        for (let x = 0; x < w; x += 2) {
          const waveY = y + Math.sin((x * frequency + time * 0.3) * 0.01) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      // Draw floating code characters
      drawCodeChars();
    };

    const draw = (currentTime: number) => {
      animationId = requestAnimationFrame(draw);

      // 30fps frame cap
      const delta = currentTime - lastFrameTime;
      if (delta < FRAME_INTERVAL) return;
      lastFrameTime = currentTime - (delta % FRAME_INTERVAL);

      time += 0.5;
      if (isDark) {
        drawDarkMode();
      } else {
        drawLightMode();
      }
    };

    resize();
    initParticles();
    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark, mounted]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ zIndex: -10 }}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDark
            ? [
                "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
              ]
            : [
                "radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.25) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 70%, rgba(147, 197, 253, 0.25) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.25) 0%, transparent 50%)",
              ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Canvas animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: isDark ? "screen" : "normal",
          opacity: isDark ? 1 : 0.9,
          zIndex: 1,
          willChange: "transform",
        }}
      />

      {/* Subtle grid pattern - only visible in dark mode */}
      {isDark && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 197, 253, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 197, 253, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)"
            : "radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.15) 100%)",
        }}
      />
    </div>
  );
}
