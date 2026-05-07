import { describe, expect, it } from "vitest";
import { calculateCEFRLevel, analyzeStagePerformance, generateRecommendations } from "../shared/scoring";

describe("Scoring System", () => {
  describe("calculateCEFRLevel", () => {
    it("should return A1 for scores 0-20", () => {
      expect(calculateCEFRLevel(0)).toBe("A1");
      expect(calculateCEFRLevel(10)).toBe("A1");
      expect(calculateCEFRLevel(20)).toBe("A1");
    });

    it("should return A2 for scores 21-40", () => {
      expect(calculateCEFRLevel(21)).toBe("A2");
      expect(calculateCEFRLevel(30)).toBe("A2");
      expect(calculateCEFRLevel(40)).toBe("A2");
    });

    it("should return B1 for scores 41-60", () => {
      expect(calculateCEFRLevel(41)).toBe("B1");
      expect(calculateCEFRLevel(50)).toBe("B1");
      expect(calculateCEFRLevel(60)).toBe("B1");
    });

    it("should return B2 for scores 61-75", () => {
      expect(calculateCEFRLevel(61)).toBe("B2");
      expect(calculateCEFRLevel(70)).toBe("B2");
      expect(calculateCEFRLevel(75)).toBe("B2");
    });

    it("should return C1 for scores 76-90", () => {
      expect(calculateCEFRLevel(76)).toBe("C1");
      expect(calculateCEFRLevel(82)).toBe("C1");
      expect(calculateCEFRLevel(90)).toBe("C1");
    });

    it("should return C2 for scores 91-100", () => {
      expect(calculateCEFRLevel(91)).toBe("C2");
      expect(calculateCEFRLevel(95)).toBe("C2");
      expect(calculateCEFRLevel(100)).toBe("C2");
    });
  });

  describe("analyzeStagePerformance", () => {
    it("should identify strengths and weaknesses correctly", () => {
      const stageScores = {
        vocabulary: 80,
        grammar: 60,
        reading: 75,
        listening: 65,
        writing: 55,
      };
      const result = analyzeStagePerformance(stageScores);
      expect(result.strengths).toContain("vocabulary");
      expect(result.strengths).toContain("reading");
      expect(result.weaknesses).toContain("grammar");
      expect(result.weaknesses).toContain("listening");
      expect(result.weaknesses).toContain("writing");
    });

    it("should handle all high scores", () => {
      const stageScores = {
        vocabulary: 85,
        grammar: 90,
        reading: 88,
      };
      const result = analyzeStagePerformance(stageScores);
      expect(result.strengths.length).toBe(3);
      expect(result.weaknesses.length).toBe(0);
    });

    it("should handle all low scores", () => {
      const stageScores = {
        vocabulary: 50,
        grammar: 60,
        reading: 55,
      };
      const result = analyzeStagePerformance(stageScores);
      expect(result.strengths.length).toBe(0);
      expect(result.weaknesses.length).toBe(3);
    });
  });

  describe("generateRecommendations", () => {
    it("should generate recommendations for low scores", () => {
      const recommendations = generateRecommendations(25, ["vocabulary", "grammar"]);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some((r) => r.includes("vocabulary"))).toBe(true);
    });

    it("should generate recommendations for high scores", () => {
      const recommendations = generateRecommendations(90, []);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some((r) => r.includes("Maintain"))).toBe(true);
    });

    it("should generate recommendations for medium scores", () => {
      const recommendations = generateRecommendations(50, ["listening"]);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some((r) => r.includes("Improve") || r.includes("Practice"))).toBe(true);
    });
  });
});
