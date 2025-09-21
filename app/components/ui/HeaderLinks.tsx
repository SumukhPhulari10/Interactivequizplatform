"use client";

import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";

export default function HeaderLinks() {
  const { user } = useAuth();
  return (
    <nav className="flex items-center gap-4 text-sm lg:gap-6">
      <Link href="/quizzes" className="transition-colors hover:text-foreground/80 text-foreground/60">Quizzes</Link>
      <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
      {user ? (
        <Link href="/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">Profile</Link>
      ) : (
        <Link href="/signin" className="transition-colors hover:text-foreground/80 text-foreground/60">Sign in</Link>
      )}
    </nav>
  );
}








