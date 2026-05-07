import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Results() {
  const [, navigate] = useLocation();
  const [testId, setTestId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = sessionStorage.getItem("testResultId");
    if (id) {
      setTestId(Number(id));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getResultQuery = trpc.test.getResult.useQuery(
    { testId: testId || 0 },
    { enabled: !!testId }
  );

  useEffect(() => {
    if (getResultQuery.data) {
      setIsLoading(false);
    }
  }, [getResultQuery.data]);

  if (isLoading || !getResultQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const { result, message } = getResultQuery.data;
  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Results not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-red-100 text-red-800 border-red-300";
      case "elementary":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "upper_intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "advanced":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: "Beginner",
      elementary: "Elementary",
      intermediate: "Intermediate",
      upper_intermediate: "Upper-Intermediate",
      advanced: "Advanced",
    };
    return labels[level] || level;
  };

  const scorePercentage = Number(result.totalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Englishom</h1>
          <p className="text-gray-600">Your Test Results</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 mb-4">
              <span className="text-5xl font-bold text-white">{Math.round(scorePercentage)}%</span>
            </div>
            <p className="text-gray-600 mb-4">Your Overall Score</p>
          </div>

          {/* Level Badge */}
          <div className="text-center mb-8">
            <div className={`inline-block px-6 py-3 rounded-full border-2 font-bold text-lg ${getLevelColor(result.overallLevel)}`}>
              {getLevelLabel(result.overallLevel)}
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Visual", score: result.visualScore },
              { label: "Auditory", score: result.auditoryScore },
              { label: "Spelling", score: result.spellingScore },
              { label: "Reading", score: result.readingScore },
              { label: "Vocal", score: result.vocalScore },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {item.score ? Math.round(Number(item.score)) : "-"}%
                </p>
              </div>
            ))}
          </div>

          {/* Feedback Message */}
          {message && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <h3 className="text-lg font-bold text-blue-900 mb-2">{message.titleEn}</h3>
              <p className="text-blue-800 mb-4">{message.messageEn}</p>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation:</p>
                <p className="text-gray-700">{message.recommendationEn}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              sessionStorage.removeItem("testResultId");
              window.location.href = "/";
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
          >
            Take Test Again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.print();
            }}
            className="px-6 py-2"
          >
            Print Results
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Test completed on {new Date(result.completedAt).toLocaleDateString()}</p>
          <p>Result ID: {testId}</p>
        </div>
      </div>
    </div>
  );
}
