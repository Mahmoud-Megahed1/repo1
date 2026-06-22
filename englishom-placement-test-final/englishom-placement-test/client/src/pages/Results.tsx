import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Trophy, Award, BarChart2, MessageSquare, User, Mail } from "lucide-react";

export default function Results() {
  const [, navigate] = useLocation();
  const [testId, setTestId] = useState<number | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("testResultId");
    if (id) {
      setTestId(Number(id));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const studentEmail = sessionStorage.getItem("studentEmail") || "student@example.com";
  const studentName = sessionStorage.getItem("studentName") || "Student";

  const { data, isLoading, error } = trpc.test.getResult.useQuery(
    { testId: testId || 0 },
    { enabled: !!testId }
  );

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">Loading your results...</div>
      </div>
    );
  }

  const { result, message } = data;
  const scores = result;

  const ScoreBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="text-slate-900 dark:text-slate-100">{Math.round(score)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-12 p-4 font-sans">
      <div className="max-w-3xl mx-auto w-full relative z-10">
        
        {/* Confetti / Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Test Completed!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Great job! We have calculated your English proficiency level based on your performance across all stages.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden mb-8">
          
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-center gap-6 mb-6 text-indigo-100 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <User className="w-4 h-4" />
                  <span>{studentName}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                  <Mail className="w-4 h-4" />
                  <span>{studentEmail}</span>
                </div>
              </div>

              <h2 className="text-indigo-100 text-lg uppercase tracking-widest font-semibold mb-2">Your Proficiency Level</h2>
              <div className="text-5xl md:text-7xl font-black mb-4 tracking-tight capitalize drop-shadow-md">
                {result.overallLevel.replace("_", " ")}
              </div>
              
              <div className="flex items-center justify-center gap-3 text-2xl font-bold bg-white/10 w-max mx-auto px-6 py-3 rounded-2xl backdrop-blur-md">
                <Award className="w-8 h-8 text-yellow-400" />
                <span>Overall Score: {Math.round(Number(result.totalScore))}%</span>
              </div>
            </div>
          </div>

          {/* Custom Admin Feedback Message */}
          {message && (
            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30 p-8 text-center">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Instructor Feedback
              </h3>
              <p className="text-indigo-800 dark:text-indigo-200 text-lg leading-relaxed max-w-2xl mx-auto italic">
                "{message.message}"
              </p>
            </div>
          )}

          {/* Detailed Scores */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              Stage Breakdown
            </h3>
            <div className="grid gap-6">
              <ScoreBar
                label="Visual Recognition"
                score={Number(scores.visualScore)}
                color="bg-blue-500"
              />
              <ScoreBar
                label="Auditory Processing"
                score={Number(scores.auditoryScore)}
                color="bg-amber-500"
              />
              <ScoreBar
                label="Spelling & Structure"
                score={Number(scores.spellingScore)}
                color="bg-emerald-500"
              />
              <ScoreBar
                label="Reading Sprint"
                score={Number(scores.readingScore)}
                color="bg-purple-500"
              />
              <ScoreBar
                label="Vocal Challenge"
                score={Number(scores.vocalScore)}
                color="bg-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
            variant="outline"
            className="rounded-xl px-8 py-6 text-lg border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 shadow-sm"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
