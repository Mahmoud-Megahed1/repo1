import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb, getUserProgress, updateUserProgress, getUserAchievements, addAchievement, getUserQuizHistory } from "./db";
import { questions, testResults } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { checkNewBadges, getBadgeInfo } from "../shared/achievements";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  quiz: router({
    /**
     * Get questions by difficulty level
     */
    getQuestionsByLevel: publicProcedure
      .input(z.object({ 
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]), 
        limit: z.number().default(10) 
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          const result = await db
            .select()
            .from(questions)
            .where(eq(questions.level, input.level))
            .limit(input.limit);
          return result;
        } catch (error) {
          console.error("Failed to fetch questions:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Submit test results with achievements tracking
     * Made public to support guest/anonymous users
     */
    submitTestResult: publicProcedure
      .input(z.object({
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
        totalQuestions: z.number(),
        correctAnswers: z.number(),
        accuracy: z.number(),
        averageResponseTime: z.number().optional(),
        totalTimeSpent: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Skip database save for guest users
        if (!ctx.user) {
          return { success: true, newBadges: [] };
        }

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          await db.insert(testResults).values({
            userId: ctx.user.id,
            level: input.level,
            totalQuestions: input.totalQuestions,
            correctAnswers: input.correctAnswers,
            accuracy: input.accuracy,
            averageResponseTime: input.averageResponseTime,
          });

          // Update user progress
          await updateUserProgress(
            ctx.user.id,
            input.accuracy,
            input.level,
            input.totalTimeSpent || 0,
            input.correctAnswers,
            input.totalQuestions
          );

          // Check for new achievements
          const userStats = await getUserProgress(ctx.user.id);
          const existingAchievements = await getUserAchievements(ctx.user.id);
          const existingBadgeTypes = existingAchievements.map(a => a.badgeType);

          if (userStats) {
            const newBadges = checkNewBadges(
              {
                accuracy: input.accuracy,
                totalQuizzes: userStats.totalQuizzesTaken,
                bestLevel: userStats.bestLevel || input.level,
                averageResponseTime: input.averageResponseTime || 0,
                totalTimeSpent: userStats.totalTimeSpent,
              },
              existingBadgeTypes
            );

            for (const badgeType of newBadges) {
              const badgeInfo = getBadgeInfo(badgeType);
              if (badgeInfo) {
                await addAchievement(
                  ctx.user.id,
                  badgeType,
                  badgeInfo.name,
                  badgeInfo.description
                );
              }
            }
          }

          return { success: true, newBadges: [] };
        } catch (error) {
          console.error("Failed to save test result:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Get user progress and statistics
     * Made public to support guest/anonymous users
     */
    getUserProgress: publicProcedure
      .query(async ({ ctx }) => {
        try {
          // Return empty progress for guest users
          if (!ctx.user) {
            return {
              totalQuizzesTaken: 0,
              totalCorrectAnswers: 0,
              totalQuestionsAnswered: 0,
              averageAccuracy: 0,
              bestLevel: null,
              bestAccuracy: 0,
              totalTimeSpent: 0,
            };
          }
          const progress = await getUserProgress(ctx.user.id);
          return progress || {
            totalQuizzesTaken: 0,
            totalCorrectAnswers: 0,
            totalQuestionsAnswered: 0,
            averageAccuracy: 0,
            bestLevel: null,
            bestAccuracy: 0,
            totalTimeSpent: 0,
          };
        } catch (error) {
          console.error("Failed to get user progress:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Get user achievements
     * Made public to support guest/anonymous users
     */
    getUserAchievements: publicProcedure
      .query(async ({ ctx }) => {
        try {
          // Return empty achievements for guest users
          if (!ctx.user) {
            return [];
          }
          const achievements = await getUserAchievements(ctx.user.id);
          return achievements;
        } catch (error) {
          console.error("Failed to get user achievements:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Get user quiz history
     * Made public to support guest/anonymous users
     */
    getQuizHistory: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        try {
          // Return empty history for guest users
          if (!ctx.user) {
            return [];
          }
          const history = await getUserQuizHistory(ctx.user.id, input.limit);
          return history;
        } catch (error) {
          console.error("Failed to get quiz history:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),
  }),

  admin: router({
    /**
     * Get all questions (admin only)
     */
    getAllQuestions: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          const result = await db.select().from(questions);
          return result;
        } catch (error) {
          console.error("Failed to fetch questions:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Create a new question (admin only)
     */
    createQuestion: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .input(z.object({
        question: z.string().min(1),
        choiceA: z.string().min(1),
        choiceB: z.string().min(1),
        choiceC: z.string().min(1),
        choiceD: z.string().min(1),
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
        category: z.string().optional(),
        timePerQuestion: z.number().min(1).max(120).default(10),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          const result = await db.insert(questions).values(input);
          return { success: true };
        } catch (error) {
          console.error("Failed to create question:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Update a question (admin only)
     */
    updateQuestion: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .input(z.object({
        id: z.number(),
        question: z.string().min(1).optional(),
        choiceA: z.string().min(1).optional(),
        choiceB: z.string().min(1).optional(),
        choiceC: z.string().min(1).optional(),
        choiceD: z.string().min(1).optional(),
        correctAnswer: z.enum(["A", "B", "C", "D"]).optional(),
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
        category: z.string().optional(),
        timePerQuestion: z.number().min(1).max(120).optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          const { id, ...updates } = input;
          await db.update(questions).set(updates).where(eq(questions.id, id));
          return { success: true };
        } catch (error) {
          console.error("Failed to update question:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Delete a question (admin only)
     */
    deleteQuestion: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        return next({ ctx });
      })
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          await db.delete(questions).where(eq(questions.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("Failed to delete question:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
