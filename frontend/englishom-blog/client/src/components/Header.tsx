import { useLocalization } from "@/contexts/LocalizationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function Header() {
  const { language, setLanguage } = useLocalization();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const handleThemeToggle = () => {
    if (toggleTheme) {
      toggleTheme();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo.jpeg"
            alt="EnglishOM"
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-lg hidden sm:inline">EnglishOM</span>
        </a>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.home", language)}
          </a>
          <a href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.blog", language)}
          </a>
          {user?.role === "admin" && (
            <a href="/blog/admin" className="text-sm font-medium hover:text-primary transition-colors">
              {t("admin.dashboard", language)}
            </a>
          )}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLanguageToggle}
            title={t("common.language", language)}
            className="hidden sm:flex"
          >
            <Globe size={18} />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            title={theme === "light" ? t("common.darkMode", language) : t("common.lightMode", language)}
            className="hidden sm:flex"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {/* Auth Button */}
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/blog"}>
              {user?.name || "Account"}
            </Button>
          ) : (
            <Button
              size="sm"
              style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
              onClick={() => window.location.href = "/blog"}
            >
              {t("nav.startLearning", language)}
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col gap-2 p-4">
            <a href="/" className="px-4 py-2 rounded hover:bg-accent transition-colors">
              {t("nav.home", language)}
            </a>
            <a href="/blog" className="px-4 py-2 rounded hover:bg-accent transition-colors">
              {t("nav.blog", language)}
            </a>
            {user?.role === "admin" && (
              <a href="/blog/admin" className="px-4 py-2 rounded hover:bg-accent transition-colors">
                {t("admin.dashboard", language)}
              </a>
            )}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLanguageToggle}
                className="flex-1"
              >
                <Globe size={16} className="mr-2" />
                {language === "en" ? "العربية" : "English"}
              </Button>
            {toggleTheme && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="flex-1"
              >
                {theme === "light" ? (
                  <>
                    <Moon size={16} className="mr-2" />
                    {t("common.darkMode", language)}
                  </>
                ) : (
                  <>
                    <Sun size={16} className="mr-2" />
                    {t("common.lightMode", language)}
                  </>
                )}
              </Button>
            )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
