import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Share2, TrendingUp, Award, Globe, Moon, Sun, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { ProgressJourney } from "@/components/ProgressJourney";

const t = (key: string, lang: string = "en") => {
  const translations: Record<string, Record<string, string>> = {
    en: {
      "myresults.title": "My Results",
      "myresults.statistics": "Your Statistics",
      "myresults.quizzesTaken": "Quizzes Taken",
      "myresults.averageAccuracy": "Average Accuracy",
      "myresults.bestLevel": "Best Level",
      "myresults.totalTimeSpent": "Total Time Spent",
      "myresults.achievements": "Achievements",
      "myresults.noAchievements": "No achievements yet. Keep practicing!",
      "myresults.quizHistory": "Quiz History",
      "myresults.noHistory": "No quiz history yet.",
      "myresults.level": "Level",
      "myresults.accuracy": "Accuracy",
      "myresults.date": "Date",
      "myresults.share": "Share Results",
      "myresults.backToHome": "Back to Home",
    },
    ar: {
      "myresults.title": "نتائجي",
      "myresults.statistics": "إحصائياتك",
      "myresults.quizzesTaken": "الاختبارات المأخوذة",
      "myresults.averageAccuracy": "متوسط الدقة",
      "myresults.bestLevel": "أفضل مستوى",
      "myresults.totalTimeSpent": "الوقت الإجمالي المستغرق",
      "myresults.achievements": "الإنجازات",
      "myresults.noAchievements": "لا توجد إنجازات حتى الآن. استمر في الممارسة!",
      "myresults.quizHistory": "سجل الاختبارات",
      "myresults.noHistory": "لا يوجد سجل اختبارات حتى الآن.",
      "myresults.level": "المستوى",
      "myresults.accuracy": "الدقة",
      "myresults.date": "التاريخ",
      "myresults.share": "مشاركة النتائج",
      "myresults.backToHome": "العودة إلى الرئيسية",
    },
  };
  return translations[lang]?.[key] || key;
};

export default function MyResults() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const { data: progress, isLoading: progressLoading } = trpc.quiz.getUserProgress.useQuery();
  const { data: achievements, isLoading: achievementsLoading } = trpc.quiz.getUserAchievements.useQuery();
  const { data: history, isLoading: historyLoading } = trpc.quiz.getQuizHistory.useQuery({ limit: 10 });

  if (!user) {
    return (
      <div className={`min-h-screen bg-background transition-colors duration-300 ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className="container max-w-4xl mx-auto p-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("myresults.title", language)}</h1>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                {language === "en" ? "AR" : "EN"}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Guest Message */}
          <Card className="p-8 text-center">
            <p className="text-lg text-foreground mb-4">
              {language === "en" 
                ? "Please log in to view your results and track your progress." 
                : "يرجى تسجيل الدخول لعرض نتائجك وتتبع تقدمك."}
            </p>
            <button
              onClick={() => window.location.href = getLoginUrl()}
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {language === "en" ? "Log In" : "تسجيل الدخول"}
            </button>
          </Card>
        </div>
      </div>
    );
  }

  const isLoading = progressLoading || achievementsLoading || historyLoading;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const shareResults = () => {
    const text = `I scored ${progress?.averageAccuracy || 0}% on EnglishOM Ques! 🎯 My best level: ${progress?.bestLevel || "N/A"}`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: "EnglishOM Ques Results",
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="container max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("myresults.title", language)}</h1>
          <div className="flex gap-2 items-center">
            {/* Language Toggle */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
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
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button variant="outline" onClick={() => setLocation("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("myresults.backToHome", language)}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("myresults.quizzesTaken", language)}</p>
                    <p className="text-2xl font-bold text-foreground">{progress?.totalQuizzesTaken || 0}</p>
                  </div>
                  <TrendingUp className="text-accent" size={24} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("myresults.averageAccuracy", language)}</p>
                    <p className="text-2xl font-bold text-foreground">{progress?.averageAccuracy || 0}%</p>
                  </div>
                  <Award className="text-accent" size={24} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("myresults.bestLevel", language)}</p>
                    <p className="text-2xl font-bold text-foreground">{progress?.bestLevel || "N/A"}</p>
                  </div>
                  <Award className="text-accent" size={24} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("myresults.totalTimeSpent", language)}</p>
                    <p className="text-2xl font-bold text-foreground">{formatTime(progress?.totalTimeSpent || 0)}</p>
                  </div>
                  <TrendingUp className="text-accent" size={24} />
                </div>
              </Card>
            </div>

            {/* Achievements Section */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("myresults.achievements", language)}</h2>
              {achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center text-center p-4 bg-accent/10 rounded-lg">
                      <span className="text-3xl mb-2">⭐</span>
                      <p className="font-semibold text-sm text-foreground">{achievement.badgeName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.badgeDescription}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("myresults.noAchievements", language)}</p>
              )}
            </Card>

            {/* Progress Journey */}
            {history && history.length > 0 && (
              <Card className="p-6 mb-8">
                <ProgressJourney
                  attempts={history.map(h => ({
                    date: new Date(h.completedAt),
                    accuracy: h.accuracy,
                    level: h.level,
                  }))}
                />
              </Card>
            )}

            {/* Share Button */}
            <div className="mb-8">
              <Button onClick={shareResults} className="w-full gap-2 bg-accent hover:bg-accent/90">
                <Share2 size={18} />
                {t("myresults.share", language)}
              </Button>
            </div>

            {/* Quiz History Section */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("myresults.quizHistory", language)}</h2>
              {history && history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-start py-2 px-2 font-semibold text-foreground">{t("myresults.level", language)}</th>
                        <th className="text-start py-2 px-2 font-semibold text-foreground">{t("myresults.accuracy", language)}</th>
                        <th className="text-start py-2 px-2 font-semibold text-foreground">{t("myresults.date", language)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((result) => (
                        <tr key={result.id} className="border-b border-border hover:bg-accent/5">
                          <td className="py-2 px-2 text-foreground font-medium">{result.level}</td>
                          <td className="py-2 px-2 text-foreground">{result.accuracy}%</td>
                          <td className="py-2 px-2 text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("myresults.noHistory", language)}</p>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
