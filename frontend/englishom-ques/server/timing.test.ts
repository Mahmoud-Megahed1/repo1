import { describe, expect, it } from "vitest";
import { TIMING_BY_LEVEL, getDefaultTimeForLevel, calculateTotalTime, formatTime } from "../shared/timing";

describe("Timing utilities", () => {
  it("should have correct timing presets for each level", () => {
    expect(TIMING_BY_LEVEL.A1).toBe(15);
    expect(TIMING_BY_LEVEL.A2).toBe(12);
    expect(TIMING_BY_LEVEL.B1).toBe(10);
    expect(TIMING_BY_LEVEL.B2).toBe(8);
    expect(TIMING_BY_LEVEL.C1).toBe(6);
    expect(TIMING_BY_LEVEL.C2).toBe(5);
  });

  it("should get default time for a given level", () => {
    expect(getDefaultTimeForLevel("A1")).toBe(15);
    expect(getDefaultTimeForLevel("B1")).toBe(10);
    expect(getDefaultTimeForLevel("C2")).toBe(5);
  });

  it("should calculate total time from question times", () => {
    expect(calculateTotalTime([10, 10, 10])).toBe(30);
    expect(calculateTotalTime([15, 12, 10, 8])).toBe(45);
    expect(calculateTotalTime([])).toBe(0);
  });

  it("should format seconds to MM:SS format", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(60)).toBe("01:00");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(125)).toBe("02:05");
    expect(formatTime(3661)).toBe("61:01");
  });

  it("should handle edge cases in timing", () => {
    expect(calculateTotalTime([1, 1, 1])).toBe(3);
    expect(calculateTotalTime([120])).toBe(120);
    expect(formatTime(1)).toBe("00:01");
  });
});
