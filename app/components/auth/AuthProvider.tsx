"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Role = "student" | "teacher" | "admin";
type User = { name: string; role: Role };
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: Role) => Promise<boolean>;
  guestLogin: (role: Role) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only access localStorage after component is mounted on client
  useEffect(() => {
    if (isClient) {
      try {
        const raw = localStorage.getItem("authUser");
        if (raw) setUser(JSON.parse(raw));
      } catch {}
    }
  }, [isClient]);

  async function login(username: string, password: string, role: Role) {
    if (!username || !password) return false;
    const u: User = { name: username, role };
    setUser(u);
    if (isClient) {
      try {
        localStorage.setItem("authUser", JSON.stringify(u));
      } catch {}
    }
    return true;
  }

  async function guestLogin(role: Role) {
    const u: User = { name: "Guest", role };
    setUser(u);
    if (isClient) {
      try {
        localStorage.setItem("authUser", JSON.stringify(u));
      } catch {}
    }
    return true;
  }

  function logout() {
    setUser(null);
    if (isClient) {
      try {
        localStorage.removeItem("authUser");
      } catch {}
    }
  }

  function hasRole(roles: Role | Role[]) {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  }

  return <AuthContext.Provider value={{ user, login, guestLogin, logout, hasRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}












