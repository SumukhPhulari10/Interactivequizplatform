"use client";

import Link from "next/link";
import RoleGuard from "../components/auth/RoleGuard";

export default function TeacherDashboard() {
  return (
    <RoleGuard allow={["teacher", "admin"]}>
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage questions and view student performance.</p>

        <div className="mt-6 grid gap-3">
          <Link href="/branches" className="px-3 py-2 rounded-md border border-input text-sm">Add or edit questions</Link>
          <Link href="/leaderboard" className="px-3 py-2 rounded-md border border-input text-sm">Leaderboard</Link>
          <Link href="/profile" className="px-3 py-2 rounded-md border border-input text-sm">Student scores</Link>
        </div>
      </div>
    </RoleGuard>
  );
}




