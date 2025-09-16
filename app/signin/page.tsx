"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/auth/AuthProvider";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const ok = await login(username.trim(), password);
    setSubmitting(false);
    if (ok) {
      router.push("/profile");
    } else {
      setError("Enter username and password");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid md:grid-cols-2 min-h-screen">
        <div className="hidden md:flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-accent/10 to-background">
          <Link href="/" className="flex items-center gap-3 group">
            <svg className="h-10 w-10 text-primary group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div>
              <div className="font-bold text-xl leading-none">EngiQuiz</div>
              <div className="text-xs text-muted-foreground -mt-0.5">Practice · Learn · Master</div>
            </div>
          </Link>

          <div className="max-w-md">
            <h1 className="text-3xl font-extrabold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your progress and compete on leaderboards.</p>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md bg-background/60 p-3 border border-border/30">
                <div>Save attempts & track mastery</div>
                <span className="text-xs text-muted-foreground">Progress</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-background/60 p-3 border border-border/30">
                <div>Branch-based quizzes</div>
                <span className="text-xs text-muted-foreground">Focused</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} EngiQuiz</div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 md:py-0">
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-surface/80 border border-border/30 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">Use your username and password.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Username</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your username"
                    aria-label="Username"
                  />
                </label>

                <label className="block relative">
                  <span className="text-sm text-muted-foreground">Password</span>
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Enter password"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-9 text-xs text-muted-foreground hover:text-foreground"
                    aria-pressed={show}
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                  {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
                </label>

                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={() => setRemember((r) => !r)}
                      className="h-4 w-4 rounded border-border/30 bg-background focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>

                  <Link href="/signin/forgot" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full mt-1 inline-flex justify-center items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow ${
                    submitting ? "bg-primary/60 text-primary-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border/30" />
                <div className="text-xs text-muted-foreground">or continue with</div>
                <div className="flex-1 h-px bg-border/30" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border/30 bg-background px-3 py-2 text-sm hover:shadow-sm"
                  aria-label="Continue with Google"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M21 12.3a9 9 0 10-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Google
                </button>

                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border/30 bg-background px-3 py-2 text-sm hover:shadow-sm"
                  aria-label="Continue with GitHub"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">New here? </span>
                <Link href="/signin/signup" className="text-primary hover:underline">
                  Create an account
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
