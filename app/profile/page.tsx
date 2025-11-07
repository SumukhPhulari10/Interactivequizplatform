"use client";

import React from "react";
import Link from "next/link";
export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md text-center rounded-lg border border-border/30 bg-surface p-6">
        <h2 className="text-lg font-semibold">Not signed in</h2>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to view your profile and progress.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/signin" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Sign in</Link>
          <Link href="/" className="px-4 py-2 rounded-md border border-border/30">Home</Link>
        </div>
      </div>
    </div>
  );
}
