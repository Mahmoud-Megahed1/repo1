/**
 * Achievements/Badges system
 */

export interface Badge {
  type: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  accuracy: number;
  totalQuizzes: number;
  bestLevel: string;
  averageResponseTime: number;
  totalTimeSpent: number;
}

export const BADGES: Record<string, Badge> = {
  // Accuracy Badges
  accuracy_90: {
    type: "accuracy_90",
    name: "90% Accuracy",
    description: "Achieve 90% or higher accuracy in a quiz",
    icon: "🎯",
    condition: (stats) => stats.accuracy >= 90,
  },
  accuracy_100: {
    type: "accuracy_100",
    name: "Perfect Score",
    description: "Achieve 100% accuracy in a quiz",
    icon: "⭐",
    condition: (stats) => stats.accuracy === 100,
  },

  // Speed Badges
  speed_master: {
    type: "speed_master",
    name: "Speed Master",
    description: "Average response time under 3 seconds",
    icon: "⚡",
    condition: (stats) => stats.averageResponseTime < 3,
  },

  // Level Mastery Badges
  level_master_a1: {
    type: "level_master_a1",
    name: "A1 Master",
    description: "Complete 5 quizzes at A1 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "A1" && stats.accuracy >= 80,
  },
  level_master_a2: {
    type: "level_master_a2",
    name: "A2 Master",
    description: "Complete 5 quizzes at A2 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "A2" && stats.accuracy >= 80,
  },
  level_master_b1: {
    type: "level_master_b1",
    name: "B1 Master",
    description: "Complete 5 quizzes at B1 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "B1" && stats.accuracy >= 80,
  },
  level_master_b2: {
    type: "level_master_b2",
    name: "B2 Master",
    description: "Complete 5 quizzes at B2 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "B2" && stats.accuracy >= 80,
  },
  level_master_c1: {
    type: "level_master_c1",
    name: "C1 Master",
    description: "Complete 5 quizzes at C1 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "C1" && stats.accuracy >= 80,
  },
  level_master_c2: {
    type: "level_master_c2",
    name: "C2 Master",
    description: "Complete 5 quizzes at C2 level with 80%+ accuracy",
    icon: "🏆",
    condition: (stats) => stats.bestLevel === "C2" && stats.accuracy >= 80,
  },

  // Dedication Badges
  quiz_enthusiast: {
    type: "quiz_enthusiast",
    name: "Quiz Enthusiast",
    description: "Complete 10 quizzes",
    icon: "🎓",
    condition: (stats) => stats.totalQuizzes >= 10,
  },
  quiz_addict: {
    type: "quiz_addict",
    name: "Quiz Addict",
    description: "Complete 50 quizzes",
    icon: "🔥",
    condition: (stats) => stats.totalQuizzes >= 50,
  },
};

export function checkNewBadges(
  userStats: UserStats,
  existingBadges: string[]
): string[] {
  const newBadges: string[] = [];

  for (const [badgeKey, badge] of Object.entries(BADGES)) {
    if (!existingBadges.includes(badge.type) && badge.condition(userStats)) {
      newBadges.push(badge.type);
    }
  }

  return newBadges;
}

export function getBadgeInfo(badgeType: string): Badge | undefined {
  return BADGES[badgeType];
}
