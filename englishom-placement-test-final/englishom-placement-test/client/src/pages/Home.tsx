import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Zap, TrendingUp, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { language, t } = useLanguage();
  const isAr = language === "ar";

  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    const checkAvailability = () => {
      const saved = localStorage.getItem('englishom_tests_availability');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.test1 === false) {
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

  const levelItems = [
    {
      levelAr: "وضع التأسيس",
      levelEn: "Foundations",
      score: "0-59%",
      concept: isAr
        ? "وضعت حجر الأساس وبدأت المحاولة، تحتاج لتعزيز البناء لتجاوز هذه النسبة."
        : "You laid the cornerstone and started trying, you need to reinforce building to pass this ratio.",
      color: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
      badgeColor: "bg-red-500 text-white",
    },
    {
      levelAr: "بناء المفردات",
      levelEn: "Builder",
      score: "60-69%",
      concept: isAr
        ? "بدأت تركيب القطع وفهم الهيكل الأساسي للغة."
        : "You started assembling pieces and understanding the core structure of the language.",
      color: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
      badgeColor: "bg-orange-500 text-white",
    },
    {
      levelAr: "المتحدث الواعد",
      levelEn: "Rising Star",
      score: "70-79%",
      concept: isAr
        ? "لغتك بدأت تظهر بشكل أوضح ولديك قدرة جيدة على الفهم."
        : "Your language is starting to show more clearly, and you have good comprehension ability.",
      color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
      badgeColor: "bg-yellow-500 text-white",
    },
    {
      levelAr: "مستوى الإتقان",
      levelEn: "Proficient",
      score: "80-89%",
      concept: isAr
        ? "تمكنت من معظم مهارات الـ A1 ببراعة عالية."
        : "You have mastered most A1 skills with high proficiency.",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
      badgeColor: "bg-blue-500 text-white",
    },
    {
      levelAr: "الامتياز الكامل",
      levelEn: "Elite",
      score: "90-100%",
      concept: isAr
        ? "تجاوزت مرحلة الـ A1 بنجاح باهر وبدون أي ثغرات."
        : "You passed the A1 stage with stellar success and zero gaps.",
      color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      badgeColor: "bg-emerald-500 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Header with language and theme toggles */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              {t("home.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t("home.subtitle")}
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">{t("home.quickAssessment")}</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">{t("home.fiveStages")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <span className="text-gray-700 dark:text-gray-300">{t("home.instantResults")}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/test")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                {t("home.startNow")}
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-8 h-96 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20 shadow-inner">
            <div className="text-center">
              <BookOpen className="w-24 h-24 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-900 dark:text-white text-2xl font-extrabold mb-1">
                {isAr ? "مؤشر الإنجاز من إنجليشوم" : "Achievement Indicator by EnglishOM"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {isAr ? "اختبار كفاءة تفاعلي شامل" : "Comprehensive Interactive Test"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            {t("home.stages")}
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                number: 1,
                title: t("stages.visualRecognition"),
                description: t("stages.visual"),
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              },
              {
                number: 2,
                title: t("stages.auditoryProcessing"),
                description: t("stages.auditory"),
                color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              },
              {
                number: 3,
                title: t("stages.spellingStructure"),
                description: t("stages.spelling"),
                color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
              },
              {
                number: 4,
                title: t("stages.readingSprint"),
                description: t("stages.reading"),
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              },
              {
                number: 5,
                title: t("stages.vocalChallenge"),
                description: t("stages.vocal"),
                color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
              },
            ].map((stage) => (
              <div key={stage.number} className="text-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${stage.color} text-xl font-extrabold`}
                >
                  {stage.number}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{stage.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section (مقياس التمكن) */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
            {t("home.levels")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {levelItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${item.color} flex flex-col justify-between text-center transition-all hover:scale-105 shadow-sm`}
              >
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold mb-3 ${item.badgeColor}`}>
                    {item.score}
                  </span>
                  {isAr ? (
                    <>
                      <p className="font-extrabold text-xl mb-1 text-gray-900 dark:text-white">
                        {item.levelAr}
                      </p>
                      <p className="text-xs font-semibold uppercase text-slate-500 mb-3 tracking-wider">
                        {item.levelEn}
                      </p>
                    </>
                  ) : (
                    <p className="font-extrabold text-xl mb-4 text-gray-900 dark:text-white uppercase tracking-wide">
                      {item.levelEn}
                    </p>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-medium border-t border-current/20 pt-3 mt-2">
                  {item.concept}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-4">
            {t("home.readyToTest")}
          </h3>
          <p className="text-indigo-100 mb-8 text-lg">
            {t("home.getStarted")}
          </p>
          <Button
            onClick={() => navigate("/test")}
            className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            {t("home.startNow")}
          </Button>
        </div>
      </section>

      {/* Universal Platform Footer */}
      <Footer />
    </div>
  );
}

