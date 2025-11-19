export type AchievementKey = "firstQuiz" | "quizEnthusiast" | "quizChampion";

export type AchievementRequirement = {
  key: AchievementKey;
  label: string;
  description: string;
  threshold: number; // number of quizzes completed
};

export const achievementRequirements: AchievementRequirement[] = [
  {
    key: "firstQuiz",
    label: "First Quiz",
    description: "Complete 1 quiz",
    threshold: 1,
  },
  {
    key: "quizEnthusiast",
    label: "Quiz Enthusiast",
    description: "Complete 5 quizzes",
    threshold: 5,
  },
  {
    key: "quizChampion",
    label: "Quiz Champion",
    description: "Complete 15 quizzes",
    threshold: 15,
  },
];

export type AvatarOption = {
  key: string;
  label: string;
  emoji: string;
  gradient: string;
  description: string;
  requiredAchievement?: AchievementKey;
};

export const avatarOptions: AvatarOption[] = [
  {
    key: "spark",
    label: "Spark",
    emoji: "⚡",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    description: "Default avatar full of energy.",
  },
  {
    key: "rocket",
    label: "Rocket",
    emoji: "🚀",
    gradient: "from-violet-500 via-purple-500 to-pink-500",
    description: "Launch into learning orbit.",
    requiredAchievement: "firstQuiz",
  },
  {
    key: "flame",
    label: "Phoenix",
    emoji: "🔥",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    description: "Rise with a blazing streak.",
    requiredAchievement: "quizEnthusiast",
  },
  {
    key: "atom",
    label: "Quantum",
    emoji: "⚛️",
    gradient: "from-sky-500 via-cyan-400 to-emerald-400",
    description: "For curious minds who go deeper.",
    requiredAchievement: "quizEnthusiast",
  },
  {
    key: "trophy",
    label: "Champion",
    emoji: "🏆",
    gradient: "from-yellow-400 via-amber-500 to-emerald-500",
    description: "Reserved for quiz champions.",
    requiredAchievement: "quizChampion",
  },
];

export function getAvatarOption(key?: string | null): AvatarOption {
  if (!key) return avatarOptions[0];
  return avatarOptions.find((option) => option.key === key) ?? avatarOptions[0];
}

export function getUnlockedAchievements(attemptCount: number): AchievementKey[] {
  return achievementRequirements
    .filter((achievement) => attemptCount >= achievement.threshold)
    .map((achievement) => achievement.key);
}

export function isAvatarUnlocked(option: AvatarOption, unlockedAchievements: AchievementKey[]) {
  if (!option.requiredAchievement) return true;
  return unlockedAchievements.includes(option.requiredAchievement);
}


