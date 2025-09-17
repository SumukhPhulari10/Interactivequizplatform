"use client";

import React from "react";

type TextHoverEffectProps = {
  text: string;
  className?: string;
};

export function TextHoverEffect({ text, className }: TextHoverEffectProps) {
  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className="inline-block transition-transform duration-200 ease-out hover:-translate-y-1 group-hover:-translate-y-1"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}



