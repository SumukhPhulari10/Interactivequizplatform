"use client";

import React from "react";

type Role = "student" | "teacher" | "admin";

export default function RoleGuard({ allow: _allow, children }: { allow: Role | Role[]; children: React.ReactNode }) {
  void _allow;
  return <>{children}</>;
}




