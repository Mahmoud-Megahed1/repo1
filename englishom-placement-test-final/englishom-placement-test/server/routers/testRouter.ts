import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import {
  saveTestResult,
  getTestResultById,
  getTestResultsByEmail,
  getLatestTestResultByEmail,
  updateTestResult,
  linkTestResultToUser,
  getAllTestResults,
  getTestResultsStatistics,
} from '../models/testResultHelpers';

/**
 * Test Router - جميع العمليات المتعلقة بنتائج الاختبار
 * يتعامل مع حفظ واسترجاع نتائج اختبار تحديد المستوى
 */

export const testRouter = router({
  /**
   * حفظ نتيجة اختبار جديدة
   * POST /api/trpc/test.submitResult
   */
  submitResult: publicProcedure
    .input(
      z.object({
        email: z.string().email('بريد إلكتروني غير صحيح'),
        studentName: z.string().optional(),
        overallLevel: z.enum([
          'beginner',
          'elementary',
          'intermediate',
          'upper-intermediate',
          'advanced',
        ]),
        totalScore: z.number().min(0).max(100),
        visualScore: z.number().optional(),
        auditoryScore: z.number().optional(),
        spellingScore: z.number().optional(),
        readingScore: z.number().optional(),
        vocalScore: z.number().optional(),
        stageScores: z.record(z.number()).optional(),
        answers: z
          .array(
            z.object({
              questionId: z.string(),
              stage: z.string(),
              userAnswer: z.string(),
              isCorrect: z.boolean(),
              timeSpent: z.number().optional(),
            })
          )
          .optional(),
        isEmailSaved: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await saveTestResult({
          email: input.email,
          studentName: input.studentName,
          overallLevel: input.overallLevel,
          totalScore: input.totalScore,
          visualScore: input.visualScore,
          auditoryScore: input.auditoryScore,
          spellingScore: input.spellingScore,
          readingScore: input.readingScore,
          vocalScore: input.vocalScore,
          stageScores: input.stageScores,
          answers: input.answers,
          isEmailSaved: input.isEmailSaved,
          source: 'placement_test',
        } as any);

        return {
          success: true,
          testResultId: result._id,
          message: 'تم حفظ النتيجة بنجاح',
        };
      } catch (error) {
        console.error('[testRouter] Error submitting result:', error);
        throw new Error('فشل حفظ النتيجة');
      }
    }),

  /**
   * الحصول على نتيجة اختبار بواسطة المعرف
   * GET /api/trpc/test.getResult
   */
  getResult: publicProcedure
    .input(z.object({ testResultId: z.string() }))
    .query(async ({ input }) => {
      try {
        const result = await getTestResultById(input.testResultId);
        if (!result) {
          throw new Error('النتيجة غير موجودة');
        }
        return result;
      } catch (error) {
        console.error('[testRouter] Error getting result:', error);
        throw error;
      }
    }),

  /**
   * الحصول على نتائج الاختبار بواسطة البريد الإلكتروني
   * GET /api/trpc/test.getResultsByEmail
   */
  getResultsByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const results = await getTestResultsByEmail(input.email);
        return results;
      } catch (error) {
        console.error('[testRouter] Error getting results by email:', error);
        throw error;
      }
    }),

  /**
   * الحصول على أحدث نتيجة اختبار لبريد معين
   * GET /api/trpc/test.getLatestResult
   */
  getLatestResult: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const result = await getLatestTestResultByEmail(input.email);
        return result;
      } catch (error) {
        console.error('[testRouter] Error getting latest result:', error);
        throw error;
      }
    }),

  /**
   * تحديث نتيجة اختبار (للإدارة)
   * PUT /api/trpc/test.updateResult
   */
  updateResult: protectedProcedure
    .input(
      z.object({
        testResultId: z.string(),
        data: z.object({
          studentName: z.string().optional(),
          isEmailSaved: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        // التحقق من أن المستخدم هو admin
        if (ctx.user?.role !== 'admin') {
          throw new Error('ليس لديك صلاحية لتحديث النتائج');
        }

        const result = await updateTestResult(input.testResultId, input.data);
        return {
          success: true,
          message: 'تم تحديث النتيجة بنجاح',
          result,
        };
      } catch (error) {
        console.error('[testRouter] Error updating result:', error);
        throw error;
      }
    }),

  /**
   * ربط نتيجة اختبار بمستخدم (عند التسجيل)
   * POST /api/trpc/test.linkToUser
   */
  linkToUser: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await linkTestResultToUser(input.email, ctx.user?.id?.toString() || '');
        return {
          success: true,
          message: 'تم ربط النتيجة بحسابك',
          result,
        };
      } catch (error) {
        console.error('[testRouter] Error linking result to user:', error);
        throw error;
      }
    }),

  /**
   * الحصول على جميع النتائج (للإدارة)
   * GET /api/trpc/test.getAllResults
   */
  getAllResults: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        email: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // التحقق من أن المستخدم هو admin
        if (ctx.user?.role !== 'admin') {
          throw new Error('ليس لديك صلاحية للوصول إلى هذه البيانات');
        }

        const results = await getAllTestResults(input.page, input.limit, {
          email: input.email,
          source: input.source,
        });

        return results;
      } catch (error) {
        console.error('[testRouter] Error getting all results:', error);
        throw error;
      }
    }),

  /**
   * الحصول على إحصائيات النتائج (للإدارة)
   * GET /api/trpc/test.getStatistics
   */
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    try {
      // التحقق من أن المستخدم هو admin
      if (ctx.user?.role !== 'admin') {
        throw new Error('ليس لديك صلاحية للوصول إلى الإحصائيات');
      }

      const stats = await getTestResultsStatistics();
      return stats;
    } catch (error) {
      console.error('[testRouter] Error getting statistics:', error);
      throw error;
    }
  }),
});
