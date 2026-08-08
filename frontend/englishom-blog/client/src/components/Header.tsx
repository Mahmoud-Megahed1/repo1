import { useLocalization } from "@/contexts/LocalizationContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const { language, setLanguage } = useLocalization();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo.jpeg"
            alt="EnglishOM"
            className="w-10 h-10 object-contain rounded-md"
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

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
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

          {/* Theme Switcher Slider */}
          <ThemeSwitcher />

          {/* Language Toggle */}
          <Button
            variant="ghost"
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            {language === "ar" ? "English" : "العربية"}
          </Button>
        </div>

        {/* Mobile Controls & Menu Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Language Toggle */}
          <div className="flex items-center bg-muted dark:bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                language === "en"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("ar")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                language === "ar"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="العربية"
            >
              AR
            </button>
          </div>

          {/* Theme Switcher Slider */}
          <ThemeSwitcher />

          {/* Hamburger Menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9"
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

            <div className="space-y-3 pt-4 border-t border-border mt-2">
              <div className="flex flex-col space-y-2">
                {isAuthenticated ? (
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = "/blog"}>
                    {user?.name || "Account"}
                  </Button>
                ) : (
                  <Button
                    className="w-full justify-start"
                    style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                    onClick={() => window.location.href = "/blog"}
                  >
                    {t("nav.startLearning", language)}
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
