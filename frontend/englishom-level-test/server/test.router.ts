import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getQuestionsByStage,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createTestAttempt,
  getTestAttemptBySessionId,
  saveTestResult,
  getTestResultByAttemptId,
  logAnswer,
  updateTestAttemptStatus,
} from "./db";
import { calculateCEFRLevel, analyzeStagePerformance, generateRecommendations } from "@shared/scoring";
import { nanoid } from "nanoid";

const AnswerSchema = z.object({
  questionId: z.number(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  timeSpent: z.number(),
});

export const testRouter = router({
  /**
   * Get questions for a specific stage
   */
  getStageQuestions: publicProcedure
    .input(
      z.object({
        stage: z.number().min(1).max(5),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const questions = await getQuestionsByStage(input.stage, input.limit);
      return questions.map((q) => ({
        id: q.id,
        stage: q.stage,
        questionText: q.questionText,
        imageUrl: q.imageUrl,
        audioUrl: q.audioUrl,
        options: q.options ? JSON.parse(q.options) : [],
        correctAnswer: q.correctAnswer,
        timeLimit: q.timeLimit,
      }));
    }),

  /**
   * Start a new test session
   */
  startTest: publicProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        userName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionId = `test_${nanoid()}`;
      await createTestAttempt({
        sessionId,
        email: input.email,
        userName: input.userName,
        status: "in_progress",
      });
      return { sessionId };
    }),

  /**
   * Submit test and calculate results
   */
  submitTest: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        answers: z.array(AnswerSchema),
      })
    )
    .mutation(async ({ input }) => {
      const testAttempt = await getTestAttemptBySessionId(input.sessionId);
      if (!testAttempt) {
        throw new Error("Test session not found");
      }

      // Calculate scores by stage
      const stageScores: Record<string, { correct: number; total: number }> = {
        vocabulary: { correct: 0, total: 0 },
        grammar: { correct: 0, total: 0 },
        reading: { correct: 0, total: 0 },
        listening: { correct: 0, total: 0 },
        writing: { correct: 0, total: 0 },
      };

      let totalCorrect = 0;
      const stageNames = ["vocabulary", "grammar", "reading", "listening", "writing"];

      for (const answer of input.answers) {
        // Determine stage (assuming 10 questions per stage)
        const stageIndex = Math.floor((input.answers.indexOf(answer)) / 10);
        const stageName = stageNames[stageIndex] || "vocabulary";

        if (answer.isCorrect) {
          totalCorrect++;
          stageScores[stageName].correct++;
        }
        stageScores[stageName].total++;

        // Log individual answer
        await logAnswer({
          testAttemptId: testAttempt.id,
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          isCorrect: answer.isCorrect ? 1 : 0,
          timeSpentSeconds: answer.timeSpent,
        });
      }

      // Calculate total score
      const totalScore = Math.round((totalCorrect / input.answers.length) * 100);
      const cefrLevel = calculateCEFRLevel(totalScore);

      // Calculate stage percentages
      const stagePercentages = Object.entries(stageScores).reduce(
        (acc, [stage, scores]) => ({
          ...acc,
          [stage]: scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0,
        }),
        {} as Record<string, number>
      );

      // Analyze strengths and weaknesses
      const { strengths, weaknesses } = analyzeStagePerformance(stagePercentages);
      const recommendations = generateRecommendations(totalScore, weaknesses);

      // Save test result
      await saveTestResult({
        testAttemptId: testAttempt.id,
        totalScore,
        cefrLevel: cefrLevel as any,
        vocabularyScore: stagePercentages.vocabulary || 0,
        grammarScore: stagePercentages.grammar || 0,
        readingScore: stagePercentages.reading || 0,
        listeningScore: stagePercentages.listening || 0,
        writingScore: stagePercentages.writing || 0,
        strengths: JSON.stringify(strengths),
        weaknesses: JSON.stringify(weaknesses),
        recommendations: JSON.stringify(recommendations),
      });

      // Update test attempt status
      await updateTestAttemptStatus(input.sessionId, "completed");

      return {
        sessionId: input.sessionId,
        totalScore,
        cefrLevel,
      };
    }),

  /**
   * Get test results
   */
  getResults: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const testAttempt = await getTestAttemptBySessionId(input.sessionId);
      if (!testAttempt) {
        throw new Error("Test session not found");
      }

      const result = await getTestResultByAttemptId(testAttempt.id);
      if (!result) {
        throw new Error("Test results not found");
      }

      return {
        totalScore: result.totalScore,
        cefrLevel: result.cefrLevel,
        vocabularyScore: result.vocabularyScore,
        grammarScore: result.grammarScore,
        readingScore: result.readingScore,
        listeningScore: result.listeningScore,
        writingScore: result.writingScore,
        strengths: result.strengths ? JSON.parse(result.strengths) : [],
        weaknesses: result.weaknesses ? JSON.parse(result.weaknesses) : [],
        recommendations: result.recommendations ? JSON.parse(result.recommendations) : [],
      };
    }),

  /**
   * Get all questions
   */
  getAllQuestions: publicProcedure.query(async () => {
    const allQuestions = await getAllQuestions();
    return allQuestions.map((q) => ({
      id: q.id,
      stage: q.stage,
      questionText: q.questionText,
      options: q.options ? JSON.parse(q.options) : [],
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
    }));
  }),

  /**
   * Create a new question
   */
  createQuestion: publicProcedure
    .input(
      z.object({
        stage: z.number().min(1).max(5),
        questionText: z.string(),
        options: z.string(),
        correctAnswer: z.string(),
        difficulty: z.enum(["easy", "medium", "hard"]),
        timeLimit: z.number().min(5).max(300).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createQuestion({
        stage: input.stage,
        questionText: input.questionText,
        options: input.options,
        correctAnswer: input.correctAnswer,
        difficulty: input.difficulty,
        timeLimit: input.timeLimit,
      });
      return { success: true };
    }),

  /**
   * Update a question
   */
  updateQuestion: publicProcedure
    .input(
      z.object({
        id: z.number(),
        stage: z.number().min(1).max(5),
        questionText: z.string(),
        options: z.string(),
        correctAnswer: z.string(),
        difficulty: z.enum(["easy", "medium", "hard"]),
        timeLimit: z.number().min(5).max(300).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updateQuestion(input.id, {
        stage: input.stage,
        questionText: input.questionText,
        options: input.options,
        correctAnswer: input.correctAnswer,
        difficulty: input.difficulty,
        timeLimit: input.timeLimit,
      });
      return { success: true };
    }),

  /**
   * Delete a question
   */
  deleteQuestion: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteQuestion(input.id);
      return { success: true };
    }),
});
