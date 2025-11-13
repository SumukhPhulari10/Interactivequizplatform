"use client";

import { createBrowserClient } from "@supabase/ssr";

declare global {
  interface Window {
    __SUPABASE_URL?: string;
    __SUPABASE_ANON?: string;
  }
}

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof window !== "undefined" ? window.__SUPABASE_URL : undefined) ||
  process.env.SUPABASE_URL;

const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof window !== "undefined" ? window.__SUPABASE_ANON : undefined) ||
  process.env.SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(url!, anon!);
