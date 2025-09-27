"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Link href="/signin" className="px-3 py-2 rounded-md border border-input text-sm">
        Sign in
      </Link>
    );
  }

  const dashboard = user.role === "admin" ? "/admin" : user.role === "teacher" ? "/teacher" : "/student";

  return (
    <div className="flex items-center gap-2">
      <Link href={dashboard} className="px-3 py-2 rounded-md border border-input text-sm">
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
      </Link>
      <button onClick={logout} className="px-3 py-2 rounded-md border border-input text-sm">Sign out</button>
    </div>
  );
}


