import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getQuestionsByStage,
  createTestResult,
  saveTestAnswer,
  getTestResultById,
  getTestAnswersByResultId,
  getAdminMessage,
  getAllTestResults,
} from "./db";
import { testRouter } from "./routers/testRouter";
import {
  calculateStageScore,
  calculateOverallScore,
  determineLevelFromScore,
} from "../shared/scoring";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Test management procedures
  test: router({
    // Get questions for a specific stage
    getQuestionsByStage: publicProcedure
      .input(z.object({ stage: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        const questions = await getQuestionsByStage(input.stage, input.limit);
        return questions;
      }),

    // Submit test answers and get results
    submitTest: publicProcedure
      .input(
        z.object({
          studentName: z.string().optional(),
          studentEmail: z.string().optional(),
          answers: z.array(
            z.object({
              questionId: z.number(),
              stage: z.string(),
              userAnswer: z.string().nullable(),
              isCorrect: z.boolean(),
              timeSpent: z.number().optional(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        // Calculate overall score and level
        const totalQuestions = input.answers.length;
        const correctAnswers = input.answers.filter((a) => a.isCorrect).length;
        const totalScore = Number(((correctAnswers / totalQuestions) * 100).toFixed(2));

        // Determine level based on score
        let overallLevel: any = "beginner";
        if (totalScore >= 90) overallLevel = "advanced";
        else if (totalScore >= 80) overallLevel = "upper_intermediate";
        else if (totalScore >= 70) overallLevel = "intermediate";
        else if (totalScore >= 60) overallLevel = "elementary";

        // Create test result
        const result = await createTestResult({
          userId: 0, // Anonymous user
          studentName: input.studentName,
          studentEmail: input.studentEmail,
          overallLevel,
          totalScore: totalScore.toString() as any,
        });

        // Save individual answers
        if (result && result.insertId) {
          for (const answer of input.answers) {
            await saveTestAnswer({
              testResultId: result.insertId as number,
              questionId: answer.questionId,
              stage: answer.stage as any,
              userAnswer: answer.userAnswer || undefined,
              isCorrect: answer.isCorrect ? ("yes" as any) : ("no" as any),
              timeSpent: answer.timeSpent,
            });
          }
        }

        return {
          testId: result?.insertId || 0,
          totalScore,
          overallLevel,
        };
      }),

    // Get test result details
    getResult: publicProcedure
      .input(z.object({ testId: z.number() }))
      .query(async ({ input }) => {
        const result = await getTestResultById(input.testId);
        if (!result) return null;

        const answers = await getTestAnswersByResultId(input.testId);
        const scoreVal = Number(result.totalScore);
        const scoreRange =
          scoreVal >= 90 ? "90-100" : scoreVal >= 70 ? "70-89" : "0-69";
        const message = await getAdminMessage(result.overallLevel, scoreRange);

        return {
          result,
          answers,
          message,
        };
      }),
  }),

  // Admin procedures
  admin: router({
    // Get all test results
    getAllResults: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return getAllTestResults();
    }),
  }),

  // Test results router (MongoDB)
  testResults: testRouter,
});

export type AppRouter = typeof appRouter;

// Re-export testRouter for direct imports
export { testRouter } from "./routers/testRouter";
