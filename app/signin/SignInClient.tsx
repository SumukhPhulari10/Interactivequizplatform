"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPasswordChecks, isPasswordValid } from "../utils/validators";
import { SiGoogle, SiGithub } from "react-icons/si";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function SignInClient() {
  const supabase = getSupabase();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const passwordValid = useMemo(() => isPasswordValid(password), [password]);
  const checks = useMemo(() => getPasswordChecks(password), [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: username.trim(),
      password: password,
    });

    if (error) {
      setSubmitting(false);
      setError(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    try {
      await supabase.from("activity_log").insert({ user_id: data.user.id, action: "Signed in" });
    } catch {}

    const userRole =
      profile?.role === "teacher"
        ? "teacher"
        : profile?.role === "admin"
        ? "admin"
        : "student";

    setSubmitting(false);

    const dest =
      userRole === "admin"
        ? "/admin"
        : userRole === "teacher"
        ? "/teacher"
        : "/student";

    router.push(dest);
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

          <div className="text-xs text-muted-foreground"> {new Date().getFullYear()} EngiQuiz</div>
        </div>

        <div className="flex items-center justify-center px-5 py-10 md:py-0">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-background/90 dark:bg-black/80 border border-border/30 p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sign in with your email and password.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <label className="block relative pb-3">
                  <span className="text-sm text-muted-foreground">Username or Email</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your username or email"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                </label>

                <label className="block relative pb-2">
                  <span className="text-sm text-muted-foreground">Password</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Start with uppercase, include a number & a symbol"
                    aria-label="Password"
                  />
                  <div className="mt-2">
                    <ul className="text-xs space-y-1">
                      <li className={`${checks.firstUppercase ? "text-emerald-500" : "text-red-500"}`}>• First letter is uppercase</li>
                      <li className={`${checks.hasNumber ? "text-emerald-500" : "text-red-500"}`}>• Contains at least one number</li>
                      <li className={`${checks.hasSymbol ? "text-emerald-500" : "text-red-500"}`}>• Contains at least one symbol</li>
                      <li className={`${checks.minLength ? "text-emerald-500" : "text-red-500"}`}>• Minimum 6 characters</li>
                    </ul>
                  </div>
                  {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
                </label>

                <div className="flex items-center justify-end">
                  <Link href="/signin/forgot" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !passwordValid}
                  className={`group/btn relative w-full mt-1 inline-flex justify-center items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow ${
                    submitting || !passwordValid
                      ? "bg-gradient-to-br from-primary/70 to-primary/50 text-primary-foreground cursor-not-allowed"
                      : "bg-gradient-to-br from-black to-neutral-700 text-white dark:from-zinc-900 dark:to-zinc-900"
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
                    <>Sign in</>
                  )}
                  <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
                </button>
              </form>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border/30" />
                <div className="text-xs text-muted-foreground">or continue with</div>
                <div className="flex-1 h-px bg-border/30" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  className="group/btn relative inline-flex w-full items-center justify-start gap-2 rounded-md border border-border/30 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:text-[#4285F4] transition-colors hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-[#4285F4]"
                  aria-label="Continue with Google"
                >
                  <SiGoogle className="h-4 w-4" aria-hidden />
                  Google
                  <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
                </button>

                <button
                  className="group/btn relative inline-flex w-full items-center justify-start gap-2 rounded-md border border-border/30 bg-gray-50 px-3 py-2 text-sm text-white-700 hover:text-[#4285F4] transition-colors hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-zinc-900 dark:text-zinc-900"
                  aria-label="Continue with GitHub"
                >
                  <SiGithub className="h-4 w-4" aria-hidden />
                  GitHub
                  <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
