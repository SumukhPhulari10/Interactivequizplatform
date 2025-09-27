"use client";

import Link from "next/link";
import RoleGuard from "../components/auth/RoleGuard";

export default function StudentDashboard() {
  return (
    <RoleGuard allow="student">
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Give exams, view your scores, and see the leaderboard.</p>

        <div className="mt-6 grid gap-3">
          <Link href="/quizzes" className="px-3 py-2 rounded-md border border-input text-sm">Start practicing</Link>
          <Link href="/leaderboard" className="px-3 py-2 rounded-md border border-input text-sm">View leaderboard</Link>
          <Link href="/profile" className="px-3 py-2 rounded-md border border-input text-sm">Your scores</Link>
        </div>
      </div>
    </RoleGuard>
  );
}




