"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabaseBrowser";
import { getAvatarOption } from "@/lib/avatarOptions";

type User = { id: string; email?: string | null } | null;
type Profile = {
  id: string;
  full_name?: string | null;
  role?: string | null;
  avatar_key?: string | null;
  created_at?: string | null;
} | null;
type Activity = { id: number | string; action: string | null; created_at: string };
type AttemptRow = { 
  id?: number | string;
  score?: number | null; 
  total_questions?: number | null;
  quiz_name?: string | null;
  quiz_level?: string | null;
  created_at?: string | null;
};

export default function ProfilePage() {
  const supabase = getSupabase();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [scores, setScores] = useState<AttemptRow[]>([]);
  const [, setError] = useState<string | null>(null); // currently unused UI-wise, but keeps error state

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then((res: { data?: { user: User } }) => {
      if (!active) return;
      setUser(res.data?.user ?? null);
      setLoading(false);
    });
    const { subscription } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getUser().then((res: { data?: { user: User } }) => setUser(res.data?.user ?? null));
    }).data;
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      setError(null);
      try {
        // Force a fresh fetch by adding a timestamp cache buster
        const { data: p, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, role, avatar_key, created_at")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled) {
          setProfile(p ?? null);
          if (profileError) {
            // Supabase errors can sometimes appear as {} in the console because their
            // properties are non-enumerable. This makes the message easier to see.
            const errorMessage =
              profileError instanceof Error
                ? profileError.message
                : (profileError as { message?: string })?.message ||
                  JSON.stringify(profileError);

            console.error("Error loading profile:", errorMessage, profileError);
            setError(errorMessage);
          }
        }
      } catch (err) {
        console.error("Error in load function:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      }
      try {
        const { data: acts } = await supabase
          .from("activity_log")
          .select("id, action, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        type ActRow = { id: number | string; action: string | null; created_at: string };
        if (!cancelled) setActivity(Array.isArray(acts) ? (acts as ActRow[]) : []);
      } catch {}
      try {
        const { data: atts, error: attemptsError } = await supabase
          .from("attempts")
          .select("id, score, total_questions, quiz_name, quiz_level, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (!cancelled) {
          if (attemptsError) {
            console.error("Error loading quiz attempts:", attemptsError);
          }
          setScores(Array.isArray(atts) ? (atts as AttemptRow[]) : []);
        }
      } catch (err) {
        console.error("Error fetching attempts:", err);
        if (!cancelled) setScores([]);
      }
    }
    load();
    
    // Listen for profile changes and new quiz attempts via Supabase realtime
    let profileChannel: ReturnType<typeof supabase.channel> | null = null;
    let attemptsChannel: ReturnType<typeof supabase.channel> | null = null;
    
    if (user?.id) {
      // Listen for profile updates
      profileChannel = supabase
        .channel(`profile-updates:${user.id}`)
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
      
      // Listen for new quiz attempts
      attemptsChannel = supabase
        .channel(`attempts-updates:${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'attempts',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            if (!cancelled) load();
          }
        )
        .subscribe();
    }

    return () => {
      cancelled = true;
      if (profileChannel) profileChannel.unsubscribe();
      if (attemptsChannel) attemptsChannel.unsubscribe();
    };
  }, [user?.id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="max-w-md text-center rounded-lg border border-border/30 bg-surface p-6">
          <h2 className="text-lg font-semibold">Not signed in</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to view your profile and progress.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/signin" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Sign in</Link>
            <Link href="/" className="px-4 py-2 rounded-md border border-border/30">Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 text-foreground px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              {(() => {
                const avatar = getAvatarOption(profile?.avatar_key);
                return (
                  <div
                    className={`relative h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-4xl shadow-lg ring-1 ring-white/40 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]`}
                    aria-label={`${avatar.label} avatar`}
                  >
                    <span className="drop-shadow">{avatar.emoji}</span>
                  </div>
                );
              })()}
              <div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">{profile?.full_name || user?.email || user?.id}</div>
                <div className="mt-1 text-sm text-muted-foreground">{profile?.role || "—"}</div>
                <div className="mt-1 text-xs text-muted-foreground">Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}</div>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm shadow hover:opacity-95 transition"
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur p-5 hover:border-white/20 transition">
              <h2 className="text-base font-semibold tracking-tight">Recent Activity</h2>
              <div className="mt-4 relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
                <div className="space-y-4">
                  {activity.length === 0 && (
                    <div className="text-sm text-muted-foreground">No recent activity.</div>
                  )}
                  {activity.map((a) => (
                    <div key={a.id} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow" />
                      <div className="text-sm">{a.action || "—"}</div>
                      <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur p-5 hover:border-white/20 transition">
              <h2 className="text-base font-semibold tracking-tight">Quiz Score History</h2>
              <div className="mt-4 space-y-3">
                {scores.length === 0 && (
                  <div className="text-sm text-muted-foreground">No attempts yet.</div>
                )}
                {scores.map((s) => (
                  <div key={s.id || s.created_at} className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 dark:bg-black/5 p-3 hover:border-white/15 transition">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.quiz_name || "Quiz"}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                      </div>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <div className="text-sm px-2 py-1 rounded-md bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                        {s.score != null && s.total_questions != null 
                          ? `${s.score}/${s.total_questions}` 
                          : s.score ?? "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

