"use client";

import Link from "next/link";

export default function UserMenu() {
  return (
    <Link href="/signin" className="px-3 py-2 rounded-md border border-input text-sm">
      Sign in
    </Link>
  );
}


