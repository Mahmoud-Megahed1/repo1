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
  getAllAdminMessages,
  upsertAdminMessage,
  getAvailableStages,
  getAllTestResults,
  upsertUser,
  getAllQuestions,
  getQuestionLevels,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  deleteTestResult,
} from "./db";
import axios from "axios";
import { sdk } from "./_core/sdk";
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
    adminLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const res = await axios.post("http://127.0.0.1:5000/api/admin/auth/login", {
            email: input.email,
            password: input.password,
          });
          const { user } = res.data;
          
          if (user.adminRole !== "super" && user.adminRole !== "test_admin" && user.adminRole !== "operator") {
            throw new Error("You don't have permission to access Admin dashboard");
          }

          const openId = user._id || user.id;
          await upsertUser({
            openId: openId,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Admin",
            email: user.email,
            role: "admin",
          });

          const sessionToken = await sdk.createSessionToken(openId, { name: user.firstName || "Admin" });
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
          
          return { success: true };
        } catch (error: any) {
          throw new Error(error.response?.data?.message || error.message || "Invalid email or password");
        }
      }),
  }),

  // Test management procedures
  test: router({
    getAvailableStages: publicProcedure.query(async () => {
      const stages = await getAvailableStages();
      return stages;
    }),

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

        const questionIds = input.answers.map(a => a.questionId);
        const questionLevels = await getQuestionLevels(questionIds);
        
        // Count frequencies of each level
        const levelCounts: Record<string, number> = {
          beginner: 0,
          elementary: 0,
          intermediate: 0,
          upper_intermediate: 0,
          advanced: 0
        };

        for (const q of questionLevels) {
          if (levelCounts[q.level] !== undefined) {
            levelCounts[q.level]++;
          }
        }

        // Find the majority level.
        // In case of a tie, the order of iteration in Object.entries will usually pick the first one it encounters.
        // We can enforce a tie breaker by selecting the highest level in case of tie.
        const LEVELS_ORDER = ["beginner", "elementary", "intermediate", "upper_intermediate", "advanced"];
        let overallLevel: any = "beginner";
        let maxCount = -1;

        for (const level of LEVELS_ORDER) {
          if (levelCounts[level] >= maxCount && levelCounts[level] > 0) {
            maxCount = levelCounts[level];
            overallLevel = level;
          }
        }

        // If no questions were answered or found, default to beginner
        if (maxCount === -1) overallLevel = "beginner";

        const getStageScore = (stageName: string) => {
          const stageAnswers = input.answers.filter((a) => a.stage === stageName);
          if (stageAnswers.length === 0) return null;
          const correctCount = stageAnswers.filter((a) => a.isCorrect).length;
          return Number(((correctCount / stageAnswers.length) * 100).toFixed(2));
        };

        const visualScore = getStageScore("visual_recognition");
        const auditoryScore = getStageScore("auditory_processing");
        const spellingScore = getStageScore("spelling_structure");
        const readingScore = getStageScore("reading_sprint");
        const vocalScore = getStageScore("vocal_challenge");

        // Create test result
        const result = await createTestResult({
          userId: 0, // Anonymous user
          studentName: input.studentName,
          studentEmail: input.studentEmail,
          overallLevel,
          totalScore: totalScore.toString() as any,
          visualScore: visualScore !== null ? visualScore.toString() as any : null,
          auditoryScore: auditoryScore !== null ? auditoryScore.toString() as any : null,
          spellingScore: spellingScore !== null ? spellingScore.toString() as any : null,
          readingScore: readingScore !== null ? readingScore.toString() as any : null,
          vocalScore: vocalScore !== null ? vocalScore.toString() as any : null,
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

    // Delete a test result
    deleteResult: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return deleteTestResult(input.id);
      }),
    
    // Feedback Messages Management
    getAllMessages: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return getAllAdminMessages();
    }),
    
    upsertMessage: protectedProcedure
      .input(
        z.object({
          level: z.string(),
          scoreRange: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return upsertAdminMessage(input.level, input.scoreRange, input.message);
      }),
    
    // Question Management
    getAllQuestions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return getAllQuestions();
    }),
    createQuestion: protectedProcedure
      .input(
        z.object({
          stage: z.enum(['visual_recognition', 'auditory_processing', 'spelling_structure', 'reading_sprint', 'vocal_challenge']),
          level: z.enum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'upper_intermediate'] as const),
          questionText: z.string(),
          imageUrl: z.string().optional(),
          audioUrl: z.string().optional(),
          correctAnswer: z.string(),
          options: z.array(z.string()),
          timeLimit: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        // Map frontend level "upper_intermediate" to backend level "upper-intermediate" if needed
        const mappedLevel = input.level === 'upper_intermediate' ? 'upper-intermediate' : input.level;
        return createQuestion({
          stage: input.stage,
          level: mappedLevel as any,
          questionText: input.questionText,
          imageData: input.imageUrl,
          audioData: input.audioUrl,
          correctAnswer: input.correctAnswer,
          options: input.options,
          timeLimit: input.timeLimit,
        });
      }),
    updateQuestion: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          stage: z.enum(['visual_recognition', 'auditory_processing', 'spelling_structure', 'reading_sprint', 'vocal_challenge']).optional(),
          level: z.enum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'upper_intermediate'] as const).optional(),
          questionText: z.string().optional(),
          imageUrl: z.string().optional(),
          audioUrl: z.string().optional(),
          correctAnswer: z.string().optional(),
          options: z.array(z.string()).optional(),
          timeLimit: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, options, imageUrl, audioUrl, level, ...rest } = input;
        const dataToUpdate: any = { ...rest };
        if (options) {
          dataToUpdate.options = options;
        }
        if (imageUrl !== undefined) dataToUpdate.imageData = imageUrl;
        if (audioUrl !== undefined) dataToUpdate.audioData = audioUrl;
        if (level !== undefined) {
          dataToUpdate.level = level === 'upper_intermediate' ? 'upper-intermediate' : level;
        }
        return updateQuestion(id, dataToUpdate);
      }),
    deleteQuestion: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return deleteQuestion(input.id);
      }),
  }),

  // Test results router (MongoDB)
  testResults: testRouter,
});

export type AppRouter = typeof appRouter;

// Re-export testRouter for direct imports
export { testRouter } from "./routers/testRouter";
