import { describe, expect, it } from "vitest";
import { checkNewBadges, getBadgeInfo, BADGES } from "../shared/achievements";

describe("achievements system", () => {
  it("should detect 90% accuracy badge", () => {
    const stats = {
      accuracy: 90,
      totalQuizzes: 1,
      bestLevel: "A1",
      averageResponseTime: 5,
      totalTimeSpent: 50,
    };
    const newBadges = checkNewBadges(stats, []);
    expect(newBadges).toContain("accuracy_90");
  });

  it("should detect 100% accuracy badge", () => {
    const stats = {
      accuracy: 100,
      totalQuizzes: 1,
      bestLevel: "A1",
      averageResponseTime: 5,
      totalTimeSpent: 50,
    };
    const newBadges = checkNewBadges(stats, []);
    expect(newBadges).toContain("accuracy_100");
  });

  it("should detect speed master badge", () => {
    const stats = {
      accuracy: 85,
      totalQuizzes: 1,
      bestLevel: "A1",
      averageResponseTime: 2,
      totalTimeSpent: 20,
    };
    const newBadges = checkNewBadges(stats, []);
    expect(newBadges).toContain("speed_master");
  });

  it("should detect quiz enthusiast badge", () => {
    const stats = {
      accuracy: 80,
      totalQuizzes: 10,
      bestLevel: "B1",
      averageResponseTime: 5,
      totalTimeSpent: 500,
    };
    const newBadges = checkNewBadges(stats, []);
    expect(newBadges).toContain("quiz_enthusiast");
  });

  it("should not duplicate badges", () => {
    const stats = {
      accuracy: 95,
      totalQuizzes: 1,
      bestLevel: "A1",
      averageResponseTime: 5,
      totalTimeSpent: 50,
    };
    const existingBadges = ["accuracy_90"];
    const newBadges = checkNewBadges(stats, existingBadges);
    expect(newBadges).not.toContain("accuracy_90");
  });

  it("should get badge info correctly", () => {
    const badge = getBadgeInfo("accuracy_90");
    expect(badge).toBeDefined();
    expect(badge?.name).toBe("90% Accuracy");
    expect(badge?.type).toBe("accuracy_90");
  });

  it("should return undefined for unknown badge", () => {
    const badge = getBadgeInfo("unknown_badge");
    expect(badge).toBeUndefined();
  });
});
