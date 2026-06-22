import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import QuestionManagement from "./admin/QuestionManagement";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"questions" | "results" | "messages">("questions");

  const getAllResultsQuery = trpc.admin.getAllResults.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">Access Denied</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You must be an admin to access this page</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                Back to Home
              </Button>
              <Button onClick={() => navigate("/admin/login")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage questions, view results, and customize feedback messages
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === "questions"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              📚 Question Bank
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === "results"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              📊 Student Results
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-6 py-3 font-medium transition-all border-b-2 ${
                activeTab === "messages"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              💬 Feedback Messages
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            {activeTab === "questions" && <QuestionManagement />}

            {activeTab === "results" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Student Test Results
                </h2>
                {getAllResultsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Level
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getAllResultsQuery.data && getAllResultsQuery.data.length > 0 ? (
                          getAllResultsQuery.data.map((result) => (
                            <tr
                              key={result.id}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {result.studentName || "Anonymous"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {result.studentEmail || "-"}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                                  {result.overallLevel}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {Math.round(Number(result.totalScore))}%
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(result.completedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                            >
                              No test results yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Feedback Messages
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 dark:text-blue-200">
                    Feedback message management interface coming soon. You will be able to customize messages for each proficiency level.
                  </p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Add New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">&copy; 2026 Englishom. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
