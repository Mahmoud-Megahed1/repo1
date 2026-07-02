import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTest } from "@/contexts/TestContext";
import { trpc } from "@/lib/trpc";
import { Loader2, Mic, Square } from "lucide-react";

interface Question {
  id: number;
  audioUrl?: string;
  questionText?: string;
  correctAnswer: string;
}

export default function VocalChallenge() {
  const { addAnswer, nextStage, completeTest } = useTest();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getQuestionsQuery = trpc.test.getQuestionsByStage.useQuery({
    stage: "vocal_challenge",
    limit: 5,
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setRecordedAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleAutoSubmit = () => {
    if (isRecording) {
      stopRecording();
    }
    setAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      addAnswer({
        questionId: currentQuestion.id,
        stage: "vocal_challenge",
        userAnswer: recordedAudio ? "audio_recorded" : null,
        isCorrect: !!recordedAudio,
        timeSpent: (questions[currentQuestionIndex].timeLimit || 30) * 1000,
      });
    }
  };

  const handleSubmit = () => {
    if (isRecording) {
      stopRecording();
    }
    setAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion) {
      addAnswer({
        questionId: currentQuestion.id,
        stage: "vocal_challenge",
        userAnswer: recordedAudio ? "audio_recorded" : null,
        isCorrect: !!recordedAudio,
        timeSpent: ((questions[currentQuestionIndex].timeLimit || 30) - timeLeft) * 1000,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 30);
      setAnswered(false);
      setRecordedAudio(null);
    } else {
      window.dispatchEvent(new Event('testComplete'));
      if (typeof completeTest === 'function') completeTest();
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
              if (typeof completeTest === 'function') window.dispatchEvent(new Event('testComplete'));
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

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Vocal Challenge</h2>
        <p className="text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      {/* Timer */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
          <p className="text-4xl font-bold text-red-600">{timeLeft}s</p>
        </div>
      </div>

      {/* Play Audio */}
      {currentQuestion.audioUrl && (
        <div className="mb-6 flex justify-center">
          <audio
            src={currentQuestion.audioUrl}
            controls
            className="w-full max-w-sm"
          />
        </div>
      )}

      {/* Question Text */}
      {currentQuestion.questionText && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium text-gray-800">{currentQuestion.questionText}</p>
        </div>
      )}

      {/* Recording Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
        {isRecording && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <p className="text-blue-600 font-medium">Recording...</p>
          </div>
        )}
        {recordedAudio && !isRecording && (
          <p className="text-green-600 font-medium">✓ Recording saved</p>
        )}
        {!isRecording && !recordedAudio && (
          <p className="text-gray-600">Ready to record</p>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex gap-3 mb-6">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={answered}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </Button>
        )}
      </div>

      {/* Submit Button */}
      {!isRecording && (
        <Button
          onClick={handleSubmit}
          disabled={answered}
          className="w-full bg-red-600 hover:bg-red-700 text-white mb-6"
        >
          Submit Answer
        </Button>
      )}

      {/* Next Button */}
      {answered && (
        <Button
          onClick={handleNext}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Test"}
        </Button>
      )}
    </div>
  );
}
