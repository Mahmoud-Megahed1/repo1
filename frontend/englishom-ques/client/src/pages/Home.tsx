import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BookOpen, Zap, BarChart, Wind, Radio, Rocket, Flame, AlertTriangle } from "lucide-react";
import { formatLevelCode } from "@/lib/i18n";
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

  const customLevels = [
    {
      code: "A1",
      icon: Wind,
      seconds: "15",
      titleAr: "منطقة التنفس (15 ثانية)",
      descAr: "محطة البداية؛ الوقت صديقك لتستدعي الكلمات وتجيب بهدوء ودون ضغط.",
      titleEn: "Breathing Zone (15s)",
      descEn: "Starting station; time is your friend to recall words calmly.",
    },
    {
      code: "A2",
      icon: Radio,
      seconds: "12",
      titleAr: "التقاط الإشارة (12 ثانية)",
      descAr: "ينكمش الوقت ليرتفع إدراكك؛ لا مجال للتردد، فقط ألمع الإجابة الصحيحة.",
      titleEn: "Signal Catch (12s)",
      descEn: "Time shrinks to heighten awareness; no hesitation, pick the right answer.",
    },
    {
      code: "B1",
      icon: Rocket,
      seconds: "10",
      titleAr: "حافة الانطلاق (10 ثواني)",
      descAr: "محطة كسر البطء؛ تضعك على أول طريق التفكير المباشر بالإنجليزية.",
      titleEn: "Launch Edge (10s)",
      descEn: "Break the slowness; puts you on the direct English thinking path.",
    },
    {
      code: "B2",
      icon: Flame,
      seconds: "8",
      titleAr: "المواجهة السريعة (8 ثواني)",
      descAr: "الخوض في العمق؛ يداهمك الوقت لتختبر سرعة استجابتك في مواقف حقيقية.",
      titleEn: "Fast Faceoff (8s)",
      descEn: "Diving deep; time rushes you to test real-life reaction speed.",
    },
    {
      code: "C1",
      icon: AlertTriangle,
      seconds: "6",
      titleAr: "الثواني الحرجة (6 ثواني)",
      descAr: "محطة التعثر الإيجابي؛ هنا تخطئ وتتعثر لتجبر عقلك على إلغاء الترجمة الحرفية.",
      titleEn: "Critical Seconds (6s)",
      descEn: "Positive stumble station; forces your brain to eliminate literal translation.",
    },
    {
      code: "C2",
      icon: Zap,
      seconds: "4",
      titleAr: "الرد اللحظي (4 ثواني)",
      descAr: "ذروة الطلاقة؛ لا وقت للتفكير، الإجابة تخرج تلقائياً من عقلك الباطن.",
      titleEn: "Instant Response (4s)",
      descEn: "Peak fluency; no time to overthink, answers spring automatically.",
    },
  ];

  useEffect(() => {
    const checkAvailability = () => {
      fetch(`https://admin.englishom.com/api/settings?t=${Date.now()}`, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.testsAvailability && data.testsAvailability.ques === false) {
            setIsAvailable(false);
          } else {
            setIsAvailable(true);
          }
        })
        .catch(() => {
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
        });
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
          <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2 text-center">
            {t("levels.title")}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground text-center mb-8 font-medium">
            {t("levels.subtitle")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customLevels.map((lvl) => {
              const IconComp = lvl.icon;
              return (
                <Card 
                  key={lvl.code} 
                  className="p-6 border border-border/80 hover:border-[#4A3B32] dark:hover:border-[#FCDFC2] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between min-h-[160px] rounded-2xl"
                  onClick={() => navigate(`/ques?level=${lvl.code}`)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
                      {formatLevelCode(lvl.code)}
                    </span>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base md:text-lg font-extrabold text-foreground">
                        {language === "ar" ? lvl.titleAr : lvl.titleEn}
                      </h4>
                      <div className="p-2 rounded-xl bg-[#4A3B32]/10 text-[#4A3B32] dark:bg-[#FCDFC2]/15 dark:text-[#FCDFC2]">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground text-start leading-relaxed">
                    {language === "ar" ? lvl.descAr : lvl.descEn}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-md flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
            {t("cta.title")}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl text-center leading-relaxed text-sm md:text-base whitespace-pre-line">
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
