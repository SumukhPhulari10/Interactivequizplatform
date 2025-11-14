"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function UserMenu() {
  const supabase = getSupabase();
  const [user, setUser] = useState<null | { id: string; email?: string | null }>(null);
  const [profile, setProfile] = useState<{ full_name?: string | null; avatar_url?: string | null; role?: string | null } | null>(null);
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
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) {
        if (!cancelled) setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", user.id)
        .maybeSingle();
      if (!cancelled) setProfile(data ?? null);
    }
    load();
    
    // Listen for profile changes via Supabase realtime (only if user exists)
    let channel: ReturnType<typeof supabase.channel> | null = null;
    if (user?.id) {
      channel = supabase
        .channel(`profile:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          () => {
            if (!cancelled) load();
          }
        )
        .subscribe();
    }

    return () => {
      cancelled = true;
      if (channel) channel.unsubscribe();
    };
  }, [user?.id, supabase]);

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
        className="group inline-flex items-center justify-center h-9 w-9 rounded-full overflow-hidden border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-md hover:border-white/30 hover:bg-white/10 dark:hover:bg-black/30 transition-all shadow-sm"
        aria-label="User menu"
      >
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="avatar" width={36} height={36} className="h-full w-full object-cover" />
        ) : (
          <span className="h-full w-full flex items-center justify-center text-sm font-medium text-foreground/80 bg-gradient-to-br from-purple-500/30 to-blue-500/30">
            {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </button>
      {open && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-xl shadow-lg p-2 z-50">
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <div className="font-medium text-sm text-foreground">
              {profile?.full_name || "User"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {user.email}
            </div>
            {profile?.role && (
              <div className="text-xs text-muted-foreground mt-1 capitalize">
                {profile.role}
              </div>
            )}
          </div>
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
