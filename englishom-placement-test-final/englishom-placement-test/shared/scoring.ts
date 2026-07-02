/**
 * Shared scoring utilities used by both frontend and backend
 * These functions are used to calculate test scores and determine proficiency levels
 */

export type ProficiencyLevel = "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced";

/**
 * Calculate score for a single stage
 * @param correctAnswers - Number of correct answers
 * @param totalQuestions - Total number of questions in the stage
 * @returns Score as percentage (0-100)
 */
export function calculateStageScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Number(((correctAnswers / totalQuestions) * 100).toFixed(2));
}

/**
 * Calculate overall test score from stage scores
 * @param stageScores - Array of scores from each stage
 * @returns Overall score as percentage (0-100)
 */
export function calculateOverallScore(stageScores: number[]): number {
  if (stageScores.length === 0) return 0;
  const sum = stageScores.reduce((a, b) => a + b, 0);
  return Number((sum / stageScores.length).toFixed(2));
}

/**
 * Determine proficiency level based on overall score
 * @param score - Overall test score (0-100)
 * @returns Proficiency level
 */
export function determineLevelFromScore(score: number): ProficiencyLevel {
  if (score >= 90) return "advanced";
  if (score >= 80) return "upper_intermediate";
  if (score >= 70) return "intermediate";
  if (score >= 60) return "elementary";
  return "beginner";
}

/**
 * Get score range for a proficiency level
 * @param level - Proficiency level
 * @returns Object with min and max scores
 */
export function getScoreRangeForLevel(level: ProficiencyLevel): { min: number; max: number } {
  const ranges: Record<ProficiencyLevel, { min: number; max: number }> = {
    beginner: { min: 0, max: 59 },
    elementary: { min: 60, max: 69 },
    intermediate: { min: 70, max: 79 },
    upper_intermediate: { min: 80, max: 89 },
    advanced: { min: 90, max: 100 },
  };
  return ranges[level];
}

/**
 * Get human-readable label for a proficiency level
 * @param level - Proficiency level
 * @returns Human-readable label
 */
export function getLevelLabel(level: ProficiencyLevel): string {
  const labels: Record<ProficiencyLevel, string> = {
    beginner: "Beginner",
    elementary: "Elementary",
    intermediate: "Intermediate",
    upper_intermediate: "Upper-Intermediate",
    advanced: "Advanced",
  };
  return labels[level];
}

/**
 * Get color code for a proficiency level (for UI)
 * @param level - Proficiency level
 * @returns CSS color class
 */
export function getLevelColor(level: ProficiencyLevel): string {
  const colors: Record<ProficiencyLevel, string> = {
    beginner: "bg-red-100 text-red-800 border-red-300",
    elementary: "bg-orange-100 text-orange-800 border-orange-300",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-300",
    upper_intermediate: "bg-blue-100 text-blue-800 border-blue-300",
    advanced: "bg-green-100 text-green-800 border-green-300",
  };
  return colors[level];
}
