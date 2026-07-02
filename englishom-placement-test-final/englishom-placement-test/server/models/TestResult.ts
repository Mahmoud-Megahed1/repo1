import mongoose, { Schema, Document } from 'mongoose';

/**
 * نموذج نتائج الاختبار
 * يخزن نتائج الطلاب من اختبار تحديد المستوى
 */

export interface ITestResult extends Document {
  email: string; // بريد الطالب
  studentName?: string; // اسم الطالب (اختياري)
  overallLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';
  totalScore: number; // النسبة المئوية (0-100)
  visualScore?: number;
  auditoryScore?: number;
  spellingScore?: number;
  readingScore?: number;
  vocalScore?: number;
  stageScores?: {
    [key: string]: number;
  };
  answers?: Array<{
    questionId: string;
    stage: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent?: number;
  }>;
  userId?: string; // معرف المستخدم (إذا كان مسجلاً)
  source: 'placement_test' | 'practice'; // مصدر الاختبار
  isEmailSaved: boolean; // هل طلب الطالب حفظ النتيجة على بريده
  createdAt: Date;
  updatedAt: Date;
}

const testResultSchema = new Schema<ITestResult>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // فهرسة للبحث السريع
    },
    studentName: {
      type: String,
      trim: true,
    },
    overallLevel: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'],
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    visualScore: Number,
    auditoryScore: Number,
    spellingScore: Number,
    readingScore: Number,
    vocalScore: Number,
    stageScores: {
      type: Map,
      of: Number,
    },
    answers: [
      {
        questionId: String,
        stage: String,
        userAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number,
      },
    ],
    userId: String,
    source: {
      type: String,
      enum: ['placement_test', 'practice'],
      default: 'placement_test',
    },
    isEmailSaved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// إنشاء فهرس مركب للبحث السريع
testResultSchema.index({ email: 1, createdAt: -1 });
testResultSchema.index({ userId: 1, createdAt: -1 });

export const TestResult = mongoose.model<ITestResult>('TestResult', testResultSchema);
