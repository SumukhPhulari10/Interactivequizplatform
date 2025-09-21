"use client";

import React, { useCallback, useRef, useState } from "react";

export function Spotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const onLeave = useCallback(() => setPos(null), []);

  const bg = pos
    ? `radial-gradient(300px 200px at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.12), transparent 70%)`
    : `radial-gradient(300px 200px at 50% 10%, rgba(255,255,255,0.06), transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="absolute inset-0 pointer-events-auto"
      style={{ background: bg }}
    />
  );
}







