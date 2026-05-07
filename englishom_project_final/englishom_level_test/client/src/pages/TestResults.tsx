import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, AlertCircle, TrendingUp, Download, Share2, Award, Lightbulb, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ar, en } from "@shared/translations";

interface TestResult {
  totalScore: number;
  cefrLevel: string;
  vocabularyScore: number;
  grammarScore: number;
  readingScore: number;
  listeningScore: number;
  writingScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Motivational messages based on score and CEFR level
const getMotivationalMessage = (score: number, cefrLevel: string, language: string): { title: string; message: string; emoji: string } => {
  const messages = {
    en: {
      excellent: {
        title: "Outstanding Performance! 🌟",
        message: "You've achieved an exceptional score! Your English proficiency is impressive. Keep up this momentum and continue challenging yourself with advanced materials.",
        emoji: "🏆"
      },
      great: {
        title: "Great Job! 👏",
        message: "You're performing well and showing solid progress. With consistent practice, you'll reach the next level soon. Focus on your weak areas to accelerate your growth.",
        emoji: "⭐"
      },
      good: {
        title: "Good Start! 💪",
        message: "You have a solid foundation. This is a great starting point! Dedicate time to practice regularly, especially in the areas marked for improvement.",
        emoji: "🚀"
      },
      developing: {
        title: "Keep Learning! 📚",
        message: "You're on the right path! English learning is a journey. Focus on consistent practice, and you'll see significant improvement in no time.",
        emoji: "🌱"
      }
    },
    ar: {
      excellent: {
        title: "أداء استثنائي! 🌟",
        message: "لقد حققت درجة استثنائية! مستوى كفاءتك في اللغة الإنجليزية مثير للإعجاب. استمر في هذا الزخم وواصل تحدي نفسك بمواد متقدمة.",
        emoji: "🏆"
      },
      great: {
        title: "عمل رائع! 👏",
        message: "أنت تؤدي بشكل جيد وتظهر تقدماً ملموساً. مع الممارسة المستمرة، ستصل إلى المستوى التالي قريباً. ركز على نقاط ضعفك لتسريع نموك.",
        emoji: "⭐"
      },
      good: {
        title: "بداية جيدة! 💪",
        message: "لديك أساس قوي. هذه نقطة انطلاق رائعة! كرس الوقت للممارسة المنتظمة، خاصة في المجالات المحددة للتحسين.",
        emoji: "🚀"
      },
      developing: {
        title: "استمر في التعلم! 📚",
        message: "أنت على الطريق الصحيح! تعلم اللغة الإنجليزية هو رحلة. ركز على الممارسة المستمرة، وستشهد تحسناً ملموساً قريباً.",
        emoji: "🌱"
      }
    }
  };

  const lang = language === "ar" ? messages.ar : messages.en;
  
  if (score >= 90) return lang.excellent;
  if (score >= 75) return lang.great;
  if (score >= 60) return lang.good;
  return lang.developing;
};

// Get CEFR level tips
const getCEFRTips = (cefrLevel: string, language: string): string[] => {
  const tips = {
    en: {
      A1: [
        "Focus on basic vocabulary and simple sentence structures",
        "Practice listening to slow, clear English content",
        "Use flashcards for daily vocabulary practice",
        "Watch beginner-level English videos with subtitles"
      ],
      A2: [
        "Expand your vocabulary to 1000-1500 words",
        "Practice present and past tenses regularly",
        "Start reading simple English stories and news",
        "Join beginner conversation groups"
      ],
      B1: [
        "Work on more complex grammar structures",
        "Read intermediate-level books and articles",
        "Practice speaking in longer sentences",
        "Listen to podcasts and watch movies with subtitles"
      ],
      B2: [
        "Study advanced grammar and idioms",
        "Read professional and academic materials",
        "Practice writing essays and formal emails",
        "Engage in debates and discussions"
      ],
      C1: [
        "Master nuanced language and subtle expressions",
        "Read literature and academic papers",
        "Practice writing in different styles",
        "Engage in professional and academic discussions"
      ],
      C2: [
        "Maintain your mastery through continuous reading",
        "Explore specialized vocabulary in your field",
        "Teach others or mentor English learners",
        "Stay updated with latest language trends"
      ]
    },
    ar: {
      A1: [
        "ركز على المفردات الأساسية وبنى الجمل البسيطة",
        "مارس الاستماع إلى محتوى إنجليزي بطيء وواضح",
        "استخدم بطاقات الفلاش للممارسة اليومية",
        "شاهد مقاطع فيديو إنجليزية للمبتدئين مع ترجمة"
      ],
      A2: [
        "وسّع مفرداتك إلى 1000-1500 كلمة",
        "مارس الأزمنة الحالية والماضية بانتظام",
        "ابدأ قراءة قصص إنجليزية بسيطة وأخبار",
        "انضم إلى مجموعات محادثة للمبتدئين"
      ],
      B1: [
        "اعمل على بنى قواعد أكثر تعقيداً",
        "اقرأ كتباً ومقالات على مستوى متوسط",
        "مارس التحدث في جمل أطول",
        "استمع إلى البودكاست وشاهد الأفلام مع ترجمة"
      ],
      B2: [
        "ادرس القواعد المتقدمة والتعابير الاصطلاحية",
        "اقرأ المواد المهنية والأكاديمية",
        "مارس الكتابة والرسائل الرسمية",
        "شارك في النقاشات والحوارات"
      ],
      C1: [
        "أتقن اللغة الدقيقة والتعابير الخفية",
        "اقرأ الأدب والأوراق الأكاديمية",
        "مارس الكتابة بأساليب مختلفة",
        "شارك في النقاشات المهنية والأكاديمية"
      ],
      C2: [
        "حافظ على إتقانك من خلال القراءة المستمرة",
        "استكشف المفردات المتخصصة في مجالك",
        "علّم الآخرين أو كن مرشداً لمتعلمي اللغة",
        "ابقَ على اطلاع بأحدث اتجاهات اللغة"
      ]
    }
  };

  return tips[language === "ar" ? "ar" : "en"][cefrLevel as keyof typeof tips.en] || [];
};

export default function TestResults({ params }: { params: { sessionId: string } }) {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: testResult } = trpc.test.getResults.useQuery(
    { sessionId: params.sessionId },
    { enabled: !!params.sessionId }
  );

  useEffect(() => {
    if (testResult) {
      setResult(testResult);
      setLoading(false);
    }
  }, [testResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{language === "ar" ? "جاري تحميل النتائج..." : "Loading your results..."}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">{language === "ar" ? "النتائج غير موجودة" : "Results Not Found"}</h1>
          <p className="text-muted-foreground mb-6">{language === "ar" ? "لم نتمكن من العثور على نتائج اختبارك." : "We couldn't find your test results."}</p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {language === "ar" ? "العودة للرئيسية" : "Go Home"}
          </Button>
        </div>
      </div>
    );
  }

  const cefrDescriptions: Record<string, { color: string; descriptionEn: string; descriptionAr: string }> = {
    A1: { color: "bg-blue-500", descriptionEn: "Beginner - Elementary proficiency", descriptionAr: "مبتدئ - كفاءة أساسية" },
    A2: { color: "bg-blue-600", descriptionEn: "Elementary - Limited working proficiency", descriptionAr: "ابتدائي - كفاءة عملية محدودة" },
    B1: { color: "bg-green-500", descriptionEn: "Intermediate - Working proficiency", descriptionAr: "متوسط - كفاءة عملية" },
    B2: { color: "bg-green-600", descriptionEn: "Upper Intermediate - Professional working proficiency", descriptionAr: "متوسط متقدم - كفاءة عملية احترافية" },
    C1: { color: "bg-amber-500", descriptionEn: "Advanced - Full professional proficiency", descriptionAr: "متقدم - كفاءة احترافية كاملة" },
    C2: { color: "bg-amber-600", descriptionEn: "Mastery - Native or bilingual proficiency", descriptionAr: "إتقان - كفاءة أصلية أو ثنائية اللغة" },
  };

  const cefrInfo = cefrDescriptions[result.cefrLevel] || cefrDescriptions.A1;
  const description = language === "ar" ? cefrInfo.descriptionAr : cefrInfo.descriptionEn;
  const motivationalMsg = getMotivationalMessage(result.totalScore, result.cefrLevel, language);
  const cefrTips = getCEFRTips(result.cefrLevel, language);

  const stageScores = [
    { nameEn: "Vocabulary", nameAr: "المفردات", score: result.vocabularyScore, icon: "📚" },
    { nameEn: "Grammar", nameAr: "القواعد", score: result.grammarScore, icon: "✏️" },
    { nameEn: "Reading", nameAr: "القراءة", score: result.readingScore, icon: "📖" },
    { nameEn: "Listening", nameAr: "الاستماع", score: result.listeningScore, icon: "🎧" },
    { nameEn: "Writing", nameAr: "الكتابة", score: result.writingScore, icon: "🗣️" },
  ];

  return (
    <div className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg text-foreground">Englishom {language === "ar" ? "النتائج" : "Results"}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              {language === "ar" ? "تحميل" : "Download"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              {language === "ar" ? "مشاركة" : "Share"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Motivational Message */}
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/50 overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{motivationalMsg.emoji}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{motivationalMsg.title}</h2>
                  <p className="text-foreground/80 leading-relaxed">{motivationalMsg.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score Card */}
          <Card className="bg-gradient-to-br from-card to-card/50 border-border overflow-hidden shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl text-foreground mb-2">
                    {language === "ar" ? "مستوى CEFR الخاص بك" : "Your CEFR Level"}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
                <Award className="w-12 h-12 text-primary animate-bounce" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className={`${cefrInfo.color} text-white rounded-lg p-6 text-center shadow-lg`}>
                      <div className="text-5xl font-bold">{result.cefrLevel}</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-foreground">{result.totalScore}%</div>
                      <p className="text-sm text-muted-foreground">{language === "ar" ? "الدرجة الإجمالية" : "Overall Score"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "أدائك" : "Your Performance"}</span>
                      <span className="font-bold text-foreground">{result.totalScore}%</span>
                    </div>
                    <Progress value={result.totalScore} className="h-3" />
                  </div>
                  <Alert className={`${result.totalScore >= 75 ? "bg-green-500/10 border-green-500" : result.totalScore >= 60 ? "bg-amber-500/10 border-amber-500" : "bg-blue-500/10 border-blue-500"}`}>
                    <Zap className={`h-4 w-4 ${result.totalScore >= 75 ? "text-green-500" : result.totalScore >= 60 ? "text-amber-500" : "text-blue-500"}`} />
                    <AlertDescription className={result.totalScore >= 75 ? "text-green-700 dark:text-green-400" : result.totalScore >= 60 ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400"}>
                      {result.totalScore >= 90
                        ? language === "ar" ? "ممتاز! لقد أتقنت هذا المستوى." : "Excellent! You have mastered this level."
                        : result.totalScore >= 75
                        ? language === "ar" ? "رائع! أنت تؤدي بشكل جيد. استمر في الممارسة للتحسن." : "Great! You're doing well. Keep practicing to improve."
                        : result.totalScore >= 60
                        ? language === "ar" ? "بداية جيدة! ركز على نقاط ضعفك للتقدم." : "Good start! Focus on your weak areas to progress."
                        : language === "ar" ? "استمر في التعلم والممارسة المنتظمة." : "Keep learning and practicing regularly."}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Scores */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{language === "ar" ? "الأداء حسب المرحلة" : "Performance by Stage"}</CardTitle>
              <CardDescription>{language === "ar" ? "درجتك في كل مجال مهارة" : "Your score in each skill area"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stageScores.map((stage) => (
                  <div key={stage.nameEn} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{stage.icon}</span>
                        <span className="font-semibold text-foreground">{language === "ar" ? stage.nameAr : stage.nameEn}</span>
                      </div>
                      <span className="font-bold text-lg text-primary">{stage.score}%</span>
                    </div>
                    <Progress value={stage.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  {language === "ar" ? "نقاط القوة" : "Your Strengths"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.strengths.length > 0 ? (
                  <ul className="space-y-3">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground capitalize">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{language === "ar" ? "لم تُحدد نقاط قوة محددة." : "No specific strengths identified."}</p>
                )}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  {language === "ar" ? "مجالات التحسين" : "Areas to Improve"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.weaknesses.length > 0 ? (
                  <ul className="space-y-3">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground capitalize">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{language === "ar" ? "لم تُحدد نقاط ضعف محددة." : "No specific weaknesses identified."}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {language === "ar" ? "التوصيات الشخصية" : "Personalized Recommendations"}
              </CardTitle>
              <CardDescription>{language === "ar" ? "إليك كيفية تحسين لغتك الإنجليزية" : "Here's how to improve your English"}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-foreground pt-0.5">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CEFR Level Tips */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                {language === "ar" ? "نصائح لمستواك" : "Tips for Your Level"}
              </CardTitle>
              <CardDescription>{language === "ar" ? "نصائح عملية لتحسين مستوى" : "Practical tips to improve your"} {result.cefrLevel}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cefrTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <span className="text-lg">✨</span>
                    <span className="text-foreground text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {language === "ar" ? "هل أنت مستعد للتحسن؟" : "Ready to Improve?"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ar" ? "انضم إلى برنامجنا الشامل لتعلم اللغة الإنجليزية وحقق أهدافك" : "Join our comprehensive English learning program and reach your goals"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-border text-foreground hover:bg-card"
              >
                {language === "ar" ? "أعد الاختبار" : "Retake Test"}
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {language === "ar" ? "استكشف الدورات" : "Explore Courses"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-12">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Englishom. {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
