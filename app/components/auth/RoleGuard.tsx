"use client";

import React from "react";

type Role = "student" | "teacher" | "admin";

export default function RoleGuard({ allow, children }: { allow: Role | Role[]; children: React.ReactNode }) {
  return <>{children}</>;
}




