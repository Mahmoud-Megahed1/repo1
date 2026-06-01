import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { BookOpen, Settings, LogOut, Moon, Sun, Globe, Zap, BarChart } from "lucide-react";

/**
 * Home page for EnglishOM Ques
 */
export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("header.title")}</h1>
            <p className="text-muted-foreground">{t("header.subtitle")}</p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Language Toggle */}
            <div className="flex gap-2 bg-muted p-1 rounded-lg">
              <Button
                size="sm"
                variant={language === "en" ? "default" : "ghost"}
                onClick={() => setLanguage("en")}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                EN
              </Button>
              <Button
                size="sm"
                variant={language === "ar" ? "default" : "ghost"}
                onClick={() => setLanguage("ar")}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                AR
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("theme.light")}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("theme.dark")}</span>
                </>
              )}
            </Button>

            {loading ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <div className={`text-${language === "ar" ? "left" : "right"}`}>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/results")}
                  className="gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {t("header.myResults")}
                </Button>
                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin")}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {t("header.admin")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => logout()}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t("header.logout")}
                </Button>
              </>
            ) : (
              <Button
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                {t("header.login")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("home.hero.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 px-8 text-lg gap-2"
              onClick={() => navigate("/ques")}
            >
              <BookOpen className="w-5 h-5" />
              {t("home.cta.start")}
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="font-semibold py-6 px-8 text-lg"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                {t("header.login")}
              </Button>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            {t("features.title")}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {t("features.levels.title")}
              </h4>
              <p className="text-muted-foreground">
                {t("features.levels.desc")}
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {t("features.fast.title")}
              </h4>
              <p className="text-muted-foreground">
                {t("features.fast.desc")}
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {t("features.feedback.title")}
              </h4>
              <p className="text-muted-foreground">
                {t("features.feedback.desc")}
              </p>
            </Card>
          </div>
        </section>

        {/* Levels Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            {t("levels.title")}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: "A1", name: t("levels.a1"), desc: t("levels.a1.desc") },
              { code: "A2", name: t("levels.a2"), desc: t("levels.a2.desc") },
              { code: "B1", name: t("levels.b1"), desc: t("levels.b1.desc") },
              { code: "B2", name: t("levels.b2"), desc: t("levels.b2.desc") },
              { code: "C1", name: t("levels.c1"), desc: t("levels.c1.desc") },
              { code: "C2", name: t("levels.c2"), desc: t("levels.c2.desc") },
            ].map((level) => (
              <Card key={level.code} className="p-4 border-l-4 border-l-accent">
                <p className="text-sm font-semibold text-accent mb-1">{level.code}</p>
                <h4 className="text-lg font-bold text-foreground">{level.name}</h4>
                <p className="text-sm text-muted-foreground">{level.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border border-border rounded-lg p-12 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t("cta.title")}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 px-8 text-lg gap-2"
          onClick={() => navigate("/ques")}
        >
          <BookOpen className="w-5 h-5" />
          {t("home.cta.start")}
        </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>{t("footer.copyright")}</p>
          <p className="text-sm mt-2">{t("footer.part")}</p>
        </div>
      </footer>
    </div>
  );
}
