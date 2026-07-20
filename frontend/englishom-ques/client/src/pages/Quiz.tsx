import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ChevronLeft, Globe, Moon, Sun, Trophy, Star, Target, Twitter, MessageCircle, Facebook, Wind, Radio, Rocket, Flame, AlertTriangle, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/../../shared/timing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type QuizState = "loading" | "level-select" | "quiz" | "lead-capture" | "results";

interface QuizQuestion {
  id: number;
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  level: string;
  timePerQuestion: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  accuracy: number;
  averageResponseTime: number;
  totalTimeSpent: number;
}

export default function Quiz() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [, navigate] = useLocation();
  
  // Auto-start quiz with A1 level by default
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const levelFromUrl = urlParams.get('level')?.toUpperCase();
  const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const initialLevel = levelFromUrl && validLevels.includes(levelFromUrl) ? levelFromUrl : 'A1';
  
  // Show level selection screen first
  const [state, setState] = useState<QuizState>("level-select");
  const [selectedLevel, setSelectedLevel] = useState<string>(initialLevel);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const correctAnswersRef = useRef(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const userAnswersRef = useRef<{questionId: number, userAnswer: string}[]>([]);
  const responseTimesRef = useRef<number[]>([]);

  const { mutate: submitResult, isPending: isSubmitting } = trpc.quiz.submitTestResult.useMutation({
    onSuccess: (data) => {
      if (data.score !== undefined) {
        setScore(data.score);
        correctAnswersRef.current = data.score;
        setResults(prev => prev ? { ...prev, score: data.score, accuracy: data.accuracy ?? 0 } : null);
      }
    },
    onError: () => {
      // Silent error for guests
    },
  });

  const { data: questionsData, isLoading: questionsLoading, error: questionsError } = trpc.quiz.getQuestionsByLevel.useQuery(
    { level: selectedLevel as any, limit: 10 },
    { enabled: state === "loading", retry: 2 }
  );

  // Auto-load questions when user selects a level
  useEffect(() => {
    if (state === "level-select") {
      // Just show the level selection screen, don't auto-load
    }
  }, []);

  useEffect(() => {
    if (questionsData && state === "loading") {
      if (questionsData.length > 0) {
        setQuestions(questionsData);
        setTimeRemaining(questionsData[0].timePerQuestion);
        setState("quiz");
        setQuizStartTime(Date.now());
      } else {
        toast.error(t("admin.noQuestions"));
        setState("level-select");
      }
    }
  }, [questionsData, state]);

  useEffect(() => {
    if (state !== "quiz" || !questions.length) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Set initial time for this question
    setTimeRemaining(currentQuestion.timePerQuestion);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeExpired();
          return currentQuestion.timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, currentQuestionIndex, questions, answered]);

  const handleTimeExpired = () => {
    if (!answered) {
      setAnswered(true);
      responseTimesRef.current.push(questions[currentQuestionIndex].timePerQuestion);
      setTimeout(moveToNextQuestion, 1000);
    }
  };

  const handleAnswerSelect = (choice: string) => {
    if (answered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const responseTime = currentQuestion.timePerQuestion - timeRemaining;

    setSelectedAnswer(choice);
    setAnswered(true);
    responseTimesRef.current.push(responseTime);
    userAnswersRef.current.push({ questionId: currentQuestion.id, userAnswer: choice });

    setTimeout(moveToNextQuestion, 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalTime = Date.now() - (quizStartTime || Date.now());
    const times = responseTimesRef.current;
    const avgResponseTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;

    const result: QuizResult = {
      score: 0,
      totalQuestions: questions.length,
      accuracy: 0,
      averageResponseTime: avgResponseTime,
      totalTimeSpent: Math.floor(totalTime / 1000),
    };
    setResults(result);
    // Go to lead capture instead of results immediately
    setState("lead-capture");
  };

  const handleLeadCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      toast.error(language === "ar" ? "يرجى إدخال جميع البيانات المطلوبة" : "Please fill in all required fields");
      return;
    }

    // Save to localStorage for history retrieval
    try {
      localStorage.setItem("englishom_student_phone", studentPhone.trim());
      localStorage.setItem("englishom_student_name", studentName.trim());
    } catch (e) {
      console.error(e);
    }

    setState("results");
    
    submitResult({
      level: selectedLevel as any,
      answers: userAnswersRef.current,
      averageResponseTime: results?.averageResponseTime,
      totalTimeSpent: results?.totalTimeSpent,
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
    });
  };

  const resetQuiz = () => {
    setSelectedLevel("A1");
    setState("level-select");
    setCurrentQuestionIndex(0);
    setScore(0);
    correctAnswersRef.current = 0;
    setTimeRemaining(10);
    setSelectedAnswer(null);
    setAnswered(false);
    responseTimesRef.current = [];
    userAnswersRef.current = [];
    setResults(null);
    setTotalTimeSpent(0);
    setQuizStartTime(null);
    setStudentName("");
    setStudentPhone("");
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / (questions[currentQuestionIndex]?.timePerQuestion || 10)) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateTotalQuizTime = () => {
    return questions.reduce((sum, q) => sum + (q.timePerQuestion || 10), 0);
  };

  const calculateRemainingTime = () => {
    const completedTime = responseTimesRef.current.reduce((sum, t) => sum + t, 0);
    const currentQuestionTime = answered ? 0 : (questions[currentQuestionIndex]?.timePerQuestion || 10) - timeRemaining;
    const spent = completedTime + currentQuestionTime;
    const total = calculateTotalQuizTime();
    return Math.max(0, total - spent);
  };

  // Level Selection Screen
  if (state === "loading" && questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
        <Card className="p-8">
          <p className="text-foreground text-center">{t("quiz.loading")}</p>
        </Card>
      </div>
    );
  }

  if (state === "level-select") {
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

    return (
      <div className={`min-h-screen flex flex-col justify-between bg-background ${language === "ar" ? "rtl" : "ltr"}`}>
        <Header />

        <div className="flex items-center justify-center flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <Card className="w-full max-w-4xl p-6 md:p-8 border border-border shadow-xl rounded-2xl">
            <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2 text-center">
              {language === "ar" ? "اختر مستوى اللغة الإنجليزية الخاص بك واختبر معرفتك" : "Choose your English level & test your knowledge"}
            </h1>
            <p className="text-center text-muted-foreground mb-8 text-sm md:text-base italic">
              {language === "ar" ? '"اضبط بوصلة وقتك.. وتتبع رحلة عقلك من الهدوء إلى الطلاقة"' : '"Set your timing compass.. track your journey from calm to fluency"'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {customLevels.map((lvl) => {
                const isSelected = selectedLevel === lvl.code;
                const IconComp = lvl.icon;
                return (
                  <button
                    key={lvl.code}
                    type="button"
                    onClick={() => setSelectedLevel(lvl.code)}
                    className={`p-5 rounded-2xl border-2 transition-all text-start flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? "border-[#4A3B32] dark:border-[#FCDFC2] bg-[#F7F2ED] dark:bg-[#251E19] shadow-lg ring-2 ring-[#4A3B32]/20 dark:ring-[#FCDFC2]/30"
                        : "border-border hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl transition-colors ${
                          isSelected 
                            ? "bg-[#4A3B32] text-[#FCDFC2] dark:bg-[#FCDFC2] dark:text-[#120F0D]" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-base md:text-lg text-foreground">
                          {language === "ar" ? lvl.titleAr : lvl.titleEn}
                        </h3>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-lg transition-colors ${
                        isSelected 
                          ? "bg-[#4A3B32] text-[#FCDFC2] dark:bg-[#FCDFC2] dark:text-[#120F0D]" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {lvl.code}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {language === "ar" ? lvl.descAr : lvl.descEn}
                    </p>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setState("loading")}
              disabled={questionsLoading}
              className="w-full bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-extrabold py-6 text-lg rounded-xl shadow-xl transition-all hover:scale-[1.01]"
            >
              {questionsLoading ? t("quiz.loading") : (language === "ar" ? "ابدأ الاختبار" : "Start Quiz")}
            </Button>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  // Quiz Screen
  if (state === "quiz" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuizTime = calculateTotalQuizTime();
    const remainingTime = calculateRemainingTime();
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <div className={`min-h-screen flex flex-col bg-background p-4 ${language === "ar" ? "rtl" : "ltr"}`}>
        {/* Header with Language and Theme Toggle */}
        <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto w-full">
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
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <Card className="w-full max-w-2xl p-8">
            {/* Progress Info */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-foreground">
                  {t("quiz.question")} {currentQuestionIndex + 1}/{questions.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("quiz.timeRemaining")}: {formatTime(remainingTime)}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <p className={`text-4xl font-bold ${getTimerColor()}`}>
                {timeRemaining}s
              </p>
            </div>

            {/* Question */}
            <Card className="p-6 mb-6 bg-muted/50">
              <p className="text-lg font-semibold text-foreground">{currentQuestion.question}</p>
            </Card>

            {/* Answer Options */}
            <div className="space-y-3">
              {["A", "B", "C", "D"].map((choice) => {
                const choiceText = currentQuestion[`choice${choice}` as keyof QuizQuestion];
                const isSelected = selectedAnswer === choice;

                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswerSelect(choice)}
                    disabled={answered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    } ${answered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                        {choice}
                      </div>
                      <span className="text-foreground">{choiceText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Score Display removed to prevent immediate feedback */}
          </Card>
        </div>
      </div>
    );
  }

  if (state === "lead-capture") {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden ${language === "ar" ? "rtl" : "ltr"}`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px]" />
        </div>

        <Card className="w-full max-w-lg p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-xl border-t-4 border-t-primary">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "لقد أتممت الاختبار بنجاح!" : "You've successfully completed the test!"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === "ar" ? "أدخل بياناتك بالأسفل لنعرض لك النتيجة فوراً." : "Enter your details below to see your results immediately."}
            </p>
          </div>

          <form onSubmit={handleLeadCaptureSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {language === "ar" ? "الاسم بالكامل" : "Full Name"}
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={language === "ar" ? "اكتب اسمك هنا" : "Enter your name"}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                {language === "ar" ? "رقم الموبايل أو الإيميل" : "Phone Number or Email"}
              </label>
              <input
                type="text"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder={language === "ar" ? "مثال: 01012345678" : "e.g., 01012345678"}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-left"
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              size="lg"
            >
              {language === "ar" ? "إظهار نتيجتي الآن" : "Show My Results Now"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (state === "results") {
    if (isSubmitting || !results) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
          <Card className="p-8 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-foreground text-center">Grading your test securely...</p>
          </Card>
        </div>
      );
    }

    return (
      <div className={`min-h-screen flex flex-col bg-background p-4 ${language === "ar" ? "rtl" : "ltr"}`}>
        {/* Header with Language and Theme Toggle */}
        <div className="flex justify-between items-center mb-8 max-w-md mx-auto w-full">
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
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <Card className="w-full max-w-md p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
              {t("quiz.complete")}
            </h1>
            <p className="text-4xl font-bold text-accent text-center mb-6">
              {results.accuracy}%
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("quiz.correctAnswers")}:</span>
                <span className="font-bold text-foreground">{results.score}/{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("quiz.timeSpent")}:</span>
                <span className="font-bold text-foreground">{formatTime(results.totalTimeSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("quiz.avgTime")}:</span>
                <span className="font-bold text-foreground">{results.averageResponseTime.toFixed(1)}s</span>
              </div>
            </div>

            {/* Achievements Section */}
            {results.accuracy >= 90 && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-lg animate-pulse">
                <p className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> {t("quiz.achievement")}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {results.accuracy === 100 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3" /> {t("quiz.perfectScore")}
                    </span>
                  )}
                  {results.accuracy >= 90 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded flex items-center gap-1">
                      <Target className="w-3 h-3" /> {t("quiz.highAccuracy")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-3">{t("quiz.shareResults")}</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const text = `I scored ${results.accuracy}% on EnglishOM Ques! 🎯`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="gap-1"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const text = `I scored ${results.accuracy}% on EnglishOM Ques! 🎯`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const text = `I scored ${results.accuracy}% on EnglishOM Ques! 🎯`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, "_blank");
                  }}
                  className="gap-1"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/results")}
                className="w-full bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold py-6 text-base rounded-xl shadow-lg"
              >
                {language === "ar" ? "عرض كافة نتائجي ورجلة التقدم 📊" : "View Full Results & Progress Journey 📊"}
              </Button>
              <Button
                onClick={resetQuiz}
                variant="outline"
                className="w-full"
              >
                {t("quiz.tryAgain")}
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="w-full text-muted-foreground"
              >
                {t("quiz.backToHome")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
