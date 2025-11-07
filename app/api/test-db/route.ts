import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabaseServer"

export async function GET() {
  const supabase = createServerSupabase()
  const { data, error } = await supabase.from("profiles").select("*").limit(1)
  return NextResponse.json({ ok: !error, error: error?.message ?? null, count: data?.length ?? 0 })
}
