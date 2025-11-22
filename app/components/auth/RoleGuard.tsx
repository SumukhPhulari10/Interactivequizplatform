"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseBrowser";

type Role = "student" | "teacher" | "admin";

export default function RoleGuard({ allow, children }: { allow: Role | Role[]; children: React.ReactNode }) {
  const supabase = getSupabase();
  const router = useRouter();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;

        if (!user) {
          router.push("/signin");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error || !profile) {
          // No profile or error - default to student
          const role: Role = "student";
          setUserRole(role);
          const allowedRoles = Array.isArray(allow) ? allow : [allow];
          setAuthorized(allowedRoles.includes(role));
        } else {
          const role = (profile.role as Role) || "student";
          setUserRole(role);
          const allowedRoles = Array.isArray(allow) ? allow : [allow];
          setAuthorized(allowedRoles.includes(role));
        }
      } catch (err) {
        console.error("Role check error:", err);
        if (mounted) {
          setAuthorized(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkRole();

    return () => {
      mounted = false;
    };
  }, [allow, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center rounded-lg border border-border/30 bg-surface p-6">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You don&apos;t have permission to access this page. Your role: {userRole || "Unknown"}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              Go to Profile
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-md border border-border/30"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}




