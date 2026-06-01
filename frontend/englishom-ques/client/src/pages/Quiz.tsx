import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ChevronLeft, Globe, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/../../shared/timing";

type QuizState = "loading" | "level-select" | "quiz" | "results";

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
      score: 0, // Will be updated by server response
      totalQuestions: questions.length,
      accuracy: 0, // Will be updated by server response
      averageResponseTime: avgResponseTime,
      totalTimeSpent: Math.floor(totalTime / 1000),
    };
    setResults(result);
    setState("results");

    submitResult({
      level: selectedLevel as any,
      answers: userAnswersRef.current,
      averageResponseTime: avgResponseTime,
      totalTimeSpent: Math.floor(totalTime / 1000),
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
  // Show loading state while fetching questions
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
    const levelDescriptions: Record<string, { time: string }> = {
      A1: { time: "15s per question" },
      A2: { time: "12s per question" },
      B1: { time: "10s per question" },
      B2: { time: "8s per question" },
      C1: { time: "6s per question" },
      C2: { time: "5s per question" },
    };

    return (
      <div className={`min-h-screen flex flex-col bg-background p-4 ${language === "ar" ? "rtl" : "ltr"}`}>
        {/* Header with Language and Theme Toggle */}
        <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t("quiz.back")}
          </Button>
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
            <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
              {t("quiz.levelSelect")}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {t("quiz.levelSelect")}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => {
                const info = levelDescriptions[level];
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedLevel === level
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-lg font-semibold text-foreground">{level}</p>
                      <p className="text-xs text-accent mt-1">{levelDescriptions[level].time}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setState("loading")}
              disabled={questionsLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3"
            >
              {questionsLoading ? t("quiz.loading") : t("quiz.startQuiz")}
            </Button>
          </Card>
        </div>
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
                <p className="text-sm font-semibold text-accent mb-2">🏆 {t("quiz.achievement")}</p>
                <div className="flex gap-2 flex-wrap">
                  {results.accuracy === 100 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">⭐ {t("quiz.perfectScore")}</span>
                  )}
                  {results.accuracy >= 90 && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">🎯 {t("quiz.highAccuracy")}</span>
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
                  𝕏
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
                  💬
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
                  f
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={resetQuiz}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {t("quiz.tryAgain")}
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
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
