import React, { createContext, useContext, useState, ReactNode } from "react";

export type TestStage = "visual_recognition" | "auditory_processing" | "spelling_structure" | "reading_sprint" | "vocal_challenge";

export interface TestAnswer {
  questionId: number;
  stage: TestStage;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface TestContextType {
  currentStage: TestStage;
  stageIndex: number;
  answers: TestAnswer[];
  studentName: string;
  studentEmail: string;
  testStarted: boolean;
  testCompleted: boolean;
  stageScores: Record<TestStage, number>;

  setCurrentStage: (stage: TestStage) => void;
  nextStage: () => void;
  addAnswer: (answer: TestAnswer) => void;
  setStudentInfo: (name: string, email: string) => void;
  startTest: () => void;
  completeTest: () => void;
  resetTest: () => void;
  getStageProgress: () => number;
  calculateStageScore: (stage: TestStage) => number;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const STAGES: TestStage[] = [
  "visual_recognition",
  "auditory_processing",
  "spelling_structure",
  "reading_sprint",
  "vocal_challenge",
];

export function TestProvider({ children }: { children: ReactNode }) {
  const [currentStage, setCurrentStage] = useState<TestStage>("visual_recognition");
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [stageScores, setStageScores] = useState<Record<TestStage, number>>({
    visual_recognition: 0,
    auditory_processing: 0,
    spelling_structure: 0,
    reading_sprint: 0,
    vocal_challenge: 0,
  });

  const stageIndex = STAGES.indexOf(currentStage);

  const handleSetCurrentStage = (stage: TestStage) => {
    setCurrentStage(stage);
  };

  const handleNextStage = () => {
    if (stageIndex < STAGES.length - 1) {
      const nextStage = STAGES[stageIndex + 1];
      setCurrentStage(nextStage);
    } else {
      setTestCompleted(true);
    }
  };

  const handleAddAnswer = (answer: TestAnswer) => {
    setAnswers((prev) => [...prev, answer]);
  };

  const handleSetStudentInfo = (name: string, email: string) => {
    setStudentName(name);
    setStudentEmail(email);
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleCompleteTest = () => {
    setTestCompleted(true);
  };

  const handleResetTest = () => {
    setCurrentStage("visual_recognition");
    setAnswers([]);
    setStudentName("");
    setStudentEmail("");
    setTestStarted(false);
    setTestCompleted(false);
    setStageScores({
      visual_recognition: 0,
      auditory_processing: 0,
      spelling_structure: 0,
      reading_sprint: 0,
      vocal_challenge: 0,
    });
  };

  const getStageProgress = () => {
    return ((stageIndex + 1) / STAGES.length) * 100;
  };

  const calculateStageScore = (stage: TestStage): number => {
    const stageAnswers = answers.filter((a) => a.stage === stage);
    if (stageAnswers.length === 0) return 0;
    const correctCount = stageAnswers.filter((a) => a.isCorrect).length;
    return Number(((correctCount / stageAnswers.length) * 100).toFixed(2));
  };

  const value: TestContextType = {
    currentStage,
    stageIndex,
    answers,
    studentName,
    studentEmail,
    testStarted,
    testCompleted,
    stageScores,
    setCurrentStage: handleSetCurrentStage,
    nextStage: handleNextStage,
    addAnswer: handleAddAnswer,
    setStudentInfo: handleSetStudentInfo,
    startTest: handleStartTest,
    completeTest: handleCompleteTest,
    resetTest: handleResetTest,
    getStageProgress,
    calculateStageScore,
  };

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest() {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useTest must be used within TestProvider");
  }
  return context;
}
