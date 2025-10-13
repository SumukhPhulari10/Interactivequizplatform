"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../components/auth/AuthProvider";

const AVATARS = [
  { id: "spark-bot", label: "Spark Bot", glyph: "🤖" },
  { id: "cool-cat", label: "Cool Cat", glyph: "😼" },
  { id: "nerd", label: "Nerd", glyph: "🤓" },
  { id: "rocket", label: "Rocket", glyph: "🚀" },
  { id: "unicorn", label: "Unicorn", glyph: "🦄" },
  { id: "brain", label: "Brain", glyph: "🧠" },
  { id: "star", label: "Star", glyph: "⭐" },
  { id: "fire", label: "Fire", glyph: "🔥" },
];

const ACCENTS = [
  { id: "accent-blue", label: "Blue", swatch: "swatch-blue" },
  { id: "accent-rose", label: "Rose", swatch: "swatch-rose" },
  { id: "accent-violet", label: "Violet", swatch: "swatch-violet" },
  { id: "accent-emerald", label: "Emerald", swatch: "swatch-emerald" },
  { id: "accent-orange", label: "Orange", swatch: "swatch-orange" },
];

export default function PreferencesPage() {
  const { user } = useAuth();
  const [avatarId, setAvatarId] = useState<string>(AVATARS[0].id);
  const [accent, setAccent] = useState<string>(ACCENTS[0].id);

  // Load per-user appearance
  useEffect(() => {
    if (!user) return;
    try {
      const key = `appearance:${user.name}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as { avatarId?: string; accent?: string };
        if (saved.avatarId) setAvatarId(saved.avatarId);
        if (saved.accent) setAccent(saved.accent);
      }
    } catch {}
  }, [user]);

  const selectedAvatar = useMemo(() => AVATARS.find(a => a.id === avatarId) ?? AVATARS[0], [avatarId]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-lg border border-border/30 bg-surface p-6">
          <h2 className="text-lg font-semibold">Not signed in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to customize your avatar and theme.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/signin" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Sign in</Link>
            <Link href="/" className="px-4 py-2 rounded-md border border-border/30">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-8">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Avatar & Theme</h1>
          <Link href="/profile" className="text-sm text-muted-foreground hover:underline">Back to profile</Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-border/30 bg-surface p-5">
            <h2 className="text-lg font-semibold">Choose your avatar</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick something fun. It will show across the app.</p>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvatarId(a.id)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-2xl sm:text-3xl ${avatarId === a.id ? "border-primary ring-2 ring-primary/30 bg-background" : "border-border/30 bg-background/60"}`}
                  aria-pressed={avatarId === a.id}
                  title={a.label}
                >
                  <span>{a.glyph}</span>
                  <span className="mt-1 text-[10px] sm:text-xs text-muted-foreground">{a.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border/30 bg-surface p-5">
            <h2 className="text-lg font-semibold">Accent theme</h2>
            <p className="mt-1 text-sm text-muted-foreground">This changes highlight colors. Dark/Light is still in the header toggle.</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {ACCENTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAccent(t.id)}
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${accent === t.id ? "border-primary ring-2 ring-primary/30 bg-background" : "border-border/30 bg-background/60"}`}
                  aria-pressed={accent === t.id}
                >
                  <span>{t.label}</span>
                  <span className={`h-5 w-5 rounded-full ${t.swatch}`}></span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              try {
                const key = `appearance:${user.name}`;
                localStorage.setItem(key, JSON.stringify({ avatarId, accent }));
                localStorage.setItem('accent', accent);
                // Apply accent immediately
                const root = document.documentElement;
                root.classList.remove(
                  "accent-blue",
                  "accent-rose",
                  "accent-violet",
                  "accent-emerald",
                  "accent-orange",
                );
                root.classList.add(accent);
              } catch {}
            }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save changes
          </button>
          <span className="text-sm text-muted-foreground">Your choices are saved to this device for your account.</span>
        </div>

        <div className="mt-8 rounded-lg border border-border/30 bg-surface p-5">
          <h3 className="text-sm font-medium">Preview</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-2xl">
              {selectedAvatar.glyph}
            </div>
            <div>
              <div className="text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">Accent: {ACCENTS.find(a => a.id === accent)?.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
