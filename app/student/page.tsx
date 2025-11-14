"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoleGuard from "../components/auth/RoleGuard";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function StudentDashboard() {
  const supabase = getSupabase();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted || !user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (mounted) {
        setUserName(profile?.full_name || user.email || "Student");
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <RoleGuard allow="student">
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome, {userName || "Student"}. Take quizzes, view your scores, and track your progress.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/quizzes"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">Start Practicing</h3>
            <p className="text-sm text-muted-foreground">Take quizzes and practice questions</p>
          </Link>
          <Link
            href="/leaderboard"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">View Leaderboard</h3>
            <p className="text-sm text-muted-foreground">See how you rank among other students</p>
          </Link>
          <Link
            href="/profile"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">Your Scores</h3>
            <p className="text-sm text-muted-foreground">View your quiz results and progress</p>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}




