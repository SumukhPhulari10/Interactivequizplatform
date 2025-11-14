"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoleGuard from "../components/auth/RoleGuard";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function AdminDashboard() {
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
        setUserName(profile?.full_name || user.email || "Admin");
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  return (
    <RoleGuard allow="admin">
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome, {userName || "Admin"}. Full site management and control.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/branches"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">Manage Questions</h3>
            <p className="text-sm text-muted-foreground">Create, edit, and delete quiz questions</p>
          </Link>
          <Link
            href="/leaderboard"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">Leaderboard</h3>
            <p className="text-sm text-muted-foreground">View all student rankings</p>
          </Link>
          <Link
            href="/profile"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">All Scores</h3>
            <p className="text-sm text-muted-foreground">View and manage all student data</p>
          </Link>
          <Link
            href="/admin/users"
            className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold mb-1">User Management</h3>
            <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
