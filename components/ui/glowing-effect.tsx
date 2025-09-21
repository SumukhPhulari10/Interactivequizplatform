"use client";

import React, { useCallback, useRef, useState } from "react";

type GlowingEffectProps = {
  spread?: number; // px radius for the glow falloff
  proximity?: number; // sensitivity; higher = larger glow
  inactiveZone?: number; // 0..1, how dim when not hovering
  glow?: boolean; // add subtle drop shadow
  className?: string;
  color?: string; // CSS color for glow center
};

export function GlowingEffect({
  spread = 40,
  proximity = 64,
  inactiveZone = 0.1,
  glow = true,
  className,
  color = "rgba(99, 102, 241, 0.35)", // indigo-500-ish
}: GlowingEffectProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  }, []);

  const onLeave = useCallback(() => {
    setCoords(null);
  }, []);

  const background = coords
    ? `radial-gradient(${spread}px ${spread}px at ${coords.x}px ${coords.y}px, ${color}, transparent ${proximity}%)`
    : `radial-gradient(${spread}px ${spread}px at 50% 50%, rgba(0,0,0,0), transparent ${Math.max(
        0,
        Math.min(100, inactiveZone * 100)
      )}%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`pointer-events-auto absolute inset-0 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${
        glow ? "[filter:drop-shadow(0_0_8px_rgba(99,102,241,0.35))]" : ""
      } ${className ?? ""}`}
      style={{ background }}
    />
  );
}







