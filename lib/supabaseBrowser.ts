"use client";

import { createBrowserClient } from "@supabase/ssr";

declare global {
  interface Window {
    __SUPABASE_URL?: string;
    __SUPABASE_ANON?: string;
  }
}

let _client: ReturnType<typeof createBrowserClient> | null = null;

function readConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof window !== "undefined" ? window.__SUPABASE_URL : undefined) ||
    process.env.SUPABASE_URL;

  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof window !== "undefined" ? window.__SUPABASE_ANON : undefined) ||
    process.env.SUPABASE_ANON_KEY;

  return { url, anon } as { url?: string; anon?: string };
}

export function getSupabase() {
  if (_client) return _client;
  const { url, anon } = readConfig();
  if (!url || !anon) {
    throw new Error("Supabase client missing URL/ANON. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
  }
  _client = createBrowserClient(url, anon);
  return _client;
}
