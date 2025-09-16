export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div role="status" className="flex flex-col items-center gap-4">
        {/* Rotating ring + solid arc for contrast */}
        <div className="relative">
          <svg
            className="animate-spin h-16 w-16 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          {/* subtle pulse ring behind the spinner */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="block h-20 w-20 rounded-full border border-border/20 animate-pulse" />
          </span>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium">Loading</div>
          <div className="mt-1 text-xs text-muted-foreground">Preparing your dashboard…</div>
        </div>
      </div>
    </div>
  );
}


