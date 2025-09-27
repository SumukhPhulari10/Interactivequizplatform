"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

type Role = "student" | "teacher" | "admin";

export default function RoleGuard({ allow, children }: { allow: Role | Role[]; children: React.ReactNode }) {
  const { user } = useAuth();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!user || !allowed.includes(user.role)) {
    return (
      <div className="container mx-auto px-5 py-10">
        <div className="rounded-lg border border-border/40 bg-surface p-6">
          <h2 className="text-lg font-semibold">Access denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}



