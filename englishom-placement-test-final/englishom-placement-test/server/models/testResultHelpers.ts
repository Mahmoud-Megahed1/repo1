import { connectToDatabase } from '../mongodb';
import { TestResult, ITestResult } from './TestResult';

/**
 * دوال مساعدة للتعامل مع نتائج الاختبار في MongoDB
 * تستخدم في API endpoints والعمليات الخلفية
 */

/**
 * حفظ نتيجة اختبار جديدة
 */
export async function saveTestResult(
  data: Omit<ITestResult, '_id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await connectToDatabase();
    const testResult = new TestResult(data);
    const saved = await testResult.save();
    console.log('[TestResult] ✅ Test result saved:', saved._id);
    return saved;
  } catch (error) {
    console.error('[TestResult] ❌ Error saving test result:', error);
    throw error;
  }
}

/**
 * الحصول على نتيجة اختبار بواسطة المعرف
 */
export async function getTestResultById(id: string) {
  try {
    await connectToDatabase();
    const result = await TestResult.findById(id);
    return result;
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching test result:', error);
    throw error;
  }
}

/**
 * الحصول على نتائج الاختبار بواسطة البريد الإلكتروني
 */
export async function getTestResultsByEmail(email: string) {
  try {
    await connectToDatabase();
    const results = await TestResult.find({ email: email.toLowerCase() }).sort({
      createdAt: -1,
    });
    return results;
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching test results by email:', error);
    throw error;
  }
}

/**
 * الحصول على أحدث نتيجة اختبار لبريد معين
 */
export async function getLatestTestResultByEmail(email: string) {
  try {
    await connectToDatabase();
    const result = await TestResult.findOne({ email: email.toLowerCase() }).sort({
      createdAt: -1,
    });
    return result;
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching latest test result:', error);
    throw error;
  }
}

/**
 * الحصول على نتائج الاختبار بواسطة معرف المستخدم
 */
export async function getTestResultsByUserId(userId: string) {
  try {
    await connectToDatabase();
    const results = await TestResult.find({ userId }).sort({ createdAt: -1 });
    return results;
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching test results by user ID:', error);
    throw error;
  }
}

/**
 * تحديث نتيجة اختبار
 */
export async function updateTestResult(
  id: string,
  data: Partial<Omit<ITestResult, '_id' | 'createdAt' | 'updatedAt'>>
) {
  try {
    await connectToDatabase();
    const result = await TestResult.findByIdAndUpdate(id, data, { new: true });
    console.log('[TestResult] ✅ Test result updated:', id);
    return result;
  } catch (error) {
    console.error('[TestResult] ❌ Error updating test result:', error);
    throw error;
  }
}

/**
 * ربط نتيجة اختبار بمستخدم (عند التسجيل)
 */
export async function linkTestResultToUser(email: string, userId: string) {
  try {
    await connectToDatabase();
    const result = await TestResult.findOneAndUpdate(
      { email: email.toLowerCase(), userId: { $exists: false } },
      { userId },
      { new: true }
    );
    console.log('[TestResult] ✅ Test result linked to user:', userId);
    return result;
  } catch (error) {
    console.error('[TestResult] ❌ Error linking test result to user:', error);
    throw error;
  }
}

/**
 * حذف نتيجة اختبار
 */
export async function deleteTestResult(id: string) {
  try {
    await connectToDatabase();
    const result = await TestResult.findByIdAndDelete(id);
    console.log('[TestResult] ✅ Test result deleted:', id);
    return result;
  } catch (error) {
    console.error('[TestResult] ❌ Error deleting test result:', error);
    throw error;
  }
}

/**
 * الحصول على جميع نتائج الاختبار (للإدارة)
 */
export async function getAllTestResults(
  page: number = 1,
  limit: number = 50,
  filters?: { email?: string; source?: string }
) {
  try {
    await connectToDatabase();
    const skip = (page - 1) * limit;
    const query: any = {};

    if (filters?.email) {
      query.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters?.source) {
      query.source = filters.source;
    }

    const results = await TestResult.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TestResult.countDocuments(query);

    return {
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching all test results:', error);
    throw error;
  }
}

/**
 * إحصائيات نتائج الاختبار
 */
export async function getTestResultsStatistics() {
  try {
    await connectToDatabase();
    const stats = await TestResult.aggregate([
      {
        $group: {
          _id: '$overallLevel',
          count: { $sum: 1 },
          avgScore: { $avg: '$totalScore' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const total = await TestResult.countDocuments();
    const emailsSaved = await TestResult.countDocuments({ isEmailSaved: true });

    return {
      total,
      emailsSaved,
      levelDistribution: stats,
    };
  } catch (error) {
    console.error('[TestResult] ❌ Error fetching statistics:', error);
    throw error;
  }
}
