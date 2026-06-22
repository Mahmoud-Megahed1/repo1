import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type AdminTab = "questions" | "add" | "stats" | "leads";

interface FormData {
  question: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: string;
  timePerQuestion: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("questions");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctAnswer: "A",
    level: "A1",
    category: "",
    timePerQuestion: 10,
  });

  // Fetch all questions
  const { data: questions = [], refetch: refetchQuestions } = trpc.admin.getAllQuestions.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Fetch all leads
  const { data: leads = [], isLoading: leadsLoading } = trpc.admin.getAllLeads.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Mutations
  const createMutation = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question created successfully!");
      resetForm();
      refetchQuestions();
      setActiveTab("questions");
    },
    onError: () => {
      toast.error("Failed to create question");
    },
  });

  const updateMutation = trpc.admin.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question updated successfully!");
      resetForm();
      refetchQuestions();
      setActiveTab("questions");
    },
    onError: () => {
      toast.error("Failed to update question");
    },
  });

  const deleteMutation = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question deleted successfully!");
      refetchQuestions();
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  // Check authorization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8">
          <p className="text-foreground">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
            <Button onClick={() => navigate("/admin/login")} className="bg-accent text-accent-foreground">
              Admin Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      question: "",
      choiceA: "",
      choiceB: "",
      choiceC: "",
      choiceD: "",
      correctAnswer: "A",
      level: "A1",
      category: "",
      timePerQuestion: 10,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.choiceA || !formData.choiceB || !formData.choiceC || !formData.choiceD) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
        correctAnswer: formData.correctAnswer as "A" | "B" | "C" | "D",
        level: formData.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      });
    }
  };

  const handleEdit = (question: any) => {
    setFormData({
      question: question.question,
      choiceA: question.choiceA,
      choiceB: question.choiceB,
      choiceC: question.choiceC,
      choiceD: question.choiceD,
      correctAnswer: question.correctAnswer,
      level: question.level,
      category: question.category || "",
      timePerQuestion: question.timePerQuestion || 10,
    });
    setEditingId(question.id);
    setActiveTab("add");
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredQuestions = filterLevel === "all"
    ? questions
    : questions.filter((q: any) => q.level === filterLevel);

  const stats = {
    total: questions.length,
    byLevel: {
      A1: questions.filter((q: any) => q.level === "A1").length,
      A2: questions.filter((q: any) => q.level === "A2").length,
      B1: questions.filter((q: any) => q.level === "B1").length,
      B2: questions.filter((q: any) => q.level === "B2").length,
      C1: questions.filter((q: any) => q.level === "C1").length,
      C2: questions.filter((q: any) => q.level === "C2").length,
    },
  };

  return (
    <div className={`min-h-screen bg-background ${language === "ar" ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2 items-center">
            {/* Language Toggle */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                size="sm"
                variant={language === "en" ? "default" : "ghost"}
                onClick={() => setLanguage("en")}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                EN
              </Button>
              <Button
                size="sm"
                variant={language === "ar" ? "default" : "ghost"}
                onClick={() => setLanguage("ar")}
                className="gap-1"
              >
                <Globe className="w-4 h-4" />
                AR
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={toggleTheme}
              className="gap-2"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto flex gap-4 p-4">
          <Button
            variant={activeTab === "questions" ? "default" : "ghost"}
            onClick={() => setActiveTab("questions")}
            className={activeTab === "questions" ? "bg-accent text-accent-foreground" : ""}
          >
            Questions
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            onClick={() => {
              resetForm();
              setActiveTab("add");
            }}
            className={activeTab === "add" ? "bg-accent text-accent-foreground" : ""}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "ghost"}
            onClick={() => setActiveTab("stats")}
            className={activeTab === "stats" ? "bg-accent text-accent-foreground" : ""}
          >
            Statistics
          </Button>
          <Button
            variant={activeTab === "leads" ? "default" : "ghost"}
            onClick={() => setActiveTab("leads")}
            className={activeTab === "leads" ? "bg-accent text-accent-foreground" : ""}
          >
            Student Results
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div>
            <div className="mb-6">
              <Label className="text-foreground mb-2 block">Filter by Level</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                  <SelectItem value="C1">C1 - Advanced</SelectItem>
                  <SelectItem value="C2">C2 - Proficiency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No questions found</p>
                </Card>
              ) : (
                filteredQuestions.map((question: any) => (
                  <Card key={question.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-2">{question.question}</p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>A. {question.choiceA}</p>
                          <p>B. {question.choiceB}</p>
                          <p>C. {question.choiceC}</p>
                          <p>D. {question.choiceD}</p>
                        </div>
                        <div className="mt-3 flex gap-4 text-sm">
                          <span className="bg-muted px-2 py-1 rounded">
                            Correct: <strong>{question.correctAnswer}</strong>
                          </span>
                          <span className="bg-muted px-2 py-1 rounded">
                            Level: <strong>{question.level}</strong>
                          </span>
                          {question.category && (
                            <span className="bg-muted px-2 py-1 rounded">
                              Category: <strong>{question.category}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Question Tab */}
        {activeTab === "add" && (
          <Card className="p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingId ? "Edit Question" : "Add New Question"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="question" className="text-foreground">
                  Question *
                </Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="choiceA" className="text-foreground">
                    Choice A *
                  </Label>
                  <Input
                    id="choiceA"
                    value={formData.choiceA}
                    onChange={(e) => setFormData({ ...formData, choiceA: e.target.value })}
                    placeholder="Enter choice A"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="choiceB" className="text-foreground">
                    Choice B *
                  </Label>
                  <Input
                    id="choiceB"
                    value={formData.choiceB}
                    onChange={(e) => setFormData({ ...formData, choiceB: e.target.value })}
                    placeholder="Enter choice B"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="choiceC" className="text-foreground">
                    Choice C *
                  </Label>
                  <Input
                    id="choiceC"
                    value={formData.choiceC}
                    onChange={(e) => setFormData({ ...formData, choiceC: e.target.value })}
                    placeholder="Enter choice C"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="choiceD" className="text-foreground">
                    Choice D *
                  </Label>
                  <Input
                    id="choiceD"
                    value={formData.choiceD}
                    onChange={(e) => setFormData({ ...formData, choiceD: e.target.value })}
                    placeholder="Enter choice D"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="correctAnswer" className="text-foreground">
                    Correct Answer *
                  </Label>
                  <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value as "A" | "B" | "C" | "D" })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level" className="text-foreground">
                    Level *
                  </Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" })}> 
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1 - Beginner</SelectItem>
                      <SelectItem value="A2">A2 - Elementary</SelectItem>
                      <SelectItem value="B1">B1 - Intermediate</SelectItem>
                      <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                      <SelectItem value="C1">C1 - Advanced</SelectItem>
                      <SelectItem value="C2">C2 - Proficiency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-foreground">
                    Category (Optional)
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Enter category (e.g., Grammar, Vocabulary)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="timePerQuestion" className="text-foreground">
                    Time per Question (seconds)
                  </Label>
                  <Input
                    id="timePerQuestion"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.timePerQuestion}
                    onChange={(e) => setFormData({ ...formData, timePerQuestion: parseInt(e.target.value) || 10 })}
                    placeholder="Enter time in seconds"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 flex-1"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? "Update Question" : "Add Question"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="py-6"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Statistics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Questions</p>
                  <p className="text-4xl font-bold text-accent">{stats.total}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mt-8 mb-4">Questions by Level</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(stats.byLevel).map(([level, count]) => (
                  <div key={level} className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">{level}</p>
                    <p className="text-2xl font-bold text-accent">{count}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Leads / Student Results Tab */}
        {activeTab === "leads" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 text-foreground">Student Results & Leads</h2>
            {leadsLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading results...</p>
            ) : leads.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No results recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Phone/Email</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Level</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Score</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Accuracy</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead: any) => (
                      <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-foreground">{lead.studentName || "Guest"}</td>
                        <td className="py-3 px-4 text-foreground" dir="ltr">{lead.studentPhone || "-"}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-sm font-medium">
                            {lead.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground">{lead.correctAnswers} / {lead.totalQuestions}</td>
                        <td className="py-3 px-4 text-foreground">{lead.accuracy}%</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {new Date(lead.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
