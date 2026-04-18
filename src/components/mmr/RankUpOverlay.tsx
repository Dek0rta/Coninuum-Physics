"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRankName } from "@/lib/mmr";
import type { RankName } from "@/types";

interface RankUpOverlayProps {
  newRank: RankName | null;
  onDismiss: () => void;
}

export function RankUpOverlay({ newRank, onDismiss }: RankUpOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!newRank) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [newRank, onDismiss]);

  // Particle burst effect
  useEffect(() => {
    if (!newRank) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rank = getRankName(newRank);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = [rank.color, "#ffffff", "#fbbf24", "#a78bfa"];

    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120;
      const speed = 3 + Math.random() * 7;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.01,
      });
    }

    let rafId: number;
    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= p.decay;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.globalAlpha = Math.max(0, p.alpha);
        ctx!.fillStyle = p.color;
        ctx!.fill();
      });
      ctx!.globalAlpha = 1;

      if (particles.some((p) => p.alpha > 0)) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [newRank]);

  const rank = newRank ? getRankName(newRank) : null;

  return (
    <AnimatePresence>
      {newRank && rank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center cursor-pointer"
          style={{
            background: `radial-gradient(circle at center, ${rank.color}22 0%, rgba(0,0,0,0.85) 70%)`,
          }}
          onClick={onDismiss}
        >
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
            className="relative flex flex-col items-center gap-6 text-center px-8"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-7xl"
              style={{ filter: `drop-shadow(0 0 30px ${rank.color})` }}
            >
              {rank.icon}
            </motion.div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-white/60 uppercase tracking-widest">
                Rank Up!
              </p>
              <h2
                className="text-5xl font-bold"
                style={{ color: rank.color, textShadow: `0 0 40px ${rank.color}80` }}
              >
                {rank.label}
              </h2>
            </div>

            <p className="text-sm text-white/40">Tap to continue</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
