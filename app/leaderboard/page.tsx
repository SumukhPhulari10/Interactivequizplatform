"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../components/auth/AuthProvider";

type Entry = {
  id: string;
  name: string;
  branch: string;
  score: number; // 0..100
};

const BRANCHES = [
  "Electrical",
  "Mechanical",
  "Computer",
  "Civil",
  "Chemical",
  "AI & ML",
  "Industrial",
  "Materials",
];

const STORAGE_KEY = "iqp:leaderboard";

function seedEntries(): Entry[] {
  const samples = [
    { name: "Aarav Mehta", branch: "Computer" },
    { name: "Ishika Sharma", branch: "Electrical" },
    { name: "Rohan Patel", branch: "Mechanical" },
    { name: "Sneha Iyer", branch: "AI & ML" },
    { name: "Vikram Singh", branch: "Civil" },
    { name: "Ananya Desai", branch: "Chemical" },
    { name: "Rahul Nair", branch: "Industrial" },
    { name: "Meera Kapoor", branch: "Materials" },
    { name: "Kunal Joshi", branch: "Computer" },
    { name: "Priya Gupta", branch: "Electrical" },
  ];
  return samples.map((s, i) => ({
    id: `seed-${i}`,
    name: s.name,
    branch: s.branch,
    score: Math.floor(60 + Math.random() * 40),
  }));
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setEntries(JSON.parse(raw));
      } else {
        const seeded = seedEntries();
        setEntries(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }
    } catch {
      const seeded = seedEntries();
      setEntries(seeded);
    }
  }, [isClient]);

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => b.score - a.score).slice(0, 100);
  }, [entries]);

  const currentUserIndex = useMemo(() => {
    if (!user) return -1;
    return sorted.findIndex((e) => e.name.toLowerCase() === user.name.toLowerCase());
  }, [sorted, user]);

  function enrollUser() {
    if (!user) return;
    if (entries.some((e) => e.name.toLowerCase() === user.name.toLowerCase())) return;
    const newEntry: Entry = {
      id: `u-${Date.now()}`,
      name: user.name,
      branch: BRANCHES[Math.floor(Math.random() * BRANCHES.length)],
      score: Math.floor(50 + Math.random() * 40),
    };
    const next = [...entries, newEntry];
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function boostMyScore(delta: number) {
    if (!user) return;
    const next = entries.map((e) =>
      e.name.toLowerCase() === user.name.toLowerCase()
        ? { ...e, score: Math.min(100, e.score + delta) }
        : e
    );
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-5 sm:px-6 py-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Top scores across branches. Enroll to join the rankings.</p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              currentUserIndex === -1 ? (
                <button onClick={enrollUser} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm">Enroll me</button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => boostMyScore(1)} className="px-3 py-2 rounded-md border border-input text-sm">+1 score</button>
                  <span className="text-xs text-muted-foreground">Signed in as {user.name}</span>
                </div>
              )
            ) : (
              <Link href="/signin" className="px-3 py-2 rounded-md border border-input text-sm">Sign in to enroll</Link>
            )}
          </div>
        </header>

        <section className="rounded-xl border border-border/40 bg-surface overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground">
            <div className="col-span-2">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-3">Branch</div>
            <div className="col-span-2 text-right">Score</div>
          </div>
          <div className="divide-y divide-border/40">
            {sorted.map((e, i) => {
              const isMe = user && e.name.toLowerCase() === user.name.toLowerCase();
              return (
                <div key={e.id} className={`grid grid-cols-12 px-4 py-3 text-sm ${isMe ? "bg-primary/5" : ""}`}>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="w-6 text-muted-foreground">#{i + 1}</span>
                    {i < 3 && (
                      <span className={`inline-block h-2 w-2 rounded-full ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : "bg-amber-800"}`} />
                    )}
                  </div>
                  <div className="col-span-5 truncate font-medium">{e.name}</div>
                  <div className="col-span-3 text-muted-foreground">{e.branch}</div>
                  <div className="col-span-2 text-right font-semibold">{e.score}</div>
                </div>
              );
            })}
          </div>
        </section>

        {user && currentUserIndex >= 0 && (
          <p className="mt-3 text-xs text-muted-foreground">Your current rank: #{currentUserIndex + 1}</p>
        )}
      </main>
    </div>
  );
}


