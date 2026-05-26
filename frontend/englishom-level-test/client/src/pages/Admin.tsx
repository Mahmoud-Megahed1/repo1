import { useState, useEffect } from "react";
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
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  stage: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
}

const STAGE_NAMES = {
  1: "Vocabulary",
  2: "Grammar",
  3: "Reading",
  4: "Listening",
  5: "Writing",
};

export default function Admin() {
  const [formData, setFormData] = useState<FormData>({
    stage: 1,
    questionText: "",
    options: "",
    correctAnswer: "",
    difficulty: "medium",
    timeLimit: 30,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Queries
  const { data: questions = [], isLoading, refetch, error } = trpc.test.getAllQuestions.useQuery();

  // Mutations
  const createMutation = trpc.test.createQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question added successfully!");
      setFormData({
        stage: 1,
        questionText: "",
        options: "",
        correctAnswer: "",
        difficulty: "medium",
        timeLimit: 30,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const updateMutation = trpc.test.updateQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question updated successfully!");
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        stage: 1,
        questionText: "",
        options: "",
        correctAnswer: "",
        difficulty: "medium",
        timeLimit: 30,
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = trpc.test.deleteQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // Check authorization AFTER all hooks
  if (error && (error.data?.code === "UNAUTHORIZED" || error.data?.code === "FORBIDDEN")) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background">
        <Card className="p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.href = "/test"} variant="outline">
              Back to Home
            </Button>
            <Button onClick={() => window.location.href = "/test/admin/login"} className="bg-primary text-primary-foreground">
              Admin Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.questionText || !formData.options || !formData.correctAnswer) {
      toast.error("Please fill all fields");
      return;
    }

    if (isEditing && editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (question: any) => {
    setFormData({
      stage: question.stage,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      timeLimit: question.timeLimit,
    });
    setIsEditing(true);
    setEditingId(question.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      stage: 1,
      questionText: "",
      options: "",
      correctAnswer: "",
      difficulty: "medium",
      timeLimit: 30,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage test questions and settings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Easy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questions.filter((q: any) => q.difficulty === "easy").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Medium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questions.filter((q: any) => q.difficulty === "medium").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {questions.filter((q: any) => q.difficulty === "hard").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Question" : "Add New Question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stage */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stage
                  </label>
                  <Select
                    value={formData.stage.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, stage: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGE_NAMES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Difficulty
                  </label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Text
                </label>
                <Input
                  placeholder="Enter question text"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Options (comma-separated)
                </label>
                <Input
                  placeholder="Option A, Option B, Option C, Option D"
                  value={formData.options}
                  onChange={(e) =>
                    setFormData({ ...formData, options: e.target.value })
                  }
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Correct Answer
                </label>
                <Input
                  placeholder="Enter correct answer"
                  value={formData.correctAnswer}
                  onChange={(e) =>
                    setFormData({ ...formData, correctAnswer: e.target.value })
                  }
                />
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-medium mb-2">
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
                      timeLimit: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Question" : "Add Question"}
                    </>
                  )}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No questions yet. Add your first question above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Time (s)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question: any) => (
                      <TableRow key={question.id}>
                        <TableCell className="max-w-xs truncate">
                          {question.questionText}
                        </TableCell>
                        <TableCell>
                          {STAGE_NAMES[question.stage as keyof typeof STAGE_NAMES]}
                        </TableCell>
                        <TableCell className="capitalize">
                          {question.difficulty}
                        </TableCell>
                        <TableCell>{question.timeLimit}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
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
                        </TableCell>
                      </TableRow>
                    ))}
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
