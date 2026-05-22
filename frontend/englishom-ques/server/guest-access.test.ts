import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createGuestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Guest Access - Public Procedures", () => {
  describe("submitTestResult - Guest Access", () => {
    it("should accept guest submissions without user context", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.quiz.submitTestResult({
        level: "A1",
        totalQuestions: 3,
        correctAnswers: 2,
        accuracy: 66.67,
        averageResponseTime: 5,
        totalTimeSpent: 15,
      });

      expect(result).toEqual({ success: true, newBadges: [] });
    });

    it("should return success for guest without database operations", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      // Should not throw and should return success
      const result = await caller.quiz.submitTestResult({
        level: "B1",
        totalQuestions: 5,
        correctAnswers: 4,
        accuracy: 80,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("getUserProgress - Guest Access", () => {
    it("should return empty progress for guest users", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      const progress = await caller.quiz.getUserProgress();

      expect(progress).toEqual({
        totalQuizzesTaken: 0,
        totalCorrectAnswers: 0,
        totalQuestionsAnswered: 0,
        averageAccuracy: 0,
        bestLevel: null,
        bestAccuracy: 0,
        totalTimeSpent: 0,
      });
    });
  });

  describe("getUserAchievements - Guest Access", () => {
    it("should return empty achievements for guest users", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      const achievements = await caller.quiz.getUserAchievements();

      expect(achievements).toEqual([]);
    });
  });

  describe("getQuizHistory - Guest Access", () => {
    it("should return empty history for guest users", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      const history = await caller.quiz.getQuizHistory({ limit: 10 });

      expect(history).toEqual([]);
    });
  });

  describe("getQuestionsByLevel - Public Access", () => {
    it("should allow guest access to questions", async () => {
      const ctx = createGuestContext();
      const caller = appRouter.createCaller(ctx);

      // This should not throw an auth error - questions are public
      try {
        await caller.quiz.getQuestionsByLevel({ level: "A1", limit: 5 });
      } catch (error: any) {
        // Database error is expected since we're testing, but auth should not be the issue
        expect(error.code).not.toBe("UNAUTHORIZED");
      }
    });
  });
});
