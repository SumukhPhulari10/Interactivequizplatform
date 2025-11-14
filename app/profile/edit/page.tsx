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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!mounted || !user?.id) return;

      setUserId(user.id);

      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      setFullName(p?.full_name ?? "");
      setAvatarUrl(p?.avatar_url ?? null);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function onUploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    setError(null);

    try {
      const path = `public/${userId}.png`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const url = pub.publicUrl;

      setAvatarUrl(url);

      // Update avatar (profile should exist from signup)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: url,
        })
        .eq("id", userId);

      // If update fails (profile doesn't exist), try to create it
      if (updateError) {
        console.log("Update failed, trying to create profile:", updateError);
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            avatar_url: url,
            created_at: new Date().toISOString(),
          });
        if (insertError) {
          console.error("Insert error:", insertError);
          const errorMsg = insertError.message || insertError.code || insertError.hint || JSON.stringify(insertError);
          throw new Error(`Failed to save avatar: ${errorMsg}`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "Unexpected error";
      setError(String(msg));
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setError("User not found. Please sign in again.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Try to update first (most common case)
      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          avatar_url: avatarUrl || null,
        })
        .eq("id", userId)
        .select();

      // If update fails, try to insert (profile doesn't exist)
      if (updateError) {
        console.log("Update failed, trying insert:", updateError);
        
        // Check if it's a "not found" or RLS error - try insert
        const { data: insertData, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: fullName.trim() || null,
            avatar_url: avatarUrl || null,
            created_at: new Date().toISOString(),
          })
          .select();

        if (insertError) {
          console.error("Both update and insert failed:", { updateError, insertError });
          const errorMsg = insertError.message || insertError.code || insertError.hint || JSON.stringify(insertError);
          throw new Error(`Failed to save profile: ${errorMsg}`);
        }
      }

      // Log activity (ignore errors if table doesn't exist)
      try {
        await supabase
          .from("activity_log")
          .insert({ user_id: userId, action: "Profile updated" });
      } catch {
        // Ignore errors for activity log
      }

      // Force refresh and navigate
      router.refresh();
      // Small delay to ensure data is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push("/profile");
    } catch (err: unknown) {
      console.error("Save error:", err);
      let errorMessage = "An unexpected error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <h1 className="text-2xl font-bold">Edit Profile</h1>

          <form onSubmit={onSave} className="mt-6 space-y-6">
            <div className="flex items-center gap-5">
              <div className="relative h-24 w-24 rounded-full overflow-hidden border border-white/20">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No avatar
                  </div>
                )}
              </div>

              <label className="text-sm flex flex-col">
                <span className="mb-2 text-muted-foreground">Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={onUploadAvatar}
                  className="file:px-3 file:py-2 file:bg-white/10 file:border file:border-white/20 rounded-md text-sm"
                />
              </label>
            </div>

            <label className="block">
              <div className="text-sm mb-1">Full name</div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10"
                placeholder="Your name"
              />
            </label>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-4 py-2 rounded-xl border border-white/10"
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
