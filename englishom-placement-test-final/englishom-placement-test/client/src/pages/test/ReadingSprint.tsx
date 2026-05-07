import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTest } from "@/contexts/TestContext";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface Question {
  id: number;
  questionText?: string;
  correctAnswer: string;
  options?: string;
}

export default function ReadingSprint() {
  const { addAnswer, nextStage } = useTest();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getQuestionsQuery = trpc.test.getQuestionsByStage.useQuery({
    stage: "reading_sprint",
    limit: 5,
  });

  useEffect(() => {
    if (getQuestionsQuery.data) {
      setQuestions(getQuestionsQuery.data);
      setIsLoading(false);
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
        stage: "reading_sprint",
        userAnswer: selectedAnswer || null,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer,
        timeSpent: 60000,
      });
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
        stage: "reading_sprint",
        userAnswer: answer || null,
        isCorrect: answer === currentQuestion.correctAnswer,
        timeSpent: (60 - timeLeft) * 1000,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
      setAnswered(false);
      setSelectedAnswer(null);
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
    return <div className="text-center text-red-500">No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion.options ? JSON.parse(currentQuestion.options) : [];

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reading Sprint</h2>
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Timer */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
          <p className="text-4xl font-bold text-purple-600">{timeLeft}s</p>
        </div>
      </div>

      {/* Reading Passage */}
      {currentQuestion.questionText && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-800 leading-relaxed text-lg">{currentQuestion.questionText}</p>
        </div>
      )}

      {/* Question */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-lg font-semibold text-gray-800">Choose the correct answer:</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            } ${answered ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      {answered && (
        <Button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Next Stage"}
        </Button>
      )}
    </div>
  );
}
