"use client";

import UserMenu from "@/app/components/auth/UserMenu";

export default function HeaderClient() {
  return (
    <div className="flex items-center gap-3">
      <UserMenu />
    </div>
  );
}

