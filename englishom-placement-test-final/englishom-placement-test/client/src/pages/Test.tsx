import React, { useState, useEffect } from "react";
import { useTest } from "@/contexts/TestContext";
import { trpc } from "@/lib/trpc";
import VisualRecognition from "./test/VisualRecognition";
import AuditoryProcessing from "./test/AuditoryProcessing";
import SpellingStructure from "./test/SpellingStructure";
import ReadingSprint from "./test/ReadingSprint";
import VocalChallenge from "./test/VocalChallenge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";

export default function Test() {
  const [, navigate] = useLocation();
  const {
    currentStage,
    stageIndex,
    answers,
    studentName,
    studentEmail,
    testStarted,
    testCompleted,
    nextStage,
    setStudentInfo,
    startTest,
    completeTest,
    getStageProgress,
    calculateStageScore,
  } = useTest();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTestMutation = trpc.test.submitTest.useMutation();

  useEffect(() => {
    const handleNextStage = () => {
      nextStage();
    };

    const handleTestComplete = async () => {
      completeTest();
      setIsSubmitting(true);

      try {
        // Calculate per-stage scores
        const visualScore = calculateStageScore("visual_recognition");
        const auditoryScore = calculateStageScore("auditory_processing");
        const spellingScore = calculateStageScore("spelling_structure");
        const readingScore = calculateStageScore("reading_sprint");
        const vocalScore = calculateStageScore("vocal_challenge");

        const totalScore =
          (visualScore + auditoryScore + spellingScore + readingScore + vocalScore) / 5;

        // Submit test results
        const result = await submitTestMutation.mutateAsync({
          studentName,
          studentEmail,
          answers: answers.map((a) => ({
            ...a,
            userAnswer: a.userAnswer || "",
          })),
        });

        // Store result ID and scores for results page
        sessionStorage.setItem("testResultId", result.testId?.toString() || "");
        sessionStorage.setItem(
          "testScores",
          JSON.stringify({
            totalScore,
            visualScore,
            auditoryScore,
            spellingScore,
            readingScore,
            vocalScore,
          })
        );

        navigate("/results");
      } catch (error) {
        console.error("Error submitting test:", error);
        alert("Error submitting test. Please try again.");
        setIsSubmitting(false);
      }
    };

    window.addEventListener("nextStage", handleNextStage);
    window.addEventListener("testComplete", handleTestComplete);

    return () => {
      window.removeEventListener("nextStage", handleNextStage);
      window.removeEventListener("testComplete", handleTestComplete);
    };
  }, [stageIndex, answers, studentName, studentEmail, completeTest, nextStage, submitTestMutation, navigate, calculateStageScore]);

  const handleStartTest = () => {
    if (name.trim() && email.trim()) {
      setStudentInfo(name, email);
      startTest();
    } else {
      alert("Please enter your name and email");
    }
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">Englishom</h1>
            <p className="text-gray-600">Placement Test</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Test Overview:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ 5 Stages of Assessment</li>
              <li>✓ ~30-40 minutes total</li>
              <li>✓ Immediate results & feedback</li>
              <li>✓ No going back between stages</li>
            </ul>
          </div>

          <Button
            onClick={handleStartTest}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
          >
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (testCompleted || isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Test Completed!</h1>
          <p className="text-gray-600 mb-6">Processing your results...</p>
          <div className="animate-spin inline-block w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Color progression for progress indicator
  const getProgressColor = (index: number) => {
    if (index === 0) return "bg-gray-400";
    if (index === 1) return "bg-amber-700";
    if (index === 2) return "bg-gray-400";
    if (index === 3) return "bg-yellow-500";
    return "bg-yellow-600";
  };

  const stageNames = [
    "Visual Recognition",
    "Auditory Processing",
    "Spelling & Structure",
    "Reading Sprint",
    "Vocal Challenge",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Englishom Placement Test</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">Student: {studentName}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">{stageNames[stageIndex]}</p>
              <p className="text-sm text-gray-600">{stageIndex + 1}/5</p>
            </div>
            <Progress value={getStageProgress()} className="h-3" />
            <div className="flex justify-between mt-2">
              {stageNames.map((name, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    index < stageIndex
                      ? "bg-green-500 text-white"
                      : index === stageIndex
                      ? `${getProgressColor(index)} text-white`
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStage === "visual_recognition" && <VisualRecognition />}
          {currentStage === "auditory_processing" && <AuditoryProcessing />}
          {currentStage === "spelling_structure" && <SpellingStructure />}
          {currentStage === "reading_sprint" && <ReadingSprint />}
          {currentStage === "vocal_challenge" && <VocalChallenge />}
        </div>
      </div>
    </div>
  );
}
