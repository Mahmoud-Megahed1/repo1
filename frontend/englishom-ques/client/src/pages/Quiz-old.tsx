import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
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
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const [, navigate] = useLocation();
  
  const [state, setState] = useState<QuizState>("level-select");
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Fetch questions
  const { data: fetchedQuestions, isLoading: questionsLoading } = trpc.quiz.getQuestionsByLevel.useQuery(
    { level: selectedLevel as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", limit: 10 },
    { enabled: state === "quiz" }
  );

  // Submit results mutation
  const submitResultsMutation = trpc.quiz.submitTestResult.useMutation({
    onSuccess: () => {
      toast.success("Test results saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save test results");
    },
  });

  // Initialize quiz
  useEffect(() => {
    if (fetchedQuestions && state === "quiz") {
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setResponseTimes([]);
      setTotalTimeSpent(0);
      setQuizStartTime(Date.now());
      // Set time for first question
      if (fetchedQuestions.length > 0) {
        setTimeRemaining(fetchedQuestions[0].timePerQuestion || 10);
      }
    }
  }, [fetchedQuestions, state]);

  // Timer logic with dynamic timing per question and elapsed time tracking
  useEffect(() => {
    if (state !== "quiz" || questions.length === 0) return;

    const timer = setInterval(() => {
      // Update elapsed time
      if (quizStartTime) {
        setElapsedTime(Math.round((Date.now() - quizStartTime) / 1000));
      }

      // Update remaining time for current question
      if (!answered) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return questions[currentQuestionIndex]?.timePerQuestion || 10;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state, answered, questions, currentQuestionIndex, quizStartTime]);

  const handleTimeout = () => {
    setAnswered(true);
    setSelectedAnswer(null);
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = currentQuestion?.timePerQuestion || 10;
    setResponseTimes([...responseTimes, timeSpent]);
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  const handleAnswerSelect = (choice: string) => {
    if (answered) return;

    setSelectedAnswer(choice);
    setAnswered(true);

    const currentQuestion = questions[currentQuestionIndex];
    const responseTime = (currentQuestion?.timePerQuestion || 10) - timeRemaining;
    setResponseTimes([...responseTimes, responseTime]);

    if (choice === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = questions[nextIndex];
      setTimeRemaining(nextQuestion?.timePerQuestion || 10);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const accuracy = Math.round((score / questions.length) * 100);
    const avgTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;
    
    const totalTime = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0;

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      accuracy,
      averageResponseTime: avgTime,
      totalTimeSpent: totalTime,
    };

    setResults(result);
    setState("results");

    // Save results if user is authenticated
    if (user) {
      submitResultsMutation.mutate({
        level: selectedLevel as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        totalQuestions: questions.length,
        correctAnswers: score,
        accuracy,
        averageResponseTime: avgTime,
      });
    }
  };

  const startQuiz = () => {
    setState("quiz");
  };

  const restartQuiz = () => {
    setState("level-select");
    setSelectedLevel("A1");
    setScore(0);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8">
          <p className="text-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  // Level Selection Screen
  if (state === "level-select") {
    const levelDescriptions: Record<string, { desc: string; descAr: string; time: string }> = {
      A1: { desc: "Elementary proficiency", descAr: t("quiz.elementaryProficiency"), time: "15s per question" },
      A2: { desc: "Elementary proficiency", descAr: t("quiz.elementaryProficiency"), time: "12s per question" },
      B1: { desc: "Intermediate proficiency", descAr: t("quiz.intermediateProficiency"), time: "10s per question" },
      B2: { desc: "Upper-intermediate proficiency", descAr: t("quiz.upperIntermediateProficiency"), time: "8s per question" },
      C1: { desc: "Advanced proficiency", descAr: t("quiz.advancedProficiency"), time: "6s per question" },
      C2: { desc: "Mastery", descAr: t("quiz.mastery"), time: "5s per question" },
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

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
                    <p className="font-bold text-foreground text-lg">{level}</p>
                    <p className="text-sm text-muted-foreground">{language === "en" ? info.desc : info.descAr}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">
                      ⏱️ {info.time}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={startQuiz}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6"
          >
            {t("quiz.startQuiz")}
          </Button>
        </Card>
      </div>
    );
  }

  // Quiz Screen
  if (state === "quiz" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    const totalQuizTime = calculateTotalQuizTime();
    const remainingTime = calculateRemainingTime();

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-semibold text-muted-foreground">
                {t("quiz.question")} {currentQuestionIndex + 1} {t("quiz.of")} {questions.length}
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-muted-foreground">
                  ⏱️ {t("quiz.time")}: <span className="font-bold text-foreground">{formatTime(totalQuizTime)}</span>
                </div>
                <div className="text-muted-foreground">
                  ⏳ {t("quiz.remaining")}: <span className="font-bold text-foreground">{formatTime(remainingTime)}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-2 mb-4" />

            {/* Timer Display */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ⏱️ Elapsed: <span className="font-bold text-foreground">{formatTime(elapsedTime)}</span>
              </div>
              <div className={`text-3xl font-bold ${getTimerColor()}`}>
                {timeRemaining}s
              </div>
            </div>
          </div>

          {/* Question Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {currentQuestion.question}
            </h2>

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
          </Card>

          {/* Score Display */}
          <div className="text-center text-muted-foreground">
            {t("quiz.score")}: <span className="font-bold text-foreground">{score}/{currentQuestionIndex + 1}</span>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (state === "results" && results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {t("quiz.complete")}
          </h1>

          <div className="space-y-6 my-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">{t("quiz.score")}</p>
              <p className="text-5xl font-bold text-accent">
                {results.score}/{results.totalQuestions}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground text-sm mb-1">{t("quiz.accuracy")}</p>
                <p className="text-2xl font-bold text-foreground">{results.accuracy}%</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground text-sm mb-1">{t("quiz.avgTime")}</p>
                <p className="text-2xl font-bold text-foreground">{results.averageResponseTime}s</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg col-span-2">
                <p className="text-muted-foreground text-sm mb-1">Total Time</p>
                <p className="text-2xl font-bold text-foreground">{formatTime(results.totalTimeSpent)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={restartQuiz}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6"
            >
              {t("quiz.tryAnotherLevel")}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full py-6"
            >
              {t("quiz.backToHome")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
