import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 bg-[#4A3B32] dark:bg-[#FCDFC2] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-[#FCDFC2] dark:text-[#120F0D] font-extrabold text-xl">E</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                {t("nav.englishom")}
              </h1>
              <span className="text-xs font-semibold text-[#4A3B32] dark:text-[#FCDFC2]">
                {language === "ar" ? "مؤشر الإنجاز" : "Achievement Indicator"}
              </span>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  language === "ar"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                title="العربية"
              >
                AR
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  {t("nav.logout")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
