import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { socialMediaRouter } from "./socialMediaProcedures";
import { getPublicDashboardStats, updatePublicDashboardStats } from "./db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cache, CACHE_KEYS, CACHE_TTL } from "./cache";
import { sanitizeAchievementsArray } from "./privacy";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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
  socialMedia: socialMediaRouter,
  publicStats: router({
    get: publicProcedure.query(async () => {
      // محاولة الحصول على البيانات من الـ Cache أولاً
      const cachedStats = cache.get<any>(CACHE_KEYS.PUBLIC_STATS); // Using any or explicit type here to fix TS error.
      if (cachedStats) {
        console.log('[Cache] تم إرجاع البيانات العامة من الـ Cache');
        return cachedStats;
      }

      // إذا لم تكن البيانات في الـ Cache، جلبها من قاعدة البيانات
      const stats = await getPublicDashboardStats();
      const result = stats || {
        id: 0,
        wordsWrittenToday: 0,
        audioMinutesListened: 0,
        voiceRecordingsToday: 0,
        shieldsEarnedToday: 0,
        shieldCompletionRate: 0,
        recordedStoriesCount: 0,
        totalSpeakingSeconds: 0,
        passedStudentsCount: 0,
        quizSuccessRate: 0,
        citiesCount: 53,
        isPublished: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // حفظ البيانات في Cache لمدة 5 دقائق
      cache.set(CACHE_KEYS.PUBLIC_STATS, result, CACHE_TTL.MEDIUM);
      console.log('[Cache] تم حفظ البيانات العامة في Cache');

      return result;
    }),
    update: protectedProcedure
      .input(
        z.object({
          wordsWrittenToday: z.number().optional(),
          audioMinutesListened: z.number().optional(),
          voiceRecordingsToday: z.number().optional(),
          shieldsEarnedToday: z.number().optional(),
          shieldCompletionRate: z.number().optional(),
          recordedStoriesCount: z.number().optional(),
          totalSpeakingSeconds: z.number().optional(),
          passedStudentsCount: z.number().optional(),
          quizSuccessRate: z.number().optional(),
          citiesCount: z.number().optional(),
          isPublished: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Admin only
        if (ctx.user?.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only admins can update public stats',
          });
        }

        await updatePublicDashboardStats(input);
        const updated = await getPublicDashboardStats();
        return updated;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
