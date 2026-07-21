import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BookOpen, Zap, BarChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

/**
 * Home page for EnglishOM Ques (اختبار مستوى الكفاءة)
 */
export default function Home() {
  const [, navigate] = useLocation();
  const { language, t } = useLanguage();

  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    const checkAvailability = () => {
      const saved = localStorage.getItem('englishom_tests_availability');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.ques === false) {
            setIsAvailable(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setIsAvailable(true);
    };

    checkAvailability();
    window.addEventListener('storage', checkAvailability);
    return () => window.removeEventListener('storage', checkAvailability);
  }, []);

  if (!isAvailable) {
    return <ComingSoon />;
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-background transition-colors duration-300 ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center mb-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight text-center">
              {t("home.hero.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="gap-2 text-lg px-10 py-6 rounded-xl font-bold bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] shadow-lg hover:scale-105 transition-all"
              onClick={() => navigate("/ques")}
            >
              <Zap className="w-6 h-6 fill-current" />
              {t("home.cta.start")}
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            {t("features.title")}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border border-border/80 hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 rounded-2xl flex items-center justify-center mb-4 text-[#4A3B32] dark:text-[#FCDFC2]">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {t("features.levels.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("features.levels.desc")}
              </p>
            </Card>

            <Card className="p-6 border border-border/80 hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 rounded-2xl flex items-center justify-center mb-4 text-[#4A3B32] dark:text-[#FCDFC2]">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {t("features.fast.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("features.fast.desc")}
              </p>
            </Card>

            <Card className="p-6 border border-border/80 hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all shadow-sm flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 rounded-2xl flex items-center justify-center mb-4 text-[#4A3B32] dark:text-[#FCDFC2]">
                <BarChart className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">
                {t("features.feedback.title")}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("features.feedback.desc")}
              </p>
            </Card>
          </div>
        </section>

        {/* Levels Section */}
        <section className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
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
              <Card key={level.code} className="p-5 border-l-4 border-l-[#4A3B32] dark:border-l-[#FCDFC2] hover:shadow-md transition-all">
                <p className="text-xs font-bold text-[#4A3B32] dark:text-[#FCDFC2] mb-1">{level.code}</p>
                <h4 className="text-base font-bold text-foreground mb-1">{level.name}</h4>
                <p className="text-xs text-muted-foreground">{level.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-md flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
            {t("cta.title")}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl text-center leading-relaxed text-sm md:text-base">
            {t("cta.subtitle")}
          </p>
          <Button
            className="bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold py-6 px-8 text-base rounded-xl gap-2 shadow-lg"
            onClick={() => navigate("/ques")}
          >
            <BookOpen className="w-5 h-5" />
            {t("home.cta.start")}
          </Button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
