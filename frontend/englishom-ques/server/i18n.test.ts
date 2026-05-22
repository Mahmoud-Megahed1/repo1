import { describe, expect, it } from "vitest";
import { t, translations } from "../client/src/lib/i18n";

describe("i18n translations", () => {
  it("should have English and Arabic translations", () => {
    expect(translations.en).toBeDefined();
    expect(translations.ar).toBeDefined();
    expect(Object.keys(translations.en).length).toBeGreaterThan(0);
    expect(Object.keys(translations.ar).length).toBeGreaterThan(0);
  });

  it("should translate English header keys correctly", () => {
    expect(t("header.title", "en")).toBe("EnglishOM Ques");
    expect(t("header.subtitle", "en")).toBe("Test your English knowledge");
    expect(t("header.admin", "en")).toBe("Admin");
  });

  it("should translate Arabic header keys correctly", () => {
    expect(t("header.title", "ar")).toBe("اختبار اللغة الإنجليزية");
    expect(t("header.subtitle", "ar")).toBe("اختبر معرفتك باللغة الإنجليزية");
    expect(t("header.admin", "ar")).toBe("الإدارة");
  });

  it("should return key if translation not found", () => {
    expect(t("non.existent.key", "en")).toBe("non.existent.key");
    expect(t("invalid.path", "ar")).toBe("invalid.path");
  });

  it("should have matching keys in both languages", () => {
    const enKeys = Object.keys(translations.en);
    const arKeys = Object.keys(translations.ar);
    
    // Check that all English keys have Arabic translations
    for (const key of enKeys) {
      expect(arKeys).toContain(key);
    }
  });

  it("should handle level translations", () => {
    expect(t("levels.a1", "en")).toBe("Beginner");
    expect(t("levels.a1", "ar")).toBe("مبتدئ");
    expect(t("levels.c2", "en")).toBe("Proficiency");
    expect(t("levels.c2", "ar")).toBe("متقن");
  });

  it("should handle admin translations", () => {
    expect(t("admin.title", "en")).toBe("Admin Dashboard");
    expect(t("admin.title", "ar")).toBe("لوحة تحكم الإدارة");
    expect(t("admin.addQuestion", "en")).toBe("Add Question");
    expect(t("admin.addQuestion", "ar")).toBe("إضافة سؤال");
  });

  it("should handle quiz translations", () => {
    expect(t("quiz.question", "en")).toBe("Question");
    expect(t("quiz.question", "ar")).toBe("السؤال");
    expect(t("quiz.accuracy", "en")).toBe("Accuracy");
    expect(t("quiz.accuracy", "ar")).toBe("الدقة");
  });
});
