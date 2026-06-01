import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckCircle2,
  Eye,
  BookOpen,
  PenTool,
  Headphones,
  Keyboard,
  BarChart3,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface FormData {
  stage: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
}

const STAGE_NAMES: Record<number, string> = {
  1: "Vocabulary",
  2: "Grammar",
  3: "Reading",
  4: "Listening",
  5: "Writing",
};

const STAGE_ICONS: Record<number, any> = {
  1: Eye,
  2: PenTool,
  3: BookOpen,
  4: Headphones,
  5: Keyboard,
};

const STAGE_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700 border-blue-200",
  2: "bg-purple-100 text-purple-700 border-purple-200",
  3: "bg-green-100 text-green-700 border-green-200",
  4: "bg-orange-100 text-orange-700 border-orange-200",
  5: "bg-pink-100 text-pink-700 border-pink-200",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  hard: "bg-red-100 text-red-700 border-red-200",
};

const emptyForm: FormData = {
  stage: 1,
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  difficulty: "medium",
  timeLimit: 30,
};

export default function Admin() {
  const [formData, setFormData] = useState<FormData>({ ...emptyForm });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStage, setFilterStage] = useState<number | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Queries
  const {
    data: questions = [],
    isLoading,
    refetch,
    error,
  } = trpc.test.getAllQuestions.useQuery();

  // Mutations
  const createMutation = trpc.test.createQuestion.useMutation({
    onSuccess: () => {
      toast.success("✅ Question added successfully!");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.test.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("✅ Question updated successfully!");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.test.deleteQuestion.useMutation({
    onSuccess: () => {
      toast.success("🗑️ Question deleted.");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Check authorization AFTER all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (
    error &&
    (error.data?.code === "UNAUTHORIZED" || error.data?.code === "FORBIDDEN")
  ) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-8 text-center max-w-md w-full shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            🔒 Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => (window.location.href = "/test")}
              variant="outline"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => (window.location.href = "/test/admin/login")}
              className="bg-primary text-primary-foreground"
            >
              Admin Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  function resetForm() {
    setFormData({ ...emptyForm, options: ["", "", "", ""] });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  }

  function handleOptionChange(index: number, value: string) {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  }

  function addOption() {
    if (formData.options.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    setFormData({ ...formData, options: [...formData.options, ""] });
  }

  function removeOption(index: number) {
    if (formData.options.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    // If removed option was the correct answer, clear it
    if (formData.correctAnswer === formData.options[index]) {
      setFormData({ ...formData, options: newOptions, correctAnswer: "" });
    } else {
      setFormData({ ...formData, options: newOptions });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanOptions = formData.options
      .map((o) => o.trim())
      .filter((o) => o.length > 0);

    if (!formData.questionText.trim()) {
      toast.error("Please enter the question text");
      return;
    }
    if (cleanOptions.length < 2) {
      toast.error("Please add at least 2 options");
      return;
    }
    if (!formData.correctAnswer.trim()) {
      toast.error("Please select or enter the correct answer");
      return;
    }
    if (!cleanOptions.includes(formData.correctAnswer.trim())) {
      toast.error("Correct answer must match one of the options");
      return;
    }

    // Convert options array to JSON string for the API
    const optionsJson = JSON.stringify(cleanOptions);

    if (isEditing && editingId) {
      updateMutation.mutate({
        id: editingId,
        stage: formData.stage,
        questionText: formData.questionText.trim(),
        options: optionsJson,
        correctAnswer: formData.correctAnswer.trim(),
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
      });
    } else {
      createMutation.mutate({
        stage: formData.stage,
        questionText: formData.questionText.trim(),
        options: optionsJson,
        correctAnswer: formData.correctAnswer.trim(),
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
      });
    }
  }

  function handleEdit(question: any) {
    // Parse options - could be array or string
    let opts: string[] = [];
    if (Array.isArray(question.options)) {
      opts = question.options;
    } else if (typeof question.options === "string") {
      try {
        const parsed = JSON.parse(question.options);
        opts = Array.isArray(parsed) ? parsed : [question.options];
      } catch {
        opts = question.options
          .split(",")
          .map((o: string) => o.trim())
          .filter(Boolean);
      }
    }

    // Ensure at least 2 options
    while (opts.length < 2) opts.push("");

    setFormData({
      stage: question.stage,
      questionText: question.questionText,
      options: opts,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      timeLimit: question.timeLimit,
    });
    setIsEditing(true);
    setEditingId(question.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate({ id });
    }
  }

  // Filter & search logic
  const filteredQuestions = questions.filter((q: any) => {
    if (filterStage && q.stage !== filterStage) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    if (
      searchQuery &&
      !q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Stats
  const stageStats = [1, 2, 3, 4, 5].map((s) => ({
    stage: s,
    count: questions.filter((q: any) => q.stage === s).length,
  }));

  const optionLabel = (index: number) =>
    String.fromCharCode(65 + index); // A, B, C, D, E, F

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">
                Question Manager
              </h1>
              <p className="text-xs text-muted-foreground">
                Englishom Level Test Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/test")}
            >
              ← Back to Test
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowForm(true);
                setIsEditing(false);
                setEditingId(null);
                setFormData({ ...emptyForm, options: ["", "", "", ""] });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Question
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {/* Total */}
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/30"
            onClick={() => {
              setFilterStage(null);
              setFilterDifficulty(null);
            }}
          >
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {questions.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Total Questions
              </p>
            </CardContent>
          </Card>
          {stageStats.map(({ stage, count }) => {
            const Icon = STAGE_ICONS[stage];
            return (
              <Card
                key={stage}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  filterStage === stage ? "ring-2 ring-primary shadow-md" : ""
                }`}
                onClick={() =>
                  setFilterStage(filterStage === stage ? null : stage)
                }
              >
                <CardContent className="p-4 text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {STAGE_NAMES[stage]}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="mb-6 shadow-lg border-2 border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Edit2 className="w-5 h-5" /> Edit Question #{editingId}
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" /> Add New Question
                    </>
                  )}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Stage, Difficulty, Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Stage
                    </label>
                    <Select
                      value={formData.stage.toString()}
                      onValueChange={(v) =>
                        setFormData({ ...formData, stage: parseInt(v) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STAGE_NAMES).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Difficulty
                    </label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(v: any) =>
                        setFormData({ ...formData, difficulty: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">🟢 Easy</SelectItem>
                        <SelectItem value="medium">🟡 Medium</SelectItem>
                        <SelectItem value="hard">🔴 Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Time Limit (seconds)
                    </label>
                    <Input
                      type="number"
                      min="5"
                      max="300"
                      value={formData.timeLimit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          timeLimit: parseInt(e.target.value) || 30,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question Text
                  </label>
                  <textarea
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your question here..."
                    value={formData.questionText}
                    onChange={(e) =>
                      setFormData({ ...formData, questionText: e.target.value })
                    }
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold">
                      Answer Options
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      disabled={formData.options.length >= 6}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Option
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {/* Option label (A, B, C...) */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            formData.correctAnswer === opt && opt.trim()
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {optionLabel(idx)}
                        </div>
                        {/* Input */}
                        <Input
                          placeholder={`Option ${optionLabel(idx)}`}
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          className={`flex-1 ${
                            formData.correctAnswer === opt && opt.trim()
                              ? "border-emerald-500 ring-1 ring-emerald-300"
                              : ""
                          }`}
                        />
                        {/* Mark as correct */}
                        <Button
                          type="button"
                          variant={
                            formData.correctAnswer === opt && opt.trim()
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`shrink-0 ${
                            formData.correctAnswer === opt && opt.trim()
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : ""
                          }`}
                          onClick={() => {
                            if (opt.trim()) {
                              setFormData({
                                ...formData,
                                correctAnswer: opt.trim(),
                              });
                            } else {
                              toast.error("Enter option text first");
                            }
                          }}
                          title="Set as correct answer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        {/* Remove */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0 text-red-400 hover:text-red-600"
                          onClick={() => removeOption(idx)}
                          disabled={formData.options.length <= 2}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {formData.correctAnswer && (
                    <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct answer: <strong>{formData.correctAnswer}</strong>
                    </p>
                  )}
                </div>

                {/* Preview */}
                {formData.questionText.trim() && formData.options.some(o => o.trim()) && (
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Preview
                    </p>
                    <p className="font-medium mb-3">{formData.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.options
                        .filter((o) => o.trim())
                        .map((opt, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-md border text-sm ${
                              formData.correctAnswer === opt
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <span className="font-semibold mr-2">
                              {optionLabel(idx)}.
                            </span>
                            {opt}
                            {formData.correctAnswer === opt && (
                              <CheckCircle2 className="w-4 h-4 inline ml-2 text-emerald-500" />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="px-8"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Update Question
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filters:
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-[350px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Stage filter */}
          <Select
            value={filterStage?.toString() ?? "all"}
            onValueChange={(v) =>
              setFilterStage(v === "all" ? null : parseInt(v))
            }
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {Object.entries(STAGE_NAMES).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty filter */}
          <Select
            value={filterDifficulty ?? "all"}
            onValueChange={(v) =>
              setFilterDifficulty(v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="easy">🟢 Easy</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="hard">🔴 Hard</SelectItem>
            </SelectContent>
          </Select>

          {(filterStage || filterDifficulty || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterStage(null);
                setFilterDifficulty(null);
                setSearchQuery("");
              }}
            >
              Clear all
            </Button>
          )}

          <span className="text-sm text-muted-foreground ml-auto">
            Showing {filteredQuestions.length} of {questions.length}
          </span>
        </div>

        {/* Questions List */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No questions found</p>
                <p className="text-sm">
                  {questions.length === 0
                    ? "Add your first question above!"
                    : "Try changing your filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[50px] text-center">#</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-[120px]">Stage</TableHead>
                      <TableHead className="w-[100px]">Difficulty</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Options
                      </TableHead>
                      <TableHead className="w-[80px] text-center">
                        Time
                      </TableHead>
                      <TableHead className="w-[120px] text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.map((question: any, idx: number) => {
                      const isExpanded = expandedQuestion === question.id;
                      const qOptions = Array.isArray(question.options)
                        ? question.options
                        : typeof question.options === "string"
                          ? (() => {
                              try {
                                return JSON.parse(question.options);
                              } catch {
                                return question.options
                                  .split(",")
                                  .map((o: string) => o.trim());
                              }
                            })()
                          : [];

                      return (
                        <>
                          <TableRow
                            key={question.id}
                            className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                              isExpanded ? "bg-slate-50" : ""
                            }`}
                            onClick={() =>
                              setExpandedQuestion(isExpanded ? null : question.id)
                            }
                          >
                            <TableCell className="text-center text-muted-foreground text-xs">
                              {question.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                                <span className="text-sm font-medium truncate max-w-md">
                                  {question.questionText}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  STAGE_COLORS[question.stage] || ""
                                }`}
                              >
                                {STAGE_NAMES[question.stage]}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${
                                  DIFFICULTY_COLORS[question.difficulty] || ""
                                }`}
                              >
                                {question.difficulty}
                              </span>
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {qOptions.length}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {question.timeLimit}s
                            </TableCell>
                            <TableCell>
                              <div
                                className="flex gap-1 justify-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEdit(question)}
                                  title="Edit question"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => handleDelete(question.id)}
                                  title="Delete question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {/* Expanded details */}
                          {isExpanded && (
                            <TableRow key={`${question.id}-detail`}>
                              <TableCell></TableCell>
                              <TableCell colSpan={6}>
                                <div className="py-3 space-y-3">
                                  <p className="font-medium text-sm">
                                    {question.questionText}
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {qOptions.map(
                                      (opt: string, optIdx: number) => (
                                        <div
                                          key={optIdx}
                                          className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 ${
                                            question.correctAnswer === opt
                                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                                              : "bg-white border-slate-200"
                                          }`}
                                        >
                                          <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                                            {optionLabel(optIdx)}
                                          </span>
                                          {opt}
                                          {question.correctAnswer === opt && (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Correct Answer:{" "}
                                    <strong className="text-emerald-600">
                                      {question.correctAnswer}
                                    </strong>{" "}
                                    | Time: {question.timeLimit}s | Difficulty:{" "}
                                    {question.difficulty}
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
