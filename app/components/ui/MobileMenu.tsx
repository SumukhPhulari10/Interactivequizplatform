"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function MobileMenu() {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const details = detailsRef.current;
      if (!details) return;
      if (!details.hasAttribute("open")) return;
      const target = e.target as Node;
      if (!details.contains(target)) {
        details.removeAttribute("open");
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        const details = detailsRef.current;
        if (details && details.hasAttribute("open")) {
          details.removeAttribute("open");
        }
      }
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  function closeMenu() {
    const details = detailsRef.current;
    if (details && details.hasAttribute("open")) {
      details.removeAttribute("open");
    }
  }

  return (
    <div className="md:hidden ml-auto relative">
      <details ref={detailsRef}>
        <summary className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-foreground/80">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm">Menu</span>
        </summary>
        <div className="absolute right-0 mt-2 z-50 w-56 rounded-lg border border-border/30 bg-surface p-2 shadow-lg space-y-1" onClick={closeMenu}>
          <Link href="/quizzes" className="block px-3 py-2 rounded-md hover:bg-accent/5">Quizzes</Link>
          <Link href="/branches" className="block px-3 py-2 rounded-md hover:bg-accent/5">Branches</Link>
          <Link href="/leaderboard" className="block px-3 py-2 rounded-md hover:bg-accent/5">Leaderboard</Link>
        </div>
      </details>
    </div>
  );
}


