// app/not-found.tsx

export const dynamic = "force-dynamic"; // 🔥 prevents build-time errors

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground px-6 py-16">
      <main className="w-full max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-muted-foreground mb-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold">Page not found</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Go to Home
          </Link>

          <Link
            href="/quizzes"
            className="px-4 py-2 rounded-md border border-input text-sm"
          >
            Browse Quizzes
          </Link>
        </div>
      </main>
    </div>
  );
}
