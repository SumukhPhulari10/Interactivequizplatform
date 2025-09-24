"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { name: string };
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  async function login(username: string, password: string) {
    if (!username || !password) return false;
    const u = { name: username };
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

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}












