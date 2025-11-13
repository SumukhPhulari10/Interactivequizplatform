"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseBrowser";

export default function EditProfilePage() {
  const supabase = getSupabase();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (!active || !u?.id) return;
      setUserId(u.id);
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("id", u.id)
        .maybeSingle();
      setFullName(p?.full_name ?? "");
      setRole(p?.role ?? "");
      setAvatarUrl(p?.avatar_url ?? null);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    setError(null);
    try {
      // Please create a storage bucket named 'avatars' in Supabase Dashboard.
      const path = `public/${userId}.png`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = pub.publicUrl;
      setAvatarUrl(url);
      // Immediately persist avatar_url in profiles
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await supabase
        .from("profiles")
        .update({ full_name: fullName || null, role: role || null, avatar_url: avatarUrl || null })
        .eq("id", userId);
      await supabase.from("activity_log").insert({ user_id: userId, action: "Profile updated" });
      router.push("/profile");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 text-foreground px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]">
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>

          <form onSubmit={onSave} className="mt-6 space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/30 to-blue-500/30 p-[2px]">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 blur-md" aria-hidden />
                <div className="relative h-full w-full rounded-full overflow-hidden border border-white/20">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="avatar" width={96} height={96} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No avatar</div>
                  )}
                </div>
              </div>
              <label className="text-sm inline-flex flex-col">
                <span className="mb-2 text-muted-foreground">Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUploadAvatar}
                  disabled={uploading}
                  className="block text-sm file:mr-3 file:rounded-md file:border file:border-white/20 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-foreground hover:file:bg-white/20 transition"
                />
              </label>
            </div>

            <label className="block">
              <div className="text-sm mb-1">Full name</div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="Your name"
              />
            </label>

            <label className="block">
              <div className="text-sm mb-1">Role / Branch</div>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur outline-none focus:ring-2 focus:ring-purple-500/40"
                placeholder="e.g. student, teacher or branch"
              />
            </label>

            {error && <div className="text-sm text-destructive">{error}</div>}

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={saving}
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm shadow hover:opacity-95 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
