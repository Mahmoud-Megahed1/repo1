import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Edit2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type TestStage = "visual_recognition" | "auditory_processing" | "spelling_structure" | "reading_sprint" | "vocal_challenge";
type Level = "beginner" | "elementary" | "intermediate" | "upper_intermediate" | "advanced";

interface Question {
  _id: string;
  stage: TestStage;
  level: Level;
  questionText?: string;
  imageData?: string;
  audioData?: string;
  correctAnswer: string;
  options?: string[];
}

export default function QuestionManagement() {
  const { t } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<TestStage>("visual_recognition");
  const [selectedLevel, setSelectedLevel] = useState<Level>("beginner");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: questionsData = [], refetch } = trpc.admin.getAllQuestions.useQuery();
  const questions = questionsData as unknown as Question[];

  const createMutation = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      refetch();
      handleCancelEdit();
    },
    onError: (err) => alert(err.message)
  });

  const updateMutation = trpc.admin.updateQuestion.useMutation({
    onSuccess: () => {
      refetch();
      handleCancelEdit();
    },
    onError: (err) => alert(err.message)
  });

  const deleteMutation = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => refetch(),
    onError: (err) => alert(err.message)
  });

  const [formData, setFormData] = useState({
    questionText: "",
    imageUrl: "",
    audioUrl: "",
    correctAnswer: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
  });

  const stages: TestStage[] = [
    "visual_recognition",
    "auditory_processing",
    "spelling_structure",
    "reading_sprint",
    "vocal_challenge",
  ];

  const levels: Level[] = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"];

  const stageLabels: Record<TestStage, string> = {
    visual_recognition: "Visual Recognition",
    auditory_processing: "Auditory Processing",
    spelling_structure: "Spelling & Structure",
    reading_sprint: "Reading Sprint",
    vocal_challenge: "Vocal Challenge",
  };

  const levelLabels: Record<Level, string> = {
    beginner: "Beginner",
    elementary: "Elementary",
    intermediate: "Intermediate",
    upper_intermediate: "Upper-Intermediate",
    advanced: "Advanced",
  };

  // Get questions for selected stage and level
  const getQuestionsForFilter = () => {
    return questions.filter(
      (q) => q.stage === selectedStage && q.level === (selectedLevel === 'upper_intermediate' ? 'upper-intermediate' : selectedLevel)
    );
  };

  const handleAddQuestion = () => {
    if (!formData.correctAnswer.trim()) {
      alert("Please enter the correct answer");
      return;
    }

    const optionsArray = [formData.optionA, formData.optionB, formData.optionC, formData.optionD].filter(Boolean);

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        stage: selectedStage,
        level: selectedLevel,
        questionText: formData.questionText,
        imageUrl: formData.imageUrl,
        audioUrl: formData.audioUrl,
        correctAnswer: formData.correctAnswer,
        options: optionsArray,
      });
    } else {
      createMutation.mutate({
        stage: selectedStage,
        level: selectedLevel,
        questionText: formData.questionText,
        imageUrl: formData.imageUrl,
        audioUrl: formData.audioUrl,
        correctAnswer: formData.correctAnswer,
        options: optionsArray,
      });
    }
  };

  const handleEditQuestion = (question: Question) => {
    setFormData({
      questionText: question.questionText || "",
      imageUrl: question.imageData || "",
      audioUrl: question.audioData || "",
      correctAnswer: question.correctAnswer,
      optionA: question.options?.[0] || "",
      optionB: question.options?.[1] || "",
      optionC: question.options?.[2] || "",
      optionD: question.options?.[3] || "",
    });
    setEditingId(question._id);
    setIsAddingQuestion(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleCancelEdit = () => {
    setIsAddingQuestion(false);
    setEditingId(null);
    setFormData({
      questionText: "",
      imageUrl: "",
      audioUrl: "",
      correctAnswer: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredQuestions = getQuestionsForFilter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Question Bank Management
        </h2>
        <Button
          onClick={() => setIsAddingQuestion(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Question
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stage
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as TestStage)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stageLabels[stage]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as Level)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {levelLabels[level]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Question Form */}
      {isAddingQuestion && (
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? "Edit Question" : "Add New Question"}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Text
              </label>
              <Input
                type="text"
                value={formData.questionText}
                onChange={(e) =>
                  setFormData({ ...formData, questionText: e.target.value })
                }
                placeholder="Enter question text"
                className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            {selectedStage === "visual_recognition" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL / Upload
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                      })
                    }
                    placeholder="Enter image URL or Base64"
                    className="flex-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="outline" className="h-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200">
                      Upload Image
                    </Button>
                  </div>
                </div>
                {formData.imageUrl && formData.imageUrl.startsWith("data:image") && (
                  <div className="mt-2">
                    <img src={formData.imageUrl} alt="Preview" className="h-20 rounded shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {selectedStage === "auditory_processing" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Audio URL
                </label>
                <Input
                  type="text"
                  value={formData.audioUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      audioUrl: e.target.value,
                    })
                  }
                  placeholder="Enter audio URL"
                  className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  * Choice A
                </label>
                <Input
                  type="text"
                  value={formData.optionA}
                  onChange={(e) =>
                    setFormData({ ...formData, optionA: e.target.value })
                  }
                  placeholder="Enter choice A"
                  className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  * Choice B
                </label>
                <Input
                  type="text"
                  value={formData.optionB}
                  onChange={(e) =>
                    setFormData({ ...formData, optionB: e.target.value })
                  }
                  placeholder="Enter choice B"
                  className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choice C
                </label>
                <Input
                  type="text"
                  value={formData.optionC}
                  onChange={(e) =>
                    setFormData({ ...formData, optionC: e.target.value })
                  }
                  placeholder="Enter choice C"
                  className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Choice D
                </label>
                <Input
                  type="text"
                  value={formData.optionD}
                  onChange={(e) =>
                    setFormData({ ...formData, optionD: e.target.value })
                  }
                  placeholder="Enter choice D"
                  className="w-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                * Correct Answer
              </label>
              <select
                value={formData.correctAnswer}
                onChange={(e) =>
                  setFormData({ ...formData, correctAnswer: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select Correct Answer</option>
                {formData.optionA && <option value={formData.optionA}>A: {formData.optionA}</option>}
                {formData.optionB && <option value={formData.optionB}>B: {formData.optionB}</option>}
                {formData.optionC && <option value={formData.optionC}>C: {formData.optionC}</option>}
                {formData.optionD && <option value={formData.optionD}>D: {formData.optionD}</option>}
              </select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {editingId ? "Update Question" : "Add Question"}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Correct Answer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <tr
                    key={question._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="max-w-xs">
                        <p className="truncate">
                          {question.questionText || "(No text)"}
                        </p>
                        {question.imageUrl && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            📷 Image
                          </p>
                        )}
                        {question.audioUrl && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            🔊 Audio
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                        {levelLabels[question.level]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {question.correctAnswer}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                  >
                    No questions found for this stage and level. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {questions.length > 0 && (
          <div className="bg-gray-50 dark:bg-slate-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total questions: <strong>{questions.length}</strong> | Filtered: <strong>{filteredQuestions.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
