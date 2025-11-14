"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPasswordChecks, isPasswordValid } from "../utils/validators";
import { SiGoogle, SiGithub } from "react-icons/si";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function SignUpClient() {
  const supabase = getSupabase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("Electrical");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ name: boolean; email: boolean; password: boolean }>({ name: false, email: false, password: false });
  const router = useRouter();

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const passwordValid = useMemo(() => isPasswordValid(password), [password]);
  const checks = useMemo(() => getPasswordChecks(password), [password]);
  const formValid = emailValid && nameValid && passwordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    if (!formValid) return;
    setSubmitting(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim(),
            role: role,
            branch: branch,
          },
        },
      });

      if (signUpError) {
        alert(signUpError.message);
        return;
      }

      // Create profile record with role
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: signUpData.user.id,
            full_name: name.trim(),
            role: role,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Try to get the error message
          const errorMsg = profileError.message || profileError.code || JSON.stringify(profileError);
          alert(`Account created but profile setup failed: ${errorMsg}. Please contact support.`);
        } else {
          console.log("Profile created successfully for user:", signUpData.user.id);
        }
      }

      alert("Account created! Check your email to verify.");
      router.push("/signin");
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
            <div className="rounded-2xl bg-background/90 dark:bg-black/80 border border-border/30 p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-semibold">Sign up</h2>
              <p className="mt-1 text-sm text-muted-foreground">Create a new account to get started.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <label className="block relative pb-3">
                  <span className="text-sm text-muted-foreground">Full name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className={`peer mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 ${
                      touched.name && !nameValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="Alex Johnson"
                    aria-label="Full name"
                    aria-invalid={touched.name && !nameValid}
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                  {touched.name && !nameValid && (
                    <div className="mt-1 text-xs text-red-500">Enter your name.</div>
                  )}
                </label>

                <label className="block relative pb-2">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className={`peer mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 ${
                      touched.email && !emailValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="you@example.edu"
                    aria-label="Email"
                    aria-invalid={touched.email && !emailValid}
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 translate-y-2 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                  {touched.email && !emailValid && (
                    <div className="mt-1 text-xs text-red-500">Enter a valid email.</div>
                  )}
                </label>

                <label className="block relative pb-2">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Role"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 translate-y-2 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                </label>

                <label className="block relative pb-2">
                  <span className="text-sm text-muted-foreground">Branch</span>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="mt-2 w-full rounded-md border border-border/30 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="Branch"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Computer">Computer</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Materials">Materials</option>
                  </select>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 translate-y-2 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                </label>

                <label className="block relative pb-2">
                  <span className="text-sm text-muted-foreground">Password</span>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`peer mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 ${
                      touched.password && !passwordValid ? "border-red-500/60 focus:ring-red-500/30" : "border-border/30 focus:ring-primary/30"
                    }`}
                    placeholder="Start with uppercase, include a number & a symbol"
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
                    {show ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c2.5-5 7-7.5 9.75-7.5S19.5 7 21.75 12c-1.02 2.27-2.63 4.04-4.53 5.23" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c2.5-5 7-7.5 9.75-7.5S19.5 7 21.75 12c-2.25 5-6.75 7.5-9.75 7.5S4.75 17 2.25 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 peer-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 bottom-0 translate-y-2 mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 peer-focus-visible:opacity-100" />
                  <div className="mt-2">
                    <ul className="text-xs space-y-1">
                      <li className={`${checks.firstUppercase ? "text-emerald-500" : "text-red-500"}`}>• First letter is uppercase</li>
                      <li className={`${checks.hasNumber ? "text-emerald-500" : "text-red-500"}`}>• Contains at least one number</li>
                      <li className={`${checks.hasSymbol ? "text-emerald-500" : "text-red-500"}`}>• Contains at least one symbol</li>
                      <li className={`${checks.minLength ? "text-emerald-500" : "text-red-500"}`}>• Minimum 6 characters</li>
                    </ul>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitting || !formValid}
                  className={`group/btn relative w-full mt-1 inline-flex justify-center items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow ${
                    submitting || !formValid
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
                      Creating account...
                    </>
                  ) : (
                    <>Create account</>
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
                  className="group/btn relative inline-flex w-full items-center justify-start gap-2 rounded-md border border-border/30 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:text-[#4285F4] transition-colors hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-[#4285F4]"
                  aria-label="Continue with GitHub"
                >
                  <SiGithub className="h-4 w-4" aria-hidden />
                  GitHub
                  <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
