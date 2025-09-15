"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; password: boolean }>({ name: false, email: false, password: false });

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const passwordValid = useMemo(() => password.length >= 6, [password]);
  const formValid = emailValid && nameValid && passwordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!formValid) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      console.log({ name, email, password });
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-extrabold">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Start practicing targeted quizzes and track your progress.</p>

            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-md bg-background/60 p-3 border border-border/30">
                <div>Access all branch topics</div>
                <span className="text-xs text-muted-foreground">Explore</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-background/60 p-3 border border-border/30">
                <div>Save results and streaks</div>
                <span className="text-xs text-muted-foreground">Motivation</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} EngiQuiz</div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 md:py-0">
          <div className="w-full max-w-md">
            <div className="rounded-xl bg-surface/80 border border-border/30 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold">Sign up</h2>
              <p className="mt-1 text-sm text-muted-foreground">Create a new account to get started.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <label className="block">
                  <span className="text-sm text-muted-foreground">Full name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className={`mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                      touched.name && !nameValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="Alex Johnson"
                    aria-label="Full name"
                    aria-invalid={touched.name && !nameValid}
                  />
                  {touched.name && !nameValid && (
                    <div className="mt-1 text-xs text-red-500">Enter your name.</div>
                  )}
                </label>

                <label className="block">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={`mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                      touched.email && !emailValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="you@example.edu"
                    aria-label="Email"
                    aria-invalid={touched.email && !emailValid}
                  />
                  {touched.email && !emailValid && (
                    <div className="mt-1 text-xs text-red-500">Enter a valid email.</div>
                  )}
                </label>

                <label className="block relative">
                  <span className="text-sm text-muted-foreground">Password</span>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                      touched.password && !passwordValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="Minimum 6 characters"
                    aria-label="Password"
                    aria-invalid={touched.password && !passwordValid}
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
                  {touched.password && !passwordValid && (
                    <div className="mt-1 text-xs text-red-500">Password must be at least 6 characters.</div>
                  )}
                </label>

                <button
                  type="submit"
                  disabled={submitting || !formValid}
                  className={`w-full mt-1 inline-flex justify-center items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow ${
                    submitting || !formValid
                      ? "bg-primary/60 text-primary-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
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
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
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
