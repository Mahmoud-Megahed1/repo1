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
  correctAnswer: string;
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
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);

  const { mutate: submitResult } = trpc.quiz.submitTestResult.useMutation({
    onSuccess: () => {
      console.log('Result submitted successfully');
      // Silent success for guests
    },
    onError: (error) => {
      console.log('Result submission error:', error);
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
  
  // Log when questions are loaded
  useEffect(() => {
    if (questionsData?.length) {
      console.log('Questions query success:', questionsData.length, 'questions loaded');
    }
  }, [questionsData]);
  
  useEffect(() => {
    if (questionsError) {
      console.log('Questions query error:', questionsError);
    }
  }, [questionsError]);

  useEffect(() => {
    console.log('Questions data changed:', { questionsDataLength: questionsData?.length, state });
    if (questionsData && questionsData.length > 0 && state === "loading") {
      console.log('Loading questions:', questionsData);
      console.log('First question correctAnswer:', questionsData[0].correctAnswer, 'Type:', typeof questionsData[0].correctAnswer);
      setQuestions(questionsData);
      setTimeRemaining(questionsData[0].timePerQuestion);
      setState("quiz");
      setQuizStartTime(Date.now());
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
    console.log('Time expired for question:', currentQuestionIndex);
    if (!answered) {
      setAnswered(true);
      setResponseTimes([...responseTimes, questions[currentQuestionIndex].timePerQuestion]);
      setTimeout(moveToNextQuestion, 1000);
    }
  };

  const handleAnswerSelect = (choice: string) => {
    if (answered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = choice === currentQuestion.correctAnswer;
    const responseTime = currentQuestion.timePerQuestion - timeRemaining;

    // Debug logging
    console.log('=== ANSWER SELECTED ===');
    console.log('Question ID:', currentQuestion.id);
    console.log('Question:', currentQuestion.question);
    console.log('Correct Answer (from DB):', currentQuestion.correctAnswer, 'Type:', typeof currentQuestion.correctAnswer);
    console.log('User Choice:', choice, 'Type:', typeof choice);
    console.log('Are they equal?', choice === currentQuestion.correctAnswer);
    console.log('Char codes - Choice:', choice.charCodeAt(0), 'Correct:', currentQuestion.correctAnswer.charCodeAt(0));
    console.log('Full Question Object:', currentQuestion);
    console.log('Current Score Before:', score);

    setSelectedAnswer(choice);
    setAnswered(true);
    setResponseTimes([...responseTimes, responseTime]);

    if (isCorrect) {
      correctAnswersRef.current += 1;
      console.log('✅ CORRECT! Correct answers count:', correctAnswersRef.current);
      setScore(correctAnswersRef.current);
    } else {
      console.log('❌ INCORRECT! Correct answers count stays at:', correctAnswersRef.current);
    }

    setTimeout(moveToNextQuestion, 1500);
  };

  const moveToNextQuestion = () => {
    console.log('Moving to next question. Current:', currentQuestionIndex, 'Total:', questions.length);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      console.log('Quiz finished!');
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalTime = Date.now() - (quizStartTime || Date.now());
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const finalScore = correctAnswersRef.current;
    const accuracy = Math.round((finalScore / questions.length) * 100);

    console.log('=== QUIZ FINISHED ===');
    console.log('Final Score (from ref):', finalScore);
    console.log('Total Questions:', questions.length);
    console.log('Accuracy:', accuracy);
    console.log('Response Times:', responseTimes);

    const result: QuizResult = {
      score: finalScore,
      totalQuestions: questions.length,
      accuracy,
      averageResponseTime: avgResponseTime / 1000,
      totalTimeSpent: Math.floor(totalTime / 1000),
    };
    console.log('Final Result:', result);
    setResults(result);
    setState("results");

    console.log('Submitting result:', { level: selectedLevel, totalQuestions: questions.length, correctAnswers: finalScore, accuracy });
    submitResult({
      level: selectedLevel as any,
      totalQuestions: questions.length,
      correctAnswers: finalScore,
      accuracy,
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
    setResponseTimes([]);
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
    const completedTime = responseTimes.reduce((sum, t) => sum + t, 0);
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
                const isCorrect = choice === currentQuestion.correctAnswer;
                const isSelected = selectedAnswer === choice;

                return (
                  <button
                    key={choice}
                    onClick={() => handleAnswerSelect(choice)}
                    disabled={answered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answered
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : isSelected
                          ? "border-red-500 bg-red-50 dark:bg-red-950"
                          : "border-border bg-muted"
                        : isSelected
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

            {/* Score Display */}
            <div className="text-center text-muted-foreground mt-6">
              {t("quiz.score")}: <span className="font-bold text-foreground">{score}/{currentQuestionIndex + 1}</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "results" && results) {
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
