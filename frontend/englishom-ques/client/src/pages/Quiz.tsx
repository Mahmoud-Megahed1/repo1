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

import { getLoginUrl } from "@/const";

declare global {
  interface Window {
    google?: any;
  }
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

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
  const { user } = useAuth();
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

  // Pre-fill user data if already logged in with Google
  useEffect(() => {
    if (user) {
      if (user.email && !studentPhone) setStudentPhone(user.email);
      if (user.name && !studentName) setStudentName(user.name);
    }
  }, [user]);

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

  const { data: contactLookup } = trpc.quiz.lookupStudentContact.useQuery(
    { contact: studentPhone },
    { enabled: studentPhone.trim().length >= 4 }
  );

  useEffect(() => {
    if (contactLookup?.exists && contactLookup.studentName && !studentName) {
      setStudentName(contactLookup.studentName);
    }
  }, [contactLookup]);

  // Restore pending quiz after returning from Google Login
  useEffect(() => {
    try {
      const pendingRaw = localStorage.getItem("englishom_pending_quiz");
      if (pendingRaw && user) {
        const pending = JSON.parse(pendingRaw);
        localStorage.removeItem("englishom_pending_quiz");

        const googleEmail = user.email || "";
        const googleName = user.name || user.email || "Google Student";

        setStudentPhone(googleEmail);
        setStudentName(googleName);
        setSelectedLevel(pending.selectedLevel);
        userAnswersRef.current = pending.userAnswers || [];

        submitResult({
          level: pending.selectedLevel,
          answers: pending.userAnswers || [],
          averageResponseTime: pending.averageResponseTime,
          totalTimeSpent: pending.totalTimeSpent,
          studentName: googleName,
          studentPhone: googleEmail,
        });

        setState("results");
      }
    } catch (e) {
      console.error("Failed to submit pending Google quiz", e);
    }
  }, [user]);

  const isGisInitializedRef = useRef(false);

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const payload = parseJwt(response.credential);
      if (payload && payload.email) {
        const googleEmail = payload.email;
        const googleName = payload.name || payload.given_name || googleEmail.split("@")[0];

        setStudentPhone(googleEmail);
        setStudentName(googleName);

        submitResult({
          level: selectedLevel,
          answers: userAnswersRef.current,
          averageResponseTime: results?.averageResponseTime || 0,
          totalTimeSpent: results?.totalTimeSpent || 0,
          studentName: googleName,
          studentPhone: googleEmail,
        });

        setState("results");
        toast.success(
          language === "ar"
            ? `أهلاً بك (${googleName})! تم حفظ النتيجة بنجاح.`
            : `Welcome (${googleName})! Results saved.`
        );
      }
    } catch (e) {
      console.error("Failed to parse Google credential", e);
      toast.error(language === "ar" ? "تعذر تسجيل الدخول بواسطة جوجل" : "Failed to sign in with Google");
    }
  };

  useEffect(() => {
    const googleClientId = "624886421398-gsqv2b6r9vh4o8uirr18tckbv2r4saqc.apps.googleusercontent.com";
    if (state === "lead-capture" && window.google?.accounts?.id && googleClientId && !isGisInitializedRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        });
        isGisInitializedRef.current = true;
      } catch (e) {
        console.error("GIS init failed", e);
      }
    }
  }, [state]);

  const handleGoogleSignIn = () => {
    const googleClientId = "624886421398-gsqv2b6r9vh4o8uirr18tckbv2r4saqc.apps.googleusercontent.com";

    if (window.google?.accounts?.id && googleClientId) {
      if (!isGisInitializedRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
          isGisInitializedRef.current = true;
        } catch (e) {
          console.error("GIS init failed", e);
        }
      }
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap fails due to origin restriction or user dismiss, offer direct email input
          const promptEmail = window.prompt(
            language === "ar"
              ? "أدخل البريد الإلكتروني لحساب جوجل الخاص بك للتسجيل السريع:"
              : "Enter your Google email address for quick registration:"
          );
          if (promptEmail && promptEmail.includes("@")) {
            const defaultName = promptEmail.split("@")[0];
            setStudentPhone(promptEmail);
            setStudentName(defaultName);

            submitResult({
              level: selectedLevel,
              answers: userAnswersRef.current,
              averageResponseTime: results?.averageResponseTime || 0,
              totalTimeSpent: results?.totalTimeSpent || 0,
              studentName: defaultName,
              studentPhone: promptEmail,
            });

            setState("results");
            toast.success(
              language === "ar"
                ? `تم الربط بحساب (${promptEmail}) بنجاح!`
                : `Linked to (${promptEmail}) successfully!`
            );
          }
        }
      });
    } else {
      const promptEmail = window.prompt(
        language === "ar"
          ? "أدخل البريد الإلكتروني لحساب جوجل الخاص بك للتسجيل السريع:"
          : "Enter your Google email address for quick registration:"
      );
      if (promptEmail && promptEmail.includes("@")) {
        const defaultName = promptEmail.split("@")[0];
        setStudentPhone(promptEmail);
        setStudentName(defaultName);

        submitResult({
          level: selectedLevel,
          answers: userAnswersRef.current,
          averageResponseTime: results?.averageResponseTime || 0,
          totalTimeSpent: results?.totalTimeSpent || 0,
          studentName: defaultName,
          studentPhone: promptEmail,
        });

        setState("results");
        toast.success(
          language === "ar"
            ? `تم الربط بحساب (${promptEmail}) بنجاح!`
            : `Linked to (${promptEmail}) successfully!`
        );
      }
    }
  };

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
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/10 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/10 blur-[120px]" />
        </div>

        <Card className="w-full max-w-lg p-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-xl border-t-4 border-t-[#4A3B32] dark:border-t-[#FCDFC2] rounded-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4A3B32]/10 text-[#4A3B32] dark:bg-[#FCDFC2]/15 dark:text-[#FCDFC2] mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">
              {language === "ar" ? "أنت جاهز لرؤية النتيجة!" : "Your Results Are Ready!"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {language === "ar" ? "أدخل بياناتك بالأسفل لحفظ نتيجة الاختبار واستعراض تقريرك التفصيلي." : "Enter your details below to save your test results and view your detailed report."}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full py-6 rounded-xl font-bold gap-3 border-border hover:bg-muted/80 shadow-sm flex items-center justify-center text-foreground transition-all"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{language === "ar" ? "سجل دخول بحساب جوجل" : "Sign in with Google"}</span>
            </Button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-3 text-xs text-muted-foreground whitespace-nowrap uppercase font-semibold">
                {language === "ar" ? "أو أدخل بياناتك يدويّاً" : "Or enter details manually"}
              </span>
              <div className="border-t border-border w-full" />
            </div>
          </div>

          <form onSubmit={handleLeadCaptureSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block">
                {language === "ar" ? "رقم الموبايل أو البريد الإلكتروني" : "Phone Number or Email Address"}
              </label>
              <input
                type="text"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder={language === "ar" ? "مثال: 01012345678 أو email@example.com" : "e.g., 01012345678 or email@example.com"}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#4A3B32] dark:focus:ring-[#FCDFC2] transition-all text-start"
                dir="ltr"
              />
            </div>

            {/* Smart Lookup Memory Alert */}
            {studentPhone.trim().length >= 4 && (
              contactLookup?.exists ? (
                <div className="p-3.5 bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 border border-[#4A3B32]/30 dark:border-[#FCDFC2]/40 rounded-xl text-xs font-bold text-[#4A3B32] dark:text-[#FCDFC2] flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current shrink-0" />
                  <span>
                    {language === "ar"
                      ? `مرحباً بعودتك! تم العثور على سجل سابق باسم (${contactLookup.studentName}). سيتم ربط النتيجة بسجلك فوراً.`
                      : `Welcome back! Found existing record for (${contactLookup.studentName}). Results will be linked automatically.`}
                  </span>
                </div>
              ) : studentPhone.trim().length >= 6 ? (
                <div className="p-3.5 bg-muted/70 border border-border rounded-xl text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#4A3B32] dark:text-[#FCDFC2] shrink-0" />
                  <span>
                    {language === "ar"
                      ? "أهلاً بك معنا لأول مرة! يرجى كتابة اسمك بالأسفل لإنشاء ملف إنجازاتك."
                      : "Welcome! First time using this contact details. Please enter your name below."}
                  </span>
                </div>
              ) : null
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground block">
                {language === "ar" ? "الاسم بالكامل" : "Full Name"}
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={language === "ar" ? "اكتب اسمك هنا..." : "Enter your full name"}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#4A3B32] dark:focus:ring-[#FCDFC2] transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base font-bold bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] rounded-xl shadow-md transition-all mt-2"
              size="lg"
            >
              {language === "ar" ? "إظهار نتيجتي وتقييمي المفصل" : "Show My Results & Evaluation"}
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
