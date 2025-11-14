"use client";

export default function EnvDebug() {
  return (
    <pre style={{ padding: 20 }}>
      {JSON.stringify(
        {
          URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "missing",
          ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing",
        },
        null,
        2
      )}
    </pre>
  );
}
