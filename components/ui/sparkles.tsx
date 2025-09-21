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
    return particleDensity;
  }, [particleDensity]);

  // Helper function for linear interpolation
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animation = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    
    const particles: {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      size: number;
      ttl: number;
      age: number;
      alpha: number;
      wobble: number;
    }[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      
      // Set the internal size to match the display size, accounting for device pixel ratio
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      
      // Scale the drawing context so everything draws at the correct size
      canvas.style.width = canvasWidth + 'px';
      canvas.style.height = canvasHeight + 'px';
    }

    function init() {
      if (!canvas) return;
      particles.length = 0;

      // Scale particle count by canvas area
      const area = canvasWidth * canvasHeight;
      const scale = area / 1_000_000; // relative to a 1000x1000 baseline
      const count = Math.max(50, Math.floor(numParticles * scale));

      for (let i = 0; i < count; i++) {
        const size = lerp(minSize, maxSize, Math.random());
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: size,
          size,
          ttl: 60 + Math.random() * 120,
          age: 0,
          alpha: 0,
          a: 0,
          wobble: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;

      // Save the context state
      ctx.save();
      
      // Scale the context to account for device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Clear the canvas
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Set blend mode for sparkles
      ctx.globalCompositeOperation = "lighter";
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update particle position and properties
        p.x += p.vx;
        p.y += p.vy;
        p.a += 0.02;
        p.age++;

        const flicker = (Math.sin(p.a) + 1) * 0.25 + 0.5; // 0.5 - 1.0
        
        // Wrap particles around screen
        if (p.x < -p.r) p.x = canvasWidth + p.r;
        if (p.x > canvasWidth + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvasHeight + p.r;
        if (p.y > canvasHeight + p.r) p.y = -p.r;

        // Calculate alpha based on age and ttl
        const ageRatio = p.age / p.ttl;
        let alpha = 1;
        if (ageRatio < 0.1) {
          alpha = ageRatio / 0.1; // fade in
        } else if (ageRatio > 0.8) {
          alpha = (1 - ageRatio) / 0.2; // fade out
        }

        // Create radial gradient for sparkle effect
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        
        // Parse color and create gradient
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };
        
        const color = hexToRgb(particleColor);
        const finalAlpha = alpha * 0.8 * flicker;
        
        grd.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${finalAlpha})`);
        grd.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
        
        // Draw the sparkle
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.75 + flicker * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Remove old particles
        if (p.age >= p.ttl) {
          particles.splice(i, 1);
          
          // Add a new particle to maintain count
          const size = lerp(minSize, maxSize, Math.random());
          particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: size,
            size,
            ttl: 60 + Math.random() * 120,
            age: 0,
            alpha: 0,
            a: 0,
            wobble: Math.random() * Math.PI * 2,
          });
        }
      }
      
      // Restore context state
      ctx.restore();
      
      // Continue animation
      animation = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      init();
    }

    // Initialize everything
    resize();
    init();
    draw();
    
    // Add resize listener
    window.addEventListener("resize", onResize);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", onResize);
    };
  }, [background, dpr, maxSize, minSize, numParticles, particleColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ 
        display: 'block',
        width: '100%', 
        height: '100%' 
      }} 
    />
  );
}