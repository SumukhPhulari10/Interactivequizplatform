 "use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabaseBrowser";
import {
  achievementRequirements,
  avatarOptions,
  getAvatarOption,
  getUnlockedAchievements,
  isAvatarUnlocked,
} from "@/lib/avatarOptions";

export default function EditProfilePage() {
  const supabase = getSupabase();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarKey, setAvatarKey] = useState<string>(avatarOptions[0].key);
  const [attemptCount, setAttemptCount] = useState(0);
  const [randomizing, setRandomizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (!mounted || !user?.id) return;

        setUserId(user.id);

        const [profileRes, attemptsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, avatar_key")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("attempts")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

        if (!mounted) return;

        setFullName(profileRes.data?.full_name ?? "");
        setAvatarKey(profileRes.data?.avatar_key ?? avatarOptions[0].key);
        setAttemptCount(attemptsRes.count ?? 0);
      } catch (err) {
        console.error("Failed to load profile editor data:", err);
        if (mounted) {
          setError("Unable to load profile data. Please refresh.");
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const unlockedAchievements = useMemo(
    () => getUnlockedAchievements(attemptCount),
    [attemptCount]
  );

  const unlockedAvatarOptions = useMemo(
    () => avatarOptions.filter((option) => isAvatarUnlocked(option, unlockedAchievements)),
    [unlockedAchievements]
  );

  const selectedAvatar = useMemo(() => getAvatarOption(avatarKey), [avatarKey]);

  function handleSelectAvatar(key: string) {
    const option = avatarOptions.find((a) => a.key === key);
    if (!option) return;
    if (!isAvatarUnlocked(option, unlockedAchievements)) return;
    setAvatarKey(option.key);
  }

  function handleRandomizeAvatar() {
    if (!unlockedAvatarOptions.length) return;
    setRandomizing(true);
    const randomOption = unlockedAvatarOptions[Math.floor(Math.random() * unlockedAvatarOptions.length)];
    setAvatarKey(randomOption.key);
    setTimeout(() => setRandomizing(false), 250);
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
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          avatar_key: avatarKey,
        })
        .eq("id", userId)
        .select();

      // If update fails, try to insert (profile doesn't exist)
      if (updateError) {
        console.log("Update failed, trying insert:", updateError);

        // Check if it's a "not found" or RLS error - try insert
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            full_name: fullName.trim() || null,
            avatar_key: avatarKey,
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
      await new Promise((resolve) => setTimeout(resolve, 100));
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

          <form onSubmit={onSave} className="mt-6 space-y-8">
            <section>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">Professional avatar</div>
                  <p className="text-base font-semibold">{selectedAvatar.label}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  disabled={randomizing || unlockedAvatarOptions.length === 0}
                  className="text-sm px-3 py-1.5 rounded-lg border border-white/15 hover:border-white/40 transition disabled:opacity-50"
                >
                  {randomizing ? "Picking..." : "Randomize"}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a badge-style avatar. Unlock premium looks by completing quizzes and milestones.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {avatarOptions.map((option) => {
                  const unlocked = isAvatarUnlocked(option, unlockedAchievements);
                  const isSelected = avatarKey === option.key;
                  const requirementLabel = option.requiredAchievement
                    ? achievementRequirements.find((a) => a.key === option.requiredAchievement)?.label
                    : null;

                  return (
                    <button
                      type="button"
                      key={option.key}
                      onClick={() => handleSelectAvatar(option.key)}
                      disabled={!unlocked}
                      className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition
                        ${isSelected ? "border-white/60 bg-white/10 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.6)]" : "border-white/10 bg-white/5 hover:border-white/30"}
                        ${!unlocked ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5"}
                      `}
                    >
                      <div
                        className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-3xl transition-transform duration-300
                          ${unlocked ? "group-hover:-translate-y-0.5 group-hover:scale-105" : ""}
                        `}
                        aria-hidden
                      >
                        <span className="drop-shadow">{option.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{option.label}</span>
                          {isSelected && <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-white/80">Selected</span>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">{option.description}</p>
                        {requirementLabel && (
                          <p
                            className={`text-[11px] mt-1 ${
                              unlocked ? "text-emerald-400" : "text-muted-foreground"
                            }`}
                          >
                            {unlocked ? "Unlocked via" : "Unlock by"} {requirementLabel}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-white/5 bg-black/10 p-4">
                <h3 className="text-sm font-semibold mb-2">Avatar achievements</h3>
                <div className="space-y-2">
                  {achievementRequirements.map((achievement) => {
                    const unlocked = unlockedAchievements.includes(achievement.key);
                    return (
                      <div
                        key={achievement.key}
                        className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"
                      >
                        <div>
                          <div className="font-medium">{achievement.label}</div>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            unlocked ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50" : "bg-white/10 text-muted-foreground border border-white/10"
                          }`}
                        >
                          {unlocked ? "Unlocked" : `${attemptCount}/${achievement.threshold}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

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
