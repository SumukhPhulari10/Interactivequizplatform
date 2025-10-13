"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../components/auth/AuthProvider";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  const [branch, setBranch] = useState("Electrical");
  const [bio, setBio] = useState("3rd year engineering student. Loves circuits & embedded systems.");
  const [email, setEmail] = useState("alex.johnson@university.edu");
  const [avatarId, setAvatarId] = useState<string | null>(null);

  // Load saved profile (per-username) on client
  useEffect(() => {
    if (!user) return;
    try {
      const key = `profile:${user.name}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as { name?: string; branch?: string; bio?: string; email?: string };
        if (saved.name) setName(saved.name);
        if (saved.branch) setBranch(saved.branch);
        if (saved.bio) setBio(saved.bio);
        if (saved.email) setEmail(saved.email);
      }
      // appearance (avatar)
      const aKey = `appearance:${user.name}`;
      const aRaw = localStorage.getItem(aKey);
      if (aRaw) {
        const appearance = JSON.parse(aRaw) as { avatarId?: string };
        if (appearance.avatarId) setAvatarId(appearance.avatarId);
      }
    } catch {}
  }, [user]);

  // Compute initials from current name
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [name]);

  const AVATARS = useMemo(() => ([
    { id: "spark-bot", glyph: "🤖" },
    { id: "cool-cat", glyph: "😼" },
    { id: "nerd", glyph: "🤓" },
    { id: "rocket", glyph: "🚀" },
    { id: "unicorn", glyph: "🦄" },
    { id: "brain", glyph: "🧠" },
    { id: "star", glyph: "⭐" },
    { id: "fire", glyph: "🔥" },
  ]), []);
  const avatarGlyph = useMemo(() => AVATARS.find(a => a.id === avatarId)?.glyph ?? null, [AVATARS, avatarId]);

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
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center text-xl sm:text-2xl font-semibold text-primary">
                {avatarGlyph ? avatarGlyph : initials}
              </div>
              <span className="absolute -bottom-1 -right-1 rounded-full bg-surface/80 border border-border/30 px-2 py-1 text-xs text-muted-foreground">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student"}</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{name}</h1>
              <div className="text-sm text-muted-foreground">{branch} · {email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing((e) => !e)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
            <button
              onClick={() => logout()}
              className="inline-flex items-center px-4 py-2 rounded-md border border-border/30 text-sm hover:bg-surface"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Profile / Edit card */}
          <div className="md:col-span-2 rounded-lg border border-border/30 bg-surface p-5">
            {!editing ? (
              <>
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 text-sm text-muted-foreground">{bio}</p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Stat label="Quizzes taken" value="42" />
                  <Stat label="Avg score" value="78%" />
                  <Stat label="Topics mastered" value="8" />
                  <Stat label="Streak" value="6 days" />
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium">Recent attempts</h3>
                  <ul className="mt-3 space-y-2">
                    <RecentItem title="Signals & Systems — Mini" result="82%" date="2 days ago" />
                    <RecentItem title="Thermodynamics Quick Test" result="74%" date="5 days ago" />
                    <RecentItem title="Data Structures Basics" result="91%" date="1 week ago" />
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Edit profile</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Save to localStorage per-username
                    try {
                      if (user) {
                        const key = `profile:${user.name}`;
                        localStorage.setItem(
                          key,
                          JSON.stringify({ name, branch, bio, email })
                        );
                      }
                    } catch {}
                    setEditing(false);
                  }}
                  className="mt-4 space-y-4"
                >
                  <label className="group/field block relative pb-3">
                    <span className="text-sm text-muted-foreground">Full name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus-visible:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus-visible:opacity-100" />
                  </label>

                  <label className="group/field block relative pb-3">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="you@example.com"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                  </label>

                  <label className="group/field block relative pb-3">
                    <span className="text-sm text-muted-foreground">Branch</span>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      aria-label="Branch"
                    >
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Computer">Computer</option>
                      <option value="Civil">Civil</option>
                      <option value="Chemical">Chemical</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Materials">Materials</option>
                    </select>
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                  </label>

                  <label className="group/field block relative pb-3">
                    <span className="text-sm text-muted-foreground">Bio</span>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                    <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/field:opacity-100 focus-within:opacity-100 peer-focus:opacity-100" />
                  </label>

                  <div className="flex gap-3">
                    <button type="submit" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center px-4 py-2 rounded-md border border-border/30 text-sm">Cancel</button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Right column: progress + settings */}
          <aside className="rounded-lg border border-border/30 bg-surface p-5">
            <h3 className="text-lg font-semibold">Progress</h3>
            <div className="mt-4">
              <ProgressBar label="Overall mastery" percent={72} color="bg-primary" />
              <ProgressBar label="Electrical" percent={84} color="bg-accent" />
              <ProgressBar label="Computer" percent={65} color="bg-rose-600" />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium">Account</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/profile/security" className="text-sm text-muted-foreground hover:underline">Security & password</Link>
                <Link href="/profile/preferences" className="text-sm text-muted-foreground hover:underline">Preferences</Link>
                <button className="mt-2 text-sm text-primary">Sign out</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* small subcomponents */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background/50 p-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function RecentItem({ title, result, date }: { title: string; result: string; date: string }) {
  return (
    <li className="flex items-center justify-between rounded-md bg-background/40 p-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
      <div className="text-sm font-medium">{result}</div>
    </li>
  );
}

function ProgressBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{percent}%</div>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-background/30">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
