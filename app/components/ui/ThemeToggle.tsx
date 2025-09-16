"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";

export default function ThemeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      const ls = localStorage.getItem("theme");
      if (ls) return ls === "dark";
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={() => setIsDark((s) => !s)}
      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm border border-border/20 bg-surface/60 hover:bg-surface transition"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      <span className="sr-only">Toggle theme</span>

      {isDark ? (
        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg className="h-4 w-4 text-foreground/80" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}

      <span className="text-xs text-muted-foreground hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}


