import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BookOpen, Zap, TrendingUp, Award } from "lucide-react";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Header with language and theme toggles */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("home.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg rounded-lg"
              >
                {t("home.startNow")}
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-24 h-24 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-lg">{t("home.testStages")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("home.stages")}
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                number: 1,
                title: "Visual Recognition",
                description: t("stages.visual"),
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
              },
              {
                number: 2,
                title: "Auditory Processing",
                description: t("stages.auditory"),
                color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
              },
              {
                number: 3,
                title: "Spelling & Structure",
                description: t("stages.spelling"),
                color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
              },
              {
                number: 4,
                title: "Reading Sprint",
                description: t("stages.reading"),
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
              },
              {
                number: 5,
                title: "Vocal Challenge",
                description: t("stages.vocal"),
                color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
              },
            ].map((stage) => (
              <div key={stage.number} className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${stage.color} text-2xl font-bold`}
                >
                  {stage.number}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{stage.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t("home.levels")}
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { level: "Beginner", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300", score: "0-59%" },
              { level: "Elementary", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300", score: "60-69%" },
              { level: "Intermediate", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300", score: "70-79%" },
              { level: "Upper-Intermediate", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", score: "80-89%" },
              { level: "Advanced", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", score: "90-100%" },
            ].map((item) => (
              <div key={item.level} className={`p-6 rounded-lg text-center ${item.color}`}>
                <p className="font-bold text-lg mb-2">{item.level}</p>
                <p className="text-sm opacity-80">{item.score}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {t("home.readyToTest")}
          </h3>
          <p className="text-indigo-100 mb-8 text-lg">
            {t("home.getStarted")}
          </p>
          <Button
            onClick={() => navigate("/test")}
            className="bg-white hover:bg-gray-100 text-indigo-600 px-8 py-3 text-lg font-semibold rounded-lg"
          >
            {t("home.startNow")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-gray-400 py-8 border-t border-gray-800 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Englishom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
