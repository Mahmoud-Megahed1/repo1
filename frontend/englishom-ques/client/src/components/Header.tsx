import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import EnglishomLogo from "./EnglishomLogo";
import { Globe, Moon, Sun, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <EnglishomLogo className="w-11 h-11" />
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              {t("header.title")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("header.subtitle")}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Admin Link */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t("header.admin")}</span>
          </Button>

          {/* Language Toggle */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              size="sm"
              variant={language === "en" ? "default" : "ghost"}
              onClick={() => setLanguage("en")}
              className="gap-1 text-xs px-2 h-7"
            >
              <Globe className="w-3.5 h-3.5" />
              EN
            </Button>
            <Button
              size="sm"
              variant={language === "ar" ? "default" : "ghost"}
              onClick={() => setLanguage("ar")}
              className="gap-1 text-xs px-2 h-7"
            >
              <Globe className="w-3.5 h-3.5" />
              AR
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={toggleTheme}
            className="gap-2 text-xs h-9"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{t("theme.light")}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">{t("theme.dark")}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
