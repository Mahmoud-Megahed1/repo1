import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";
type Theme = "light" | "dark";

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isRTL, setIsRTL] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("englishom-language") as Language | null;
    const savedTheme = localStorage.getItem("englishom-theme") as Theme | null;

    if (savedLanguage) {
      setLanguageState(savedLanguage);
      setIsRTL(savedLanguage === "ar");
    }

    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Apply language direction and font to document
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.style.fontFamily = language === "ar" ? "'Cairo', 'Poppins', sans-serif" : "'Poppins', sans-serif";
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsRTL(lang === "ar");
    localStorage.setItem("englishom-language", lang);
    document.body.style.fontFamily = lang === "ar" ? "'Cairo', 'Poppins', sans-serif" : "'Poppins', sans-serif";
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("englishom-theme", newTheme);
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, theme, setTheme, isRTL }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
