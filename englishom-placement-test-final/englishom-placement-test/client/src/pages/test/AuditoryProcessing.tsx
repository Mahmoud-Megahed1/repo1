import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTest } from "@/contexts/TestContext";
import { trpc } from "@/lib/trpc";
import { Loader2, Volume2 } from "lucide-react";

interface Question {
  id: number;
  audioUrl?: string;
  correctAnswer: string;
  options?: string;
}

export default function AuditoryProcessing() {
  const { addAnswer, nextStage } = useTest();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playCount, setPlayCount] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const getQuestionsQuery = trpc.test.getQuestionsByStage.useQuery({
    stage: "auditory_processing",
    limit: 10,
  });

  useEffect(() => {
    if (getQuestionsQuery.data) {
      setQuestions(getQuestionsQuery.data);
      setIsLoading(false);
      if (getQuestionsQuery.data.length > 0) setTimeLeft(getQuestionsQuery.data[0].timeLimit || 30);
    }
  }, [getQuestionsQuery.data]);

  useEffect(() => {
    if (!answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleAutoSubmit();
    }
  }, [timeLeft, answered]);

  const handleAutoSubmit = () => {
    setAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      addAnswer({
        questionId: currentQuestion.id,
        stage: "auditory_processing",
        userAnswer: selectedAnswer || null,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
        timeSpent: (questions[currentQuestionIndex].timeLimit || 30) * 1000,
      });
    }
  };

  const playAudio = () => {
    if (playCount < 2) {
      const audio = new Audio(questions[currentQuestionIndex]?.audioUrl);
      audio.play();
      setPlayCount(playCount + 1);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion) {
      addAnswer({
        questionId: currentQuestion.id,
        stage: "auditory_processing",
        userAnswer: answer || null,
        isCorrect: answer === currentQuestion.correctAnswer,
        timeSpent: ((questions[currentQuestionIndex].timeLimit || 30) - timeLeft) * 1000,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 30);
      setAnswered(false);
      setSelectedAnswer(null);
      setPlayCount(0);
    } else {
      nextStage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 mb-6">No questions available for this stage.</p>
        <button 
          onClick={() => {
            if (stageIndex < 4) {
              nextStage();
            } else {
              window.dispatchEvent(new Event('testComplete'));
              if (typeof completeTest === 'function') completeTest();
            }
          }}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          Continue to Next Stage
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion.options ? JSON.parse(currentQuestion.options) : [];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Auditory Processing</h2>
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Timer */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
          <p className="text-4xl font-bold text-green-600">{timeLeft}s</p>
        </div>
      </div>

      {/* Play Audio Button */}
      <div className="mb-6 flex justify-center">
        <Button
          onClick={playAudio}
          disabled={playCount >= 2}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Volume2 className="w-5 h-5" />
          Play Audio ({playCount}/2)
        </Button>
      </div>

      {/* Image Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={`p-4 rounded-lg border-2 transition-all overflow-hidden ${
              selectedAnswer === option
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            } ${answered ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {option.startsWith("http") ? (
              <img src={option} alt="Option" className="w-full h-32 object-cover rounded" />
            ) : (
              <span className="font-medium">{option}</span>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      {answered && (
        <Button
          onClick={handleNext}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Next Stage"}
        </Button>
      )}
    </div>
  );
}
