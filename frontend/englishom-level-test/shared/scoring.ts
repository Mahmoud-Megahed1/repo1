/**
 * Scoring and CEFR Level Calculation Utilities
 */

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface StageSummary {
  stage: number;
  stageName: string;
  correct: number;
  total: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
}

export interface TestScoreResult {
  totalScore: number; // 0-100
  cefrLevel: CEFRLevel;
  stageScores: {
    vocabulary: number;
    grammar: number;
    reading: number;
    listening: number;
    writing: number;
  };
  summary: StageSummary[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * Calculate CEFR level based on total score
 * A1: 0-20
 * A2: 21-40
 * B1: 41-60
 * B2: 61-75
 * C1: 76-90
 * C2: 91-100
 */
export function calculateCEFRLevel(totalScore: number): CEFRLevel {
  if (totalScore <= 20) return "A1";
  if (totalScore <= 40) return "A2";
  if (totalScore <= 60) return "B1";
  if (totalScore <= 75) return "B2";
  if (totalScore <= 90) return "C1";
  return "C2";
}

/**
 * Get CEFR level description in English
 */
export function getCEFRDescription(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    A1: "Beginner - Elementary proficiency",
    A2: "Elementary - Limited working proficiency",
    B1: "Intermediate - Working proficiency",
    B2: "Upper Intermediate - Professional working proficiency",
    C1: "Advanced - Full professional proficiency",
    C2: "Mastery - Native or bilingual proficiency",
  };
  return descriptions[level];
}

/**
 * Get CEFR level description in Arabic
 */
export function getCEFRDescriptionAr(level: CEFRLevel): string {
  const descriptions: Record<CEFRLevel, string> = {
    A1: "مبتدئ - كفاءة أساسية",
    A2: "ابتدائي - كفاءة عملية محدودة",
    B1: "متوسط - كفاءة عملية",
    B2: "متوسط متقدم - كفاءة عملية احترافية",
    C1: "متقدم - كفاءة احترافية كاملة",
    C2: "إتقان - كفاءة أصلية أو ثنائية اللغة",
  };
  return descriptions[level];
}

/**
 * Generate personalized recommendations based on score and weaknesses
 */
export function generateRecommendations(
  totalScore: number,
  weaknesses: string[]
): string[] {
  const recommendations: string[] = [];

  if (totalScore < 30) {
    recommendations.push(
      "Start with foundational vocabulary and basic grammar exercises"
    );
    recommendations.push("Practice daily for at least 30 minutes");
    recommendations.push("Focus on common phrases and everyday conversations");
  } else if (totalScore < 50) {
    recommendations.push("Strengthen your grammar understanding");
    recommendations.push("Increase listening practice with native speakers");
    recommendations.push("Work on sentence construction and word order");
  } else if (totalScore < 70) {
    recommendations.push("Practice reading comprehension with authentic materials");
    recommendations.push("Improve pronunciation and speaking fluency");
    recommendations.push("Learn more advanced vocabulary and idioms");
  } else if (totalScore < 85) {
    recommendations.push("Focus on professional and academic English");
    recommendations.push("Practice writing essays and formal communications");
    recommendations.push("Engage with complex texts and discussions");
  } else {
    recommendations.push("Maintain your level with regular practice");
    recommendations.push("Explore specialized vocabulary in your field of interest");
    recommendations.push("Challenge yourself with native-level content");
  }

  // Add specific recommendations based on weaknesses
  if (weaknesses.includes("vocabulary")) {
    recommendations.push("Expand your vocabulary through reading and flashcards");
  }
  if (weaknesses.includes("grammar")) {
    recommendations.push("Review grammar rules and practice with exercises");
  }
  if (weaknesses.includes("listening")) {
    recommendations.push("Listen to podcasts, movies, and music in English");
  }
  if (weaknesses.includes("reading")) {
    recommendations.push("Read books, articles, and news in English regularly");
  }
  if (weaknesses.includes("writing")) {
    recommendations.push("Practice writing journals, emails, and essays");
  }

  return recommendations;
}

/**
 * Analyze stage performance and identify strengths/weaknesses
 */
export function analyzeStagePerformance(
  stageScores: Record<string, number>
): { strengths: string[]; weaknesses: string[] } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const threshold = 70; // 70% is considered good

  Object.entries(stageScores).forEach(([stage, score]) => {
    if (score >= threshold) {
      strengths.push(stage);
    } else {
      weaknesses.push(stage);
    }
  });

  return { strengths, weaknesses };
}

/**
 * Calculate progress bar color based on score
 * Gray (0-25) -> Bronze (26-50) -> Silver (51-75) -> Gold (76-100)
 */
export function getProgressColor(score: number): string {
  if (score <= 25) return "#888888"; // Gray
  if (score <= 50) return "#CD7F32"; // Bronze
  if (score <= 75) return "#C0C0C0"; // Silver
  return "#FFD700"; // Gold
}

/**
 * Get progress stage label
 */
export function getProgressStageLabel(score: number): string {
  if (score <= 25) return "Getting Started";
  if (score <= 50) return "Building Foundation";
  if (score <= 75) return "Making Progress";
  return "Excellent Progress";
}
