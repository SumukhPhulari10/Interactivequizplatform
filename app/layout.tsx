import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ui/ThemeToggle";
import AuthProvider from "./components/auth/AuthProvider";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Quiz Platform",
  description: "An interactive quiz platform for engineering students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setThemeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (theme === 'dark' || (!theme && isSystemDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
                <Link href="/" className="mr-6 group flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-primary shrink-0">
                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-bold relative">
                    <span className="pointer-events-none absolute -inset-2 -z-10 rounded-lg bg-primary/10 blur transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100" />
                    <TextHoverEffect text="EngiQuiz" />
                  </span>
                </Link>

                {/* Inline header links without top "Sign in" */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  {[
                    { href: "/quizzes", label: "Quizzes" },
                    { href: "/branches", label: "Branches" },
                    { href: "/leaderboard", label: "Leaderboard" },
                    { href: "/contribute", label: "Contribute" },
                  ].map((item) => (
                    <div key={item.href} className="relative group">
                      <GlowingEffect spread={40} proximity={64} inactiveZone={0.02} />
                      <Link href={item.href} className="relative z-10 block px-2 py-1 rounded-md text-foreground/60 hover:text-foreground">
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </nav>

                {/* Mobile menu (no JS) */}
                <div className="md:hidden ml-auto">
                  <details>
                    <summary className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-foreground/80">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-sm">Menu</span>
                    </summary>
                    <div className="mt-2 rounded-lg border border-border/30 bg-surface p-3 shadow-sm space-y-2">
                      <Link href="/quizzes" className="block px-3 py-2 rounded-md hover:bg-accent/5">Quizzes</Link>
                      <Link href="/branches" className="block px-3 py-2 rounded-md hover:bg-accent/5">Branches</Link>
                      <Link href="/leaderboard" className="block px-3 py-2 rounded-md hover:bg-accent/5">Leaderboard</Link>
                      <Link href="/contribute" className="block px-3 py-2 rounded-md hover:bg-accent/5">Contribute</Link>
                    </div>
                  </details>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  <ThemeToggle />
                  {/* keep Sign in only in the main header area or signin page; remove top duplicate */}
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="py-6 md:px-8 md:py-0">
              <div className="container mx-auto flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  Built by Sumukh & Omkar for engineering students.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
