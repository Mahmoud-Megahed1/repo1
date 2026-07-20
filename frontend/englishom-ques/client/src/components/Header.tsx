import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import EnglishomLogo from "./EnglishomLogo";
import { Globe, Moon, Sun, Shield, BarChart2 } from "lucide-react";
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
        <div className="flex items-center gap-3 sm:gap-5">
          {/* My Results Link */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate("/results")}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            <BarChart2 className="w-4 h-4 text-amber-500" />
            <span>{t("header.myResults")}</span>
          </Button>

          {/* Admin Link */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="gap-1 text-xs text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Shield className="w-4 h-4" />
            <span>{t("header.admin")}</span>
          </Button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#4B3D34] dark:text-[#F1E5D8] hover:opacity-80 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            <span>{language === "ar" ? "الانجليزية" : "العربية"}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex items-center p-1 rounded-full cursor-pointer transition-colors bg-[#F1E5D8] dark:bg-[#3b2d26] border-none outline-none"
            aria-label="Toggle theme"
          >
            <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-[#F1E5D8] text-[#3b2d26]' : 'text-[#4B3D34]'}`}>
              <Moon className="w-4 h-4 fill-current" />
            </div>
            <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${theme === 'light' ? 'bg-[#4B3D34] text-[#F1E5D8]' : 'text-[#F1E5D8] dark:text-[#a89b94]'}`}>
              <Sun className="w-4 h-4 fill-current" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
