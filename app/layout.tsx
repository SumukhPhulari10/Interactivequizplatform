import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
                  <rect width="280" height="270" fill="none"></rect>
                  <path d="M49.2,118.3,24.8,93.9a12,12,0,0,1,17-17l17,17,48-48a12,12,0,0,1,17,0l17,17,48-48a12,12,0,0,1,17,0l17,17,24.4-24.4a12,12,0,0,1,17,17L206.8,93.9l-48,48a12,12,0,0,1-17,0l-17-17-48,48a12,12,0,0,1-17,0l-17-17Z" fill="currentColor"></path>
                  <path d="M108,188H40a12,12,0,0,1-12-12V108.8a12,12,0,0,1,20.4-8.5l17,17a12,12,0,0,0,17,0l17-17a12,12,0,0,1,17,0l17,17a12,12,0,0,0,17,0l17-17a12,12,0,0,1,20.4,8.5V176a12,12,0,0,1-12,12H148a12,12,0,0,1-12-12v-8a12,12,0,0,0-12-12h-4a12,12,0,0,0-12,12v8A12,12,0,0,1,108,188Z" fill="currentColor" opacity="0.5"></path>
                </svg>
                <span className="font-bold">EngiQuiz</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm lg:gap-6">
                <Link href="/quizzes" className="transition-colors hover:text-foreground/80 text-foreground/60">Quizzes</Link>
                <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
                <Link href="/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">Profile</Link>
              </nav>
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
      </body>
    </html>
  );
}
