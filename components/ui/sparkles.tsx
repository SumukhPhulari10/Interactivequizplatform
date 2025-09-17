"use client";

import React, { useEffect, useMemo, useRef } from "react";

type SparklesCoreProps = {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number; // particles per 1000x1000 area
  particleColor?: string;
  className?: string;
};

export function SparklesCore({
  background = "transparent",
  minSize = 0.5,
  maxSize = 1.5,
  particleDensity = 600,
  particleColor = "#FFFFFF",
  className,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const numParticles = useMemo(() => {
    // Approximate by canvas size later; start with density hint
    return particleDensity;
  }, [particleDensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animation = 0;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    }

    function init() {
      particles.length = 0;
      const area = (canvas.width * canvas.height) / (dpr * dpr);
      const scale = area / 1_000_000; // relative to 1000x1000
      const count = Math.max(50, Math.floor(numParticles * scale));
      for (let i = 0; i < count; i++) {
        const r = minSize + Math.random() * (maxSize - minSize);
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: r * dpr,
          vx: (Math.random() - 0.5) * 0.2 * dpr,
          vy: (Math.random() - 0.5) * 0.2 * dpr,
          a: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += 0.02;
        const flicker = (Math.sin(p.a) + 1) * 0.25 + 0.5; // 0.5 - 1.0
        // wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grd.addColorStop(0, particleColor + "cc");
        grd.addColorStop(1, particleColor + "00");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.75 + flicker * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      animation = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      init();
    }

    resize();
    init();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", onResize);
    };
  }, [background, dpr, maxSize, minSize, numParticles, particleColor]);

  return <canvas ref={canvasRef} className={className} />;
}



