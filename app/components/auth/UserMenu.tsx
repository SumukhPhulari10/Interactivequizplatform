"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function UserMenu() {
  const supabase = getSupabase();
  const [user, setUser] = useState<null | { id: string; email?: string | null }>(null);
  const [profile, setProfile] = useState<{ full_name?: string | null; avatar_url?: string | null } | null>(null);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then((res: { data?: { user: { id: string; email?: string | null } | null } }) => {
      if (active) setUser(res.data?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then((res: { data?: { user: { id: string; email?: string | null } | null } }) => setUser(res.data?.user ?? null));
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) {
        if (!cancelled) setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) setProfile(data ?? null);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // simple outside click handler
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (!user) {
    return (
      <Link href="/signin" className="px-3 py-2 rounded-md border border-input text-sm">
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex items-center gap-2 px-2 py-1 rounded-md border border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur text-sm hover:border-white/20 transition"
      >
        <span className="inline-block h-7 w-7 rounded-full overflow-hidden bg-muted/20 border border-border/30">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="avatar" width={28} height={28} className="h-full w-full object-cover" />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">—</span>
          )}
        </span>
        <span className="max-w-[9rem] truncate text-foreground/80 group-hover:text-foreground transition">{profile?.full_name || user.email || "Profile"}</span>
        <svg className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl shadow-lg p-1">
          <Link
            href="/profile"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            onClick={() => setOpen(false)}
          >
            View Profile
          </Link>
          <Link
            href="/profile/edit"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            onClick={() => setOpen(false)}
          >
            Edit Profile
          </Link>
          <button
            className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            onClick={async () => {
              setOpen(false);
              await supabase.auth.signOut();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
