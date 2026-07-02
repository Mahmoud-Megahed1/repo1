# MongoDB Migration Guide - Englishom Placement Test Platform

## 📋 نظرة عامة
هذا المشروع تم تحويله من **MySQL (Drizzle ORM)** إلى **MongoDB (Mongoose)** لتخزين نتائج اختبار تحديد المستوى.

---

## 🔧 المتطلبات

### البرامج المطلوبة:
- Node.js 18+
- npm أو pnpm
- MongoDB (محلي أو سحابي)

### المكتبات المثبتة:
```bash
- mongoose: 9.6.1
- mongodb: 7.2.0
```

---

## 🗂️ هيكل الملفات الجديد

```
server/
├── mongodb.ts                          # اتصال MongoDB
├── models/
│   ├── TestResult.ts                   # نموذج نتائج الاختبار
│   └── testResultHelpers.ts            # دوال مساعدة للعمليات
├── routers/
│   └── testRouter.ts                   # API endpoints
└── routers.ts                          # (معدّل) يتضمن testRouter

client/
└── src/
    └── pages/
        └── TestResult.tsx              # (جديد) صفحة عرض النتيجة مع خانة الإيميل
```

---

## 🔌 إعداد الاتصال

### 1. ملف .env
أضف المتغير التالي إلى ملف `.env`:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/englishom-placement-test
```

**ملاحظة:** استبدل `username`, `password`, و `cluster` بقيمك الفعلية.

### 2. الاتصال التلقائي
الاتصال يتم تلقائياً عند استدعاء أي دالة من `testResultHelpers`.

---

## 📊 نموذج البيانات (TestResult Schema)

```typescript
{
  email: string,                    // بريد الطالب (مطلوب)
  studentName?: string,             // اسم الطالب (اختياري)
  overallLevel: string,             // المستوى النهائي
  totalScore: number,               // النسبة المئوية (0-100)
  visualScore?: number,             // درجة التعرف البصري
  auditoryScore?: number,           // درجة معالجة السمعية
  spellingScore?: number,           // درجة الإملاء
  readingScore?: number,            // درجة القراءة
  vocalScore?: number,              // درجة التحدي الصوتي
  stageScores?: object,             // درجات المراحل الأخرى
  answers?: array,                  // تفاصيل الإجابات
  userId?: string,                  // معرف المستخدم (عند التسجيل)
  source: string,                   // مصدر الاختبار
  isEmailSaved: boolean,            // هل طلب حفظ النتيجة
  createdAt: Date,                  // تاريخ الإنشاء
  updatedAt: Date                   // تاريخ التحديث
}
```

---

## 🚀 API Endpoints

### 1. حفظ نتيجة اختبار
```typescript
POST /api/trpc/testResults.submitResult

Input:
{
  email: "student@example.com",
  studentName: "أحمد محمد",
  overallLevel: "intermediate",
  totalScore: 75,
  isEmailSaved: true
}

Response:
{
  success: true,
  testResultId: "507f1f77bcf86cd799439011",
  message: "تم حفظ النتيجة بنجاح"
}
```

### 2. الحصول على نتيجة بـ ID
```typescript
GET /api/trpc/testResults.getResult?testResultId=507f1f77bcf86cd799439011

Response: TestResult object
```

### 3. الحصول على نتائج بالبريد الإلكتروني
```typescript
GET /api/trpc/testResults.getResultsByEmail?email=student@example.com

Response: Array of TestResult objects
```

### 4. الحصول على أحدث نتيجة
```typescript
GET /api/trpc/testResults.getLatestResult?email=student@example.com

Response: Latest TestResult object
```

### 5. جميع النتائج (للإدارة فقط)
```typescript
GET /api/trpc/testResults.getAllResults?page=1&limit=50

Response:
{
  results: Array<TestResult>,
  pagination: {
    page: 1,
    limit: 50,
    total: 150,
    pages: 3
  }
}
```

### 6. الإحصائيات (للإدارة فقط)
```typescript
GET /api/trpc/testResults.getStatistics

Response:
{
  total: 150,
  emailsSaved: 120,
  levelDistribution: [
    { _id: "beginner", count: 30, avgScore: 45 },
    { _id: "intermediate", count: 80, avgScore: 72 }
  ]
}
```

---

## 💾 استخدام Database Helpers

### في الـ Backend:

```typescript
import {
  saveTestResult,
  getTestResultById,
  getTestResultsByEmail,
  getLatestTestResultByEmail,
  updateTestResult,
  linkTestResultToUser,
  getAllTestResults,
  getTestResultsStatistics,
} from './models/testResultHelpers';

// حفظ نتيجة جديدة
const result = await saveTestResult({
  email: 'student@example.com',
  studentName: 'أحمد',
  overallLevel: 'intermediate',
  totalScore: 75,
  isEmailSaved: true,
  source: 'placement_test',
});

// الحصول على نتائج البريد
const results = await getTestResultsByEmail('student@example.com');

// ربط النتيجة بمستخدم (عند التسجيل)
await linkTestResultToUser('student@example.com', userId);
```

---

## 🔗 الربط التلقائي (Auto-Mapping)

عند إنشاء حساب جديد:

1. تحقق من وجود نتائج اختبار سابقة بنفس البريد
2. إذا وُجدت، اربطها بـ `userId` الجديد
3. أضف وسم "From Placement Test" للتتبع

```typescript
// في signup endpoint
const existingResult = await getLatestTestResultByEmail(email);
if (existingResult) {
  await linkTestResultToUser(email, newUser.id);
  // أضف وسم للتتبع
  user.source = 'From Placement Test';
}
```

---

## 🧪 الاختبار

### اختبار الاتصال:
```bash
# تشغيل الخادم
pnpm dev

# اختبار API endpoint
curl -X POST http://localhost:3000/api/trpc/testResults.submitResult \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "studentName": "Test Student",
    "overallLevel": "intermediate",
    "totalScore": 75,
    "isEmailSaved": true
  }'
```

---

## 📝 ملاحظات مهمة

### 1. الفهارس (Indexes)
تم إنشاء فهارس تلقائياً على:
- `email` - للبحث السريع بالبريد
- `userId` - للبحث السريع بمعرف المستخدم
- `email + createdAt` - للفرز والتصفية

### 2. الأمان
- جميع الـ Admin endpoints محمية بـ `protectedProcedure`
- التحقق من `ctx.user?.role === 'admin'` مطلوب

### 3. الأداء
- استخدم `pagination` عند جلب عدد كبير من النتائج
- تجنب جلب جميع الحقول إذا لم تحتجها

### 4. معالجة الأخطاء
جميع الدوال تحتوي على معالجة أخطاء شاملة وتسجيل (logging).

---

## 🔄 الهجرة من MySQL

### الخطوات المطلوبة:

1. **نقل البيانات القديمة** (إذا لزم الأمر):
```typescript
// Script لنقل البيانات من MySQL إلى MongoDB
const oldResults = await db.query('SELECT * FROM testResults');
for (const result of oldResults) {
  await saveTestResult({
    email: result.email,
    studentName: result.studentName,
    overallLevel: result.overallLevel,
    totalScore: result.totalScore,
    // ... باقي الحقول
  });
}
```

2. **تحديث الـ Frontend** للاستخدام الجديد

3. **اختبار شامل** قبل النشر

---

## 📞 الدعم والمساعدة

### الملفات الرئيسية:
- `server/mongodb.ts` - الاتصال
- `server/models/TestResult.ts` - النموذج
- `server/models/testResultHelpers.ts` - الدوال المساعدة
- `server/routers/testRouter.ts` - API endpoints

### في حالة المشاكل:
1. تحقق من `MONGODB_URI` في `.env`
2. تأكد من اتصال الإنترنت (إذا كان MongoDB سحابي)
3. تحقق من السجلات (logs) في الكونسول

---

## ✅ Checklist للمبرمج الجديد

- [ ] تحديث `MONGODB_URI` في `.env`
- [ ] اختبار الاتصال بـ MongoDB
- [ ] تشغيل الخادم والتحقق من عدم وجود أخطاء
- [ ] اختبار API endpoints
- [ ] ربط الـ Frontend بـ API الجديد
- [ ] اختبار العملية الكاملة (حفظ → عرض → ربط)
- [ ] نقل البيانات القديمة (إذا لزم)
- [ ] النشر على الإنتاج

---

**آخر تحديث:** 2026-04-30
**النسخة:** 1.0.0
