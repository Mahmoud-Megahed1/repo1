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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px]" />
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-xl w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30 mb-6 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-700 bg-clip-text text-transparent mb-3 tracking-tight">
              Englishom
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Placement Test</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl px-4 py-6 text-lg transition-all hover:bg-white dark:hover:bg-slate-900"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] z-0"></div>
        <div className="glass-card rounded-3xl shadow-xl p-10 max-w-md w-full text-center relative z-10 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-6 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Test Completed!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Analyzing your responses and calculating results...</p>
          <div className="flex justify-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
          </div>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col min-h-[90vh]">
        {/* Header */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Englishom</h1>
          </div>
          <div className="glass px-5 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{studentName}</p>
          </div>
        </header>

        {/* Progress System */}
        <div className="mb-10">
          <div className="flex items-end justify-between mb-4 px-2">
            <div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1 tracking-wide uppercase">Current Stage</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{stageNames[stageIndex]}</h2>
            </div>
            <p className="text-lg font-bold text-slate-400 dark:text-slate-500">{stageIndex + 1} <span className="text-sm font-medium">/ 5</span></p>
          </div>
          
          <div className="relative pt-6">
            <Progress value={getStageProgress()} className="h-2 bg-slate-200 dark:bg-slate-800" />
            <div className="absolute top-0 left-0 w-full flex justify-between px-[2%]">
              {stageNames.map((name, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm ${
                    index < stageIndex
                      ? "bg-emerald-500 text-white border-2 border-slate-50 dark:border-slate-950 scale-100"
                      : index === stageIndex
                      ? `bg-indigo-600 text-white border-4 border-indigo-100 dark:border-indigo-900 scale-125`
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-2 border-slate-50 dark:border-slate-950 scale-100"
                  }`}
                >
                  {index < stageIndex ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> : index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Content Container */}
        <div className="flex-1">
          <div className="glass-card rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden">
            {/* Very subtle noise texture for premium feel */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none mix-blend-overlay" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}></div>
            
            <div className="relative z-10 flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
              {currentStage === "visual_recognition" && <VisualRecognition />}
              {currentStage === "auditory_processing" && <AuditoryProcessing />}
              {currentStage === "spelling_structure" && <SpellingStructure />}
              {currentStage === "reading_sprint" && <ReadingSprint />}
              {currentStage === "vocal_challenge" && <VocalChallenge />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
