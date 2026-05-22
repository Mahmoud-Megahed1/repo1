/**
 * Timing configuration for different difficulty levels
 * These are default times per question for each level
 */
export const TIMING_BY_LEVEL = {
  A1: 15, // Beginner - more time
  A2: 12,
  B1: 10,
  B2: 8,
  C1: 6,
  C2: 5, // Advanced - less time
} as const;

export type Level = keyof typeof TIMING_BY_LEVEL;

/**
 * Get the default time for a given level
 */
export function getDefaultTimeForLevel(level: Level): number {
  return TIMING_BY_LEVEL[level];
}

/**
 * Calculate total quiz time based on number of questions and their individual times
 */
export function calculateTotalTime(questionTimes: number[]): number {
  return questionTimes.reduce((sum, time) => sum + time, 0);
}

/**
 * Format seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
