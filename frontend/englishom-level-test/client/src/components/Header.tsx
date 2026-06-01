import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Globe } from "lucide-react";
import { useLocation } from "wouter";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          <img 
            src="/logo.jpeg" 
            alt="Englishom" 
            className="h-10 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.features}
          </a>
          <a href={`https://englishom.com/${language === "ar" ? "ar" : "en"}/about`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.about}
          </a>
          <a href={`https://englishom.com/${language === "ar" ? "ar" : "en"}/faq`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t.nav.faq}
          </a>
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
            className="gap-2 rounded-lg"
          >
            <Globe className="h-4 w-4" />
            <span>{language === "ar" ? "EN" : "العربية"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
