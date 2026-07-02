import { describe, expect, it } from "vitest";
import {
  calculateStageScore,
  calculateOverallScore,
  determineLevelFromScore,
  getLevelLabel,
  getLevelColor,
} from "../shared/scoring";

describe("Scoring Logic", () => {
  describe("calculateStageScore", () => {
    it("should return 100 when all answers are correct", () => {
      const score = calculateStageScore(10, 10);
      expect(score).toBe(100);
    });

    it("should return 0 when no answers are correct", () => {
      const score = calculateStageScore(0, 10);
      expect(score).toBe(0);
    });

    it("should calculate percentage correctly", () => {
      const score = calculateStageScore(7, 10);
      expect(score).toBe(70);
    });

    it("should handle partial scores", () => {
      const score = calculateStageScore(3, 5);
      expect(score).toBe(60);
    });

    it("should return 0 for zero total questions", () => {
      const score = calculateStageScore(0, 0);
      expect(score).toBe(0);
    });

    it("should round to 2 decimal places", () => {
      const score = calculateStageScore(1, 3);
      expect(score).toBe(33.33);
    });
  });

  describe("calculateOverallScore", () => {
    it("should average multiple stage scores", () => {
      const scores = [100, 80, 70, 90, 85];
      const overall = calculateOverallScore(scores);
      expect(overall).toBe(85);
    });

    it("should return 0 for empty scores array", () => {
      const overall = calculateOverallScore([]);
      expect(overall).toBe(0);
    });

    it("should handle single score", () => {
      const overall = calculateOverallScore([75]);
      expect(overall).toBe(75);
    });

    it("should round to 2 decimal places", () => {
      const scores = [70, 80, 90];
      const overall = calculateOverallScore(scores);
      expect(overall).toBe(80);
    });

    it("should calculate correct average for uneven scores", () => {
      const scores = [100, 50, 75, 60, 85];
      const overall = calculateOverallScore(scores);
      expect(overall).toBe(74);
    });
  });

  describe("determineLevelFromScore", () => {
    it("should return 'advanced' for score >= 90", () => {
      expect(determineLevelFromScore(90)).toBe("advanced");
      expect(determineLevelFromScore(95)).toBe("advanced");
      expect(determineLevelFromScore(100)).toBe("advanced");
    });

    it("should return 'upper_intermediate' for score 80-89", () => {
      expect(determineLevelFromScore(80)).toBe("upper_intermediate");
      expect(determineLevelFromScore(85)).toBe("upper_intermediate");
      expect(determineLevelFromScore(89)).toBe("upper_intermediate");
    });

    it("should return 'intermediate' for score 70-79", () => {
      expect(determineLevelFromScore(70)).toBe("intermediate");
      expect(determineLevelFromScore(75)).toBe("intermediate");
      expect(determineLevelFromScore(79)).toBe("intermediate");
    });

    it("should return 'elementary' for score 60-69", () => {
      expect(determineLevelFromScore(60)).toBe("elementary");
      expect(determineLevelFromScore(65)).toBe("elementary");
      expect(determineLevelFromScore(69)).toBe("elementary");
    });

    it("should return 'beginner' for score < 60", () => {
      expect(determineLevelFromScore(0)).toBe("beginner");
      expect(determineLevelFromScore(30)).toBe("beginner");
      expect(determineLevelFromScore(59)).toBe("beginner");
    });

    it("should handle boundary values correctly", () => {
      expect(determineLevelFromScore(59.99)).toBe("beginner");
      expect(determineLevelFromScore(60)).toBe("elementary");
      expect(determineLevelFromScore(69.99)).toBe("elementary");
      expect(determineLevelFromScore(70)).toBe("intermediate");
    });
  });

  describe("Integration: Complete Test Scoring", () => {
    it("should score a complete test correctly", () => {
      // Simulate 5 stages with different scores
      const stageScores = [
        calculateStageScore(8, 10), // 80%
        calculateStageScore(9, 10), // 90%
        calculateStageScore(7, 10), // 70%
        calculateStageScore(6, 10), // 60%
        calculateStageScore(10, 10), // 100%
      ];

      const overallScore = calculateOverallScore(stageScores);
      const level = determineLevelFromScore(overallScore);

      expect(stageScores).toEqual([80, 90, 70, 60, 100]);
      expect(overallScore).toBe(80);
      expect(level).toBe("upper_intermediate");
    });

    it("should handle a beginner test", () => {
      const stageScores = [
        calculateStageScore(3, 10), // 30%
        calculateStageScore(4, 10), // 40%
        calculateStageScore(2, 10), // 20%
        calculateStageScore(5, 10), // 50%
        calculateStageScore(4, 10), // 40%
      ];

      const overallScore = calculateOverallScore(stageScores);
      const level = determineLevelFromScore(overallScore);

      expect(overallScore).toBe(36);
      expect(level).toBe("beginner");
    });

    it("should handle an advanced test", () => {
      const stageScores = [
        calculateStageScore(10, 10), // 100%
        calculateStageScore(9, 10), // 90%
        calculateStageScore(10, 10), // 100%
        calculateStageScore(9, 10), // 90%
        calculateStageScore(10, 10), // 100%
      ];

      const overallScore = calculateOverallScore(stageScores);
      const level = determineLevelFromScore(overallScore);

      expect(overallScore).toBe(96);
      expect(level).toBe("advanced");
    });
  });

  describe("Utility Functions", () => {
    it("should get correct level label", () => {
      expect(getLevelLabel("beginner")).toBe("Beginner");
      expect(getLevelLabel("elementary")).toBe("Elementary");
      expect(getLevelLabel("intermediate")).toBe("Intermediate");
      expect(getLevelLabel("upper_intermediate")).toBe("Upper-Intermediate");
      expect(getLevelLabel("advanced")).toBe("Advanced");
    });

    it("should get correct level color", () => {
      expect(getLevelColor("beginner")).toContain("red");
      expect(getLevelColor("elementary")).toContain("orange");
      expect(getLevelColor("intermediate")).toContain("yellow");
      expect(getLevelColor("upper_intermediate")).toContain("blue");
      expect(getLevelColor("advanced")).toContain("green");
    });
  });
});
