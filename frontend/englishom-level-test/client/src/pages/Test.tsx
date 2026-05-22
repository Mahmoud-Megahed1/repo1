import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { AlertCircle, ChevronRight, Clock, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";
import { ar, en } from "@shared/translations";

interface Question {
  id: number;
  stage: number;
  questionText: string;
  imageUrl?: string;
  audioUrl?: string;
  options: string[];
  timeLimit?: number;
}

interface Answer {
  questionId: number;
  userAnswer: string;
  timeSpent: number;
}

const STAGES = [
  { id: 1, nameEn: "Vocabulary", nameAr: "المفردات", descriptionEn: "Visual word recognition", descriptionAr: "التعرف على الكلمات بصرياً" },
  { id: 2, nameEn: "Grammar", nameAr: "القواعد", descriptionEn: "Grammar and sentence structure", descriptionAr: "القواعد وبناء الجملة" },
  { id: 3, nameEn: "Reading", nameAr: "القراءة", descriptionEn: "Reading comprehension", descriptionAr: "فهم المقروء" },
  { id: 4, nameEn: "Listening", nameAr: "الاستماع", descriptionEn: "Audio comprehension", descriptionAr: "فهم المسموع" },
  { id: 5, nameEn: "Writing", nameAr: "الكتابة", descriptionEn: "Speaking and pronunciation", descriptionAr: "التحدث والنطق" },
];

const QUESTIONS_PER_STAGE = 10;
const STAGE_TIMERS = [30, 30, 45, 60, 30];

export default function Test() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(STAGE_TIMERS[0]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [soundAlertPlayed, setSoundAlertPlayed] = useState(false);
  const [totalTestTime, setTotalTestTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalQuestions = STAGES.length * QUESTIONS_PER_STAGE;
  const currentQuestionNumber = (currentStage - 1) * QUESTIONS_PER_STAGE + currentQuestionIndex + 1;
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  const { data: stageQuestions = [] } = trpc.test.getStageQuestions.useQuery(
    { stage: currentStage, limit: QUESTIONS_PER_STAGE },
    { enabled: currentStage > 0 }
  );

  const currentQuestion = stageQuestions[currentQuestionIndex];
  const submitTestMutation = trpc.test.submitTest.useMutation();

  // Calculate total test time from questions
  useEffect(() => {
    if (stageQuestions.length > 0) {
      const total = stageQuestions.reduce((sum, q) => sum + (q.timeLimit || STAGE_TIMERS[currentStage - 1]), 0);
      setTotalTestTime(total);
    }
  }, [stageQuestions, currentStage]);

  // Timer and sound alert logic
  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      // Play sound alert when 10 seconds left
      if (timeLeft === 10 && !soundAlertPlayed) {
        playWarningSound();
        setSoundAlertPlayed(true);
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !isAnswered && currentQuestion) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, currentQuestion, soundAlertPlayed]);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const playWarningSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log("Audio context not supported");
    }
  };

  const handleAnswer = (answer: string | null) => {
    if (!currentQuestion) return;
    setSoundAlertPlayed(false);

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        userAnswer: answer || "",
        timeSpent: (currentQuestion.timeLimit || STAGE_TIMERS[currentStage - 1]) - timeLeft,
      },
    ]);

    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < QUESTIONS_PER_STAGE - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(stageQuestions[currentQuestionIndex + 1]?.timeLimit || STAGE_TIMERS[currentStage - 1]);
      setSoundAlertPlayed(false);
    } else if (currentStage < STAGES.length) {
      setCurrentStage(currentStage + 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(STAGE_TIMERS[currentStage]);
      setSoundAlertPlayed(false);
    } else {
      await submitTest();
    }
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      await submitTestMutation.mutateAsync({
        sessionId,
        answers,
      });
      navigate(`/results/${sessionId}`);
    } catch (error) {
      console.error("Error submitting test:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{language === "ar" ? "جاري تحميل الأسئلة..." : "Loading questions..."}</p>
        </div>
      </div>
    );
  }

  const getProgressColor = () => {
    if (progressPercentage <= 25) return "#888888";
    if (progressPercentage <= 50) return "#CD7F32";
    if (progressPercentage <= 75) return "#C0C0C0";
    return "#FFD700";
  };

  const stageInfo = STAGES[currentStage - 1];
  const stageName = language === "ar" ? stageInfo.nameAr : stageInfo.nameEn;
  const stageDescription = language === "ar" ? stageInfo.descriptionAr : stageInfo.descriptionEn;
  const timeWarning = timeLeft <= 5;

  return (
    <div className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{stageName}</h1>
              <p className="text-sm text-muted-foreground">{stageDescription}</p>
            </div>
            <div className="flex gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeWarning ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'
              }`}>
                <Clock className={`w-5 h-5 ${timeWarning ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                <span className={`font-semibold ${
                  timeWarning ? 'text-red-600 dark:text-red-300' : 'text-blue-600 dark:text-blue-300'
                }`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "إجمالي" : "Total"}: {totalTestTime}s
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{language === "ar" ? "السؤال" : "Question"} {currentQuestionNumber} {language === "ar" ? "من" : "of"} {totalQuestions}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Question Type Badge */}
          <div className="mb-6">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {stageName}
            </span>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.questionText}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestion.imageUrl && (
                <img src={currentQuestion.imageUrl} alt="Question" className="w-full rounded-lg max-h-64 object-cover" />
              )}

              {currentQuestion.audioUrl && (
                <div className="flex items-center gap-2">
                  <audio controls className="w-full">
                    <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isAnswered) {
                        setSelectedAnswer(option);
                        handleAnswer(option);
                      }
                    }}
                    disabled={isAnswered}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === option
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    } ${isAnswered ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback Removed for Test Integrity */}
              {isAnswered && (
                <div className="text-center p-4 bg-muted/50 rounded-lg text-muted-foreground">
                  {language === "ar" ? "تم حفظ إجابتك. يرجى الانتقال للسؤال التالي." : "Answer recorded. Please proceed to the next question."}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          {isAnswered && (
            <div className="flex gap-4">
              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex-1"
              >
                {currentQuestionNumber === totalQuestions
                  ? language === "ar" ? "إنهاء الاختبار" : "Finish Test"
                  : language === "ar" ? "التالي" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
