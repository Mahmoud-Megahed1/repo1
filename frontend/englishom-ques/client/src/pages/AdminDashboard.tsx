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
import { Trash2, Edit2, Plus, Users, BarChart2, HelpCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  const { language, t } = useLanguage();
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

  const isAr = language === "ar";

  // Fetch all questions
  const { data: questions = [], refetch: refetchQuestions } = trpc.admin.getAllQuestions.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Fetch all leads (test results)
  const { data: leads = [], isLoading: leadsLoading, refetch: refetchLeads } = trpc.admin.getAllTestResults.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  // Mutations
  const createMutation = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      toast.success(t("admin.successCreate"));
      resetForm();
      refetchQuestions();
      setActiveTab("questions");
    },
    onError: () => {
      toast.error(t("admin.errorCreate"));
    },
  });

  const updateMutation = trpc.admin.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success(t("admin.successUpdate"));
      resetForm();
      refetchQuestions();
      setActiveTab("questions");
    },
    onError: () => {
      toast.error(t("admin.errorUpdate"));
    },
  });

  const deleteMutation = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => {
      toast.success(t("admin.successDelete"));
      refetchQuestions();
    },
    onError: () => {
      toast.error(t("admin.errorDelete"));
    },
  });

  const deleteLeadMutation = trpc.admin.deleteTestResult.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم حذف النتيجة بنجاح!" : "Result deleted successfully!");
      refetchLeads();
    },
    onError: () => {
      toast.error(isAr ? "فشل في حذف النتيجة" : "Failed to delete result");
    },
  });

  // Check authorization
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir={isAr ? "rtl" : "ltr"}>
        <Card className="p-8">
          <p className="text-foreground">{t("quiz.loading")}</p>
        </Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className={`min-h-screen flex flex-col justify-between bg-background ${isAr ? "rtl" : "ltr"}`}>
        <Header />
        <div className="flex items-center justify-center flex-1 p-4">
          <Card className="p-8 text-center max-w-md w-full shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("admin.accessDenied")}</h2>
            <p className="text-muted-foreground mb-6">{t("admin.accessDeniedMsg")}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                {t("admin.backToHome")}
              </Button>
              <Button onClick={() => navigate("/admin/login")} className="bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold">
                {t("admin.login")}
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
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
      toast.error(t("admin.fillAllFields"));
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
    if (window.confirm(t("admin.deleteConfirm"))) {
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

  const activeTabBtnStyle = "bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold";

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-background ${isAr ? "rtl" : "ltr"}`}>
      {/* Header */}
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Title & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {t("admin.title")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isAr ? "إدارة بنك الأسئلة ومتابعة نتائج اختبارات الطلاب" : "Manage questions bank & view student test results"}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant={activeTab === "questions" ? "default" : "outline"}
              onClick={() => setActiveTab("questions")}
              className={`gap-1.5 ${activeTab === "questions" ? activeTabBtnStyle : ""}`}
            >
              <HelpCircle className="w-4 h-4" />
              {t("admin.questions")}
            </Button>

            <Button
              size="sm"
              variant={activeTab === "add" ? "default" : "outline"}
              onClick={() => {
                resetForm();
                setActiveTab("add");
              }}
              className={`gap-1.5 ${activeTab === "add" ? activeTabBtnStyle : ""}`}
            >
              <Plus className="w-4 h-4" />
              {editingId ? t("admin.editQuestion") : t("admin.addQuestion")}
            </Button>

            <Button
              size="sm"
              variant={activeTab === "stats" ? "default" : "outline"}
              onClick={() => setActiveTab("stats")}
              className={`gap-1.5 ${activeTab === "stats" ? activeTabBtnStyle : ""}`}
            >
              <BarChart2 className="w-4 h-4" />
              {t("admin.statistics")}
            </Button>

            <Button
              size="sm"
              variant={activeTab === "leads" ? "default" : "outline"}
              onClick={() => setActiveTab("leads")}
              className={`gap-1.5 ${activeTab === "leads" ? activeTabBtnStyle : ""}`}
            >
              <Users className="w-4 h-4" />
              {t("admin.studentResults")}
            </Button>
          </div>
        </div>

        {/* Tab Content */}

        {/* 1. Questions Tab */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl">
              <Label className="text-sm font-bold text-foreground whitespace-nowrap">
                {t("admin.filterByLevel")}:
              </Label>
              <Select value={filterLevel} onValueChange={setFilterLevel} dir={isAr ? "rtl" : "ltr"}>
                <SelectTrigger className="w-56 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={isAr ? "rtl" : "ltr"}>
                  <SelectItem value="all">{t("admin.allLevels")}</SelectItem>
                  <SelectItem value="A1">A1 - {t("levels.a1")}</SelectItem>
                  <SelectItem value="A2">A2 - {t("levels.a2")}</SelectItem>
                  <SelectItem value="B1">B1 - {t("levels.b1")}</SelectItem>
                  <SelectItem value="B2">B2 - {t("levels.b2")}</SelectItem>
                  <SelectItem value="C1">C1 - {t("levels.c1")}</SelectItem>
                  <SelectItem value="C2">C2 - {t("levels.c2")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <Card className="p-12 text-center border border-dashed">
                  <p className="text-muted-foreground">{t("admin.noQuestions")}</p>
                </Card>
              ) : (
                filteredQuestions.map((q: any) => (
                  <Card key={q.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <p className="font-bold text-base text-foreground leading-relaxed">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p className={`p-2 rounded bg-muted/60 ${q.correctAnswer === 'A' ? 'border-2 border-green-500/50 bg-green-500/10 font-bold text-green-600 dark:text-green-400' : ''}`}>
                            <strong>أ.</strong> {q.choiceA}
                          </p>
                          <p className={`p-2 rounded bg-muted/60 ${q.correctAnswer === 'B' ? 'border-2 border-green-500/50 bg-green-500/10 font-bold text-green-600 dark:text-green-400' : ''}`}>
                            <strong>ب.</strong> {q.choiceB}
                          </p>
                          <p className={`p-2 rounded bg-muted/60 ${q.correctAnswer === 'C' ? 'border-2 border-green-500/50 bg-green-500/10 font-bold text-green-600 dark:text-green-400' : ''}`}>
                            <strong>ج.</strong> {q.choiceC}
                          </p>
                          <p className={`p-2 rounded bg-muted/60 ${q.correctAnswer === 'D' ? 'border-2 border-green-500/50 bg-green-500/10 font-bold text-green-600 dark:text-green-400' : ''}`}>
                            <strong>د.</strong> {q.choiceD}
                          </p>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2 text-xs">
                          <span className="bg-[#4A3B32]/10 text-[#4A3B32] dark:bg-[#FCDFC2]/15 dark:text-[#FCDFC2] border border-[#4A3B32]/20 dark:border-[#FCDFC2]/30 px-2.5 py-1 rounded-md font-bold">
                            {t("admin.correctAnswer")}: {q.correctAnswer}
                          </span>
                          <span className="bg-muted px-2.5 py-1 rounded-md font-bold text-foreground">
                            {t("admin.levelLabel")}: {q.level}
                          </span>
                          {q.category && (
                            <span className="bg-muted px-2.5 py-1 rounded-md text-foreground">
                              {t("admin.categoryLabel")}: {q.category}
                            </span>
                          )}
                          {q.timePerQuestion && (
                            <span className="bg-muted px-2.5 py-1 rounded-md text-foreground">
                              {q.timePerQuestion} {isAr ? "ثانية" : "sec"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-start">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(q)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4 text-[#4A3B32] dark:text-[#FCDFC2]" />
                          <span>{t("admin.editQuestion")}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(q.id)}
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

        {/* 2. Add / Edit Question Tab */}
        {activeTab === "add" && (
          <Card className="p-6 md:p-8 max-w-3xl mx-auto border border-border shadow-md">
            <h2 className="text-2xl font-extrabold text-foreground mb-6">
              {editingId ? t("admin.editQuestion") : t("admin.addNewQuestion")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="question" className="text-foreground font-bold mb-2 block">
                  {t("admin.questionText")} *
                </Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder={isAr ? "أدخل نص السؤال هنا..." : "Enter question text..."}
                  className="bg-background"
                  dir={isAr ? "rtl" : "ltr"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="choiceA" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.choiceA")} *
                  </Label>
                  <Input
                    id="choiceA"
                    value={formData.choiceA}
                    onChange={(e) => setFormData({ ...formData, choiceA: e.target.value })}
                    placeholder={isAr ? "الخيار أ..." : "Choice A..."}
                    className="bg-background"
                    dir={isAr ? "rtl" : "ltr"}
                  />
                </div>
                <div>
                  <Label htmlFor="choiceB" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.choiceB")} *
                  </Label>
                  <Input
                    id="choiceB"
                    value={formData.choiceB}
                    onChange={(e) => setFormData({ ...formData, choiceB: e.target.value })}
                    placeholder={isAr ? "الخيار ب..." : "Choice B..."}
                    className="bg-background"
                    dir={isAr ? "rtl" : "ltr"}
                  />
                </div>
                <div>
                  <Label htmlFor="choiceC" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.choiceC")} *
                  </Label>
                  <Input
                    id="choiceC"
                    value={formData.choiceC}
                    onChange={(e) => setFormData({ ...formData, choiceC: e.target.value })}
                    placeholder={isAr ? "الخيار ج..." : "Choice C..."}
                    className="bg-background"
                    dir={isAr ? "rtl" : "ltr"}
                  />
                </div>
                <div>
                  <Label htmlFor="choiceD" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.choiceD")} *
                  </Label>
                  <Input
                    id="choiceD"
                    value={formData.choiceD}
                    onChange={(e) => setFormData({ ...formData, choiceD: e.target.value })}
                    placeholder={isAr ? "الخيار د..." : "Choice D..."}
                    className="bg-background"
                    dir={isAr ? "rtl" : "ltr"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="correctAnswer" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.correctAnswerLabel")} *
                  </Label>
                  <Select
                    value={formData.correctAnswer}
                    onValueChange={(val) => setFormData({ ...formData, correctAnswer: val as any })}
                    dir={isAr ? "rtl" : "ltr"}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isAr ? "rtl" : "ltr"}>
                      <SelectItem value="A">{isAr ? "الخيار أ (A)" : "Choice A"}</SelectItem>
                      <SelectItem value="B">{isAr ? "الخيار ب (B)" : "Choice B"}</SelectItem>
                      <SelectItem value="C">{isAr ? "الخيار ج (C)" : "Choice C"}</SelectItem>
                      <SelectItem value="D">{isAr ? "الخيار د (D)" : "Choice D"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.levelLabel")} *
                  </Label>
                  <Select
                    value={formData.level}
                    onValueChange={(val) => setFormData({ ...formData, level: val as any })}
                    dir={isAr ? "rtl" : "ltr"}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir={isAr ? "rtl" : "ltr"}>
                      <SelectItem value="A1">A1 - {t("levels.a1")}</SelectItem>
                      <SelectItem value="A2">A2 - {t("levels.a2")}</SelectItem>
                      <SelectItem value="B1">B1 - {t("levels.b1")}</SelectItem>
                      <SelectItem value="B2">B2 - {t("levels.b2")}</SelectItem>
                      <SelectItem value="C1">C1 - {t("levels.c1")}</SelectItem>
                      <SelectItem value="C2">C2 - {t("levels.c2")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.categoryOptional")}
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={isAr ? "مثال: القواعد، المفردات..." : "e.g. Grammar, Vocabulary"}
                    className="bg-background"
                    dir={isAr ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <Label htmlFor="timePerQuestion" className="text-foreground font-bold mb-1.5 block">
                    {t("admin.timePerQuestion")}
                  </Label>
                  <Input
                    id="timePerQuestion"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.timePerQuestion}
                    onChange={(e) => setFormData({ ...formData, timePerQuestion: parseInt(e.target.value) || 10 })}
                    className="bg-background"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold py-6 flex-1 shadow-md"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? t("admin.updateQuestion") : t("admin.addQuestion")}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="py-6 px-6"
                  >
                    {t("admin.cancel")}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        {/* 3. Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <Card className="p-6 md:p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                {t("admin.statistics")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#4A3B32]/10 border border-[#4A3B32]/20 dark:bg-[#FCDFC2]/10 dark:border-[#FCDFC2]/30 p-6 rounded-xl text-center">
                  <p className="text-sm font-bold text-[#4A3B32] dark:text-[#FCDFC2] mb-1">{t("admin.totalQuestions")}</p>
                  <p className="text-4xl font-black text-foreground">{stats.total}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-4">
                {t("admin.questionsByLevel")}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(stats.byLevel).map(([lvl, count]) => (
                  <div key={lvl} className="bg-muted p-4 rounded-xl text-center border border-border">
                    <p className="text-sm font-bold text-muted-foreground mb-1">{lvl}</p>
                    <p className="text-2xl font-extrabold text-[#4A3B32] dark:text-[#FCDFC2]">{count}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 4. Student Results Tab */}
        {activeTab === "leads" && (
          <Card className="p-6 md:p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-extrabold mb-6 text-foreground">
              {t("admin.studentResults")}
            </h2>

            {leadsLoading ? (
              <p className="text-muted-foreground text-center py-12">{t("quiz.loading")}</p>
            ) : leads.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">{t("admin.noResults")}</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm text-start">
                  <thead className="bg-muted/70 text-foreground font-bold">
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-start">{t("admin.studentName")}</th>
                      <th className="py-3 px-4 text-start">{t("admin.phoneEmail")}</th>
                      <th className="py-3 px-4 text-start">{t("admin.levelLabel")}</th>
                      <th className="py-3 px-4 text-start">{t("admin.score")}</th>
                      <th className="py-3 px-4 text-start">{t("admin.accuracy")}</th>
                      <th className="py-3 px-4 text-start">{t("admin.date")}</th>
                      <th className="py-3 px-4 text-end">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground">
                          {lead.studentName || t("admin.guest")}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground" dir="ltr">
                          {lead.studentPhone || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#4A3B32]/10 text-[#4A3B32] dark:bg-[#FCDFC2]/15 dark:text-[#FCDFC2] font-bold border border-[#4A3B32]/20 dark:border-[#FCDFC2]/30 text-xs">
                            {lead.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground font-semibold">
                          {lead.correctAnswers} / {lead.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-foreground font-semibold">
                          {lead.accuracy}%
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs" dir="ltr">
                          {new Date(lead.completedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => {
                              if (window.confirm(isAr ? "هل أنت متأكد من حذف هذه النتيجة؟" : "Are you sure you want to delete this result?")) {
                                deleteLeadMutation.mutate({ id: lead.id });
                              }
                            }}
                            disabled={deleteLeadMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
