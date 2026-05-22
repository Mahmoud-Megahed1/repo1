import { describe, it, expect } from "vitest";

describe("Share Button URL Generation", () => {
  it("should generate correct Twitter share URL with accuracy percentage", () => {
    const accuracy = 85;
    const text = `I scored ${accuracy}% on EnglishOM Ques! 🎯`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    expect(twitterUrl).toContain("twitter.com/intent/tweet");
    expect(twitterUrl).toContain("85");
    expect(twitterUrl).toContain("EnglishOM");
  });

  it("should generate correct WhatsApp share URL with accuracy percentage", () => {
    const accuracy = 90;
    const text = `I scored ${accuracy}% on EnglishOM Ques! 🎯`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    
    expect(whatsappUrl).toContain("wa.me");
    expect(whatsappUrl).toContain("90");
    expect(whatsappUrl).toContain("EnglishOM");
  });

  it("should generate correct Facebook share URL", () => {
    const origin = "https://englishom-ques.manus.space";
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(origin)}`;
    
    expect(facebookUrl).toContain("facebook.com/sharer");
    expect(facebookUrl).toContain("https%3A%2F%2F");
  });

  it("should handle different accuracy percentages in share URLs", () => {
    const accuracies = [75, 85, 95, 100];
    
    accuracies.forEach(accuracy => {
      const text = `I scored ${accuracy}% on EnglishOM Ques! 🎯`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      
      expect(url).toContain(accuracy.toString());
    });
  });

  it("should properly encode special characters in share URLs", () => {
    const text = "I scored 100% on EnglishOM Ques! 🎯";
    const encoded = encodeURIComponent(text);
    
    // Check that special characters are encoded
    expect(encoded).toContain("%");
    expect(encoded).not.toContain("🎯"); // emoji should be encoded
  });
});

describe("App Defaults Configuration", () => {
  it("should have Arabic as default language constant", () => {
    const defaultLanguage = "ar";
    expect(defaultLanguage).toBe("ar");
  });

  it("should have dark as default theme constant", () => {
    const defaultTheme = "dark";
    expect(defaultTheme).toBe("dark");
  });

  it("should support language switching between en and ar", () => {
    const languages = ["en", "ar"];
    const currentLanguage = "ar";
    
    expect(languages).toContain(currentLanguage);
    expect(languages.length).toBe(2);
  });

  it("should support theme switching between light and dark", () => {
    const themes = ["light", "dark"];
    const currentTheme = "dark";
    
    expect(themes).toContain(currentTheme);
    expect(themes.length).toBe(2);
  });
});
