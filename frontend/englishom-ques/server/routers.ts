import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getDb, getUserProgress, updateUserProgress, getUserAchievements, addAchievement, getUserQuizHistory, upsertUser } from "./db";
import { questions, testResults } from "../drizzle/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { checkNewBadges, getBadgeInfo } from "../shared/achievements";
import axios from "axios";
import { sdk } from "./_core/sdk";

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
    adminLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const res = await axios.post("http://127.0.0.1:5000/api/admin/auth/login", {
            email: input.email,
            password: input.password,
          });
          const { user } = res.data;
          
          if (user.adminRole !== "super" && user.adminRole !== "ques_admin" && user.adminRole !== "operator") {
            throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to access Ques Admin" });
          }

          // Ensure user is in our local DB as an admin
          const openId = user._id || user.id;
          await upsertUser({
            openId: openId,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Admin",
            email: user.email,
            role: "admin",
          });

          // Create session token using sdk
          const sessionToken = await sdk.createSessionToken(openId, { name: user.firstName || "Admin" });
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
          
          return { success: true };
        } catch (error: any) {
          console.error("====== LOGIN ERROR DETAILS ======");
          console.error("Error Message:", error?.message);
          console.error("Error Response Data:", error?.response?.data);
          console.error("Error Response Status:", error?.response?.status);
          console.error("Error Stack:", error?.stack);
          console.error("=================================");
          
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: `[DEBUG] ${error?.response?.data?.message || error?.message || "Unknown error"}` 
          });
        }
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
            .select({
              id: questions.id,
              question: questions.question,
              choiceA: questions.choiceA,
              choiceB: questions.choiceB,
              choiceC: questions.choiceC,
              choiceD: questions.choiceD,
              level: questions.level,
              category: questions.category,
              timePerQuestion: questions.timePerQuestion,
            })
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
        answers: z.array(z.object({
          questionId: z.number(),
          userAnswer: z.string(),
        })),
        averageResponseTime: z.number().optional(),
        totalTimeSpent: z.number().optional(),
        studentName: z.string().optional(),
        studentPhone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {

        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        try {
          // Grade the answers securely on the server
          const questionIds = input.answers.map(a => a.questionId);
          let correctAnswersCount = 0;
          
          if (questionIds.length > 0) {
            const qs = await db.select({ id: questions.id, correctAnswer: questions.correctAnswer })
              .from(questions)
              .where(inArray(questions.id, questionIds));
              
            const correctMap = new Map(qs.map(q => [q.id, q.correctAnswer]));
            
            for (const ans of input.answers) {
              if (correctMap.get(ans.questionId) === ans.userAnswer) {
                correctAnswersCount++;
              }
            }
          }
          
          const totalQuestions = input.answers.length;
          const accuracy = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;
          const avgResponseTime = input.averageResponseTime != null ? Math.round(input.averageResponseTime) : null;

          // Insert result for both guests and logged in users
          const insertValues = {
            userId: ctx.user?.id ?? null,
            studentName: input.studentName?.trim() || null,
            studentPhone: input.studentPhone?.trim().toLowerCase() || null,
            level: input.level,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswersCount,
            accuracy: accuracy,
            averageResponseTime: avgResponseTime,
          };

          try {
            await db.insert(testResults).values(insertValues);
          } catch (insertErr: any) {
            // If FK constraint fails (userId not in users table), retry without userId
            if (insertErr?.cause?.code === 'ER_NO_REFERENCED_ROW_2' || insertErr?.code === 'ER_NO_REFERENCED_ROW_2') {
              console.warn(`[submitTestResult] userId ${insertValues.userId} not found in users table, saving without userId`);
              await db.insert(testResults).values({ ...insertValues, userId: null });
            } else {
              throw insertErr;
            }
          }

          if (ctx.user) {
            try {
              // Update user progress
              await updateUserProgress(
                ctx.user.id,
                accuracy,
                input.level,
                input.totalTimeSpent || 0,
                correctAnswersCount,
                totalQuestions
              );

              // Check for new achievements
              const userStats = await getUserProgress(ctx.user.id);
              const existingAchievements = await getUserAchievements(ctx.user.id);
              const existingBadgeTypes = existingAchievements.map(a => a.badgeType);

              if (userStats) {
                const newBadges = checkNewBadges(
                  {
                    accuracy: accuracy,
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
            } catch (progressError) {
              console.error("[submitTestResult] Error updating user progress:", progressError);
              // Don't throw - result was already saved
            }
          }

          return { 
            success: true, 
            newBadges: [],
            score: correctAnswersCount,
            accuracy: accuracy,
            totalQuestions: totalQuestions
          };
        } catch (error) {
          console.error("Failed to save test result:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Check if a student contact (phone or email) already exists in testResults
     */
    lookupStudentContact: publicProcedure
      .input(z.object({ contact: z.string() }))
      .query(async ({ input }) => {
        try {
          const db = await getDb();
          if (!db || !input.contact.trim()) return { exists: false };
          const cleanContact = input.contact.trim().toLowerCase();
          
          const existing = await db
            .select()
            .from(testResults)
            .where(eq(testResults.studentPhone, cleanContact))
            .orderBy(desc(testResults.completedAt))
            .limit(1);

          if (existing.length > 0) {
            return {
              exists: true,
              studentName: existing[0].studentName || "",
              studentPhone: existing[0].studentPhone || "",
            };
          }
          return { exists: false };
        } catch (error) {
          console.error("Error looking up student contact:", error);
          return { exists: false };
        }
      }),

    /**
     * Get user progress and statistics (supports both logged in users and guest studentPhone)
     */
    getUserProgress: publicProcedure
      .input(z.object({ studentPhone: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        try {
          const db = await getDb();
          if (ctx.user) {
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
          }
          const cleanPhone = input?.studentPhone?.trim().toLowerCase();
          if (cleanPhone && db) {
            const results = await db.select().from(testResults).where(eq(testResults.studentPhone, cleanPhone));
            if (results.length > 0) {
              const totalQuizzes = results.length;
              const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
              const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
              const avgAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalQuizzes);
              const bestAcc = Math.max(...results.map(r => r.accuracy));
              const bestRes = results.find(r => r.accuracy === bestAcc);
              const totalTime = results.reduce((sum, r) => sum + (r.averageResponseTime ? r.averageResponseTime * r.totalQuestions : 0), 0);
              return {
                totalQuizzesTaken: totalQuizzes,
                totalCorrectAnswers: totalCorrect,
                totalQuestionsAnswered: totalQuestions,
                averageAccuracy: avgAccuracy,
                bestLevel: bestRes?.level || null,
                bestAccuracy: bestAcc,
                totalTimeSpent: totalTime,
              };
            }
          }
          return {
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
     * Get user achievements (supports both logged in users and guest studentPhone)
     */
    getUserAchievements: publicProcedure
      .input(z.object({ studentPhone: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        try {
          const db = await getDb();
          if (ctx.user) {
            return await getUserAchievements(ctx.user.id);
          }
          const cleanPhone = input?.studentPhone?.trim().toLowerCase();
          if (cleanPhone && db) {
            const results = await db.select().from(testResults).where(eq(testResults.studentPhone, cleanPhone));
            if (results.length > 0) {
              const totalQuizzes = results.length;
              const avgAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalQuizzes);
              const bestAcc = Math.max(...results.map(r => r.accuracy));
              const bestRes = results.find(r => r.accuracy === bestAcc);

              const badges: { id: number; badgeType: string; badgeName: string; badgeDescription: string }[] = [];
              if (bestAcc === 100) {
                badges.push({ id: 1, badgeType: "perfect_score", badgeName: "Perfect Score", badgeDescription: "Achieve 100% accuracy in a quiz" });
              }
              if (bestAcc >= 90) {
                badges.push({ id: 2, badgeType: "accuracy_90", badgeName: "Accuracy 90%", badgeDescription: "Achieve 90% or higher accuracy in a quiz" });
              }
              if (totalQuizzes >= 10) {
                badges.push({ id: 3, badgeType: "quiz_enthusiast", badgeName: "Quiz Enthusiast", badgeDescription: "Complete 10 quizzes" });
              }
              const a1Quizzes = results.filter(r => r.level === "A1" && r.accuracy >= 80).length;
              if (a1Quizzes >= 5) {
                badges.push({ id: 4, badgeType: "a1_master", badgeName: "A1 Master", badgeDescription: "Complete 5 quizzes at A1 level with 80%+ accuracy" });
              }
              const a2Quizzes = results.filter(r => r.level === "A2" && r.accuracy >= 80).length;
              if (a2Quizzes >= 5) {
                badges.push({ id: 5, badgeType: "a2_master", badgeName: "A2 Master", badgeDescription: "Complete 5 quizzes at A2 level with 80%+ accuracy" });
              }
              return badges;
            }
          }
          return [];
        } catch (error) {
          console.error("Failed to get user achievements:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

    /**
     * Get user quiz history (supports both logged in users and guest studentPhone)
     */
    getQuizHistory: publicProcedure
      .input(z.object({ limit: z.number().default(10), studentPhone: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        try {
          const db = await getDb();
          if (ctx.user) {
            return await getUserQuizHistory(ctx.user.id, input.limit);
          }
          const cleanPhone = input?.studentPhone?.trim().toLowerCase();
          if (cleanPhone && db) {
            return await db
              .select()
              .from(testResults)
              .where(eq(testResults.studentPhone, cleanPhone))
              .orderBy(desc(testResults.completedAt))
              .limit(input.limit);
          }
          return [];
        } catch (error) {
          console.error("Failed to get quiz history:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),
  }),

  admin: router({
    /**
     * Get all test results / leads (admin only)
     */
    getAllTestResults: protectedProcedure
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
          // Fetch results joined with users (if applicable) and order by newest
          const results = await db.select().from(testResults).orderBy(desc(testResults.completedAt));
          return results;
        } catch (error) {
          console.error("Failed to fetch test results:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),

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

    /**
     * Delete a test result / lead (admin only)
     */
    deleteTestResult: protectedProcedure
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
          await db.delete(testResults).where(eq(testResults.id, input.id));
          return { success: true };
        } catch (error) {
          console.error("Failed to delete test result:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
