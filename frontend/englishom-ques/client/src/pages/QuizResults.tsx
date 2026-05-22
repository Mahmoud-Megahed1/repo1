import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Award, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

interface QuizResultsProps {
  level: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageResponseTime: number;
}

export default function QuizResults(props: QuizResultsProps) {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const { data: achievements } = trpc.quiz.getUserAchievements.useQuery();

  useEffect(() => {
    // Get newly earned achievements
    if (achievements) {
      const recent = achievements.slice(0, 3); // Show recent 3
      setNewAchievements(recent.map(a => a.badgeType));
    }
  }, [achievements]);

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        "results.title": "Quiz Complete!",
        "results.accuracy": "Accuracy",
        "results.correct": "Correct Answers",
        "results.timeSpent": "Time Spent",
        "results.avgTime": "Avg Time per Question",
        "results.newAchievements": "New Achievements!",
        "results.noNewAchievements": "Keep practicing to earn achievements!",
        "results.backToHome": "Back to Home",
        "results.tryAgain": "Try Another Level",
        "results.share": "Share Results",
      },
      ar: {
        "results.title": "اكتمل الاختبار!",
        "results.accuracy": "الدقة",
        "results.correct": "الإجابات الصحيحة",
        "results.timeSpent": "الوقت المستغرق",
        "results.avgTime": "متوسط الوقت لكل سؤال",
        "results.newAchievements": "إنجازات جديدة!",
        "results.noNewAchievements": "استمر في الممارسة لكسب الإنجازات!",
        "results.backToHome": "العودة إلى الرئيسية",
        "results.tryAgain": "جرب مستوى آخر",
        "results.share": "مشاركة النتائج",
      },
    };
    return translations[language]?.[key] || key;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const shareResults = () => {
    const text = `I scored ${props.accuracy}% on EnglishOM Ques Level ${props.level}! 🎯`;
    if (navigator.share) {
      navigator.share({
        title: "EnglishOM Ques Results",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-accent/10 to-background ${language === "ar" ? "rtl" : "ltr"}`}>
      <div className="container max-w-2xl mx-auto p-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t("results.title")}</h1>
          <p className="text-xl text-accent font-semibold">{props.accuracy}%</p>
        </div>

        {/* Score Card */}
        <Card className="p-8 mb-8 bg-card border-2 border-accent/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("results.correct")}</p>
              <p className="text-2xl font-bold text-foreground">{props.correctAnswers}/{props.totalQuestions}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("results.accuracy")}</p>
              <p className="text-2xl font-bold text-accent">{props.accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("results.timeSpent")}</p>
              <p className="text-2xl font-bold text-foreground">{formatTime(props.totalTimeSpent)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{t("results.avgTime")}</p>
              <p className="text-2xl font-bold text-foreground">{props.averageResponseTime.toFixed(1)}s</p>
            </div>
          </div>
        </Card>

        {/* Achievements Section */}
        {newAchievements.length > 0 ? (
          <Card className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="text-yellow-600" />
              {t("results.newAchievements")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newAchievements.map((badge) => (
                <div key={badge} className="flex flex-col items-center text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <span className="text-3xl mb-2">⭐</span>
                  <p className="text-sm font-semibold text-foreground">{badge}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-8 bg-muted">
            <p className="text-center text-muted-foreground">{t("results.noNewAchievements")}</p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={shareResults}
            variant="outline"
            className="gap-2"
          >
            <Share2 size={18} />
            {t("results.share")}
          </Button>
          <Button
            onClick={() => setLocation("/ques")}
            variant="outline"
            className="gap-2"
          >
            <TrendingUp size={18} />
            {t("results.tryAgain")}
          </Button>
          <Button
            onClick={() => setLocation("/")}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            {t("results.backToHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
