# 🚀 Englishom Placement Test Platform - Setup Instructions

## 📌 نظرة عامة على المشروع

هذا المشروع عبارة عن **منصة اختبار تحديد مستوى اللغة الإنجليزية** مع:
- ✅ نظام اختبار شامل (5 مراحل)
- ✅ تخزين النتائج في MongoDB
- ✅ لوحة تحكم إدارية
- ✅ دعم اللغة العربية والإنجليزية
- ✅ واجهة مستخدم حديثة

---

## 🔧 المتطلبات الأساسية

```bash
Node.js: 18+
npm/pnpm: آخر إصدار
MongoDB: محلي أو سحابي (Atlas)
```

---

## 📥 التثبيت والإعداد

### 1. استنساخ/فك ضغط المشروع
```bash
# إذا كان مضغوطاً
unzip englishom-placement-test.zip
cd englishom-placement-test
```

### 2. تثبيت المكتبات
```bash
# استخدام pnpm (موصى به)
pnpm install

# أو npm
npm install
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env` في جذر المشروع:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/englishom-placement-test

# OAuth (Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT Secret
JWT_SECRET=your_secret_key_here

# Database (MySQL - للبيانات الأخرى)
DATABASE_URL=mysql://user:password@localhost:3306/englishom

# API Keys
BUILT_IN_FORGE_API_KEY=your_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Owner Info
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id

# Frontend URLs
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# App Title
VITE_APP_TITLE=Englishom Placement Test
VITE_APP_LOGO=https://your-logo-url.png
```

### 4. تشغيل الخادم

```bash
# وضع التطوير
pnpm dev

# سيظهر:
# ✅ Frontend: http://localhost:5173
# ✅ Backend: http://localhost:3000
```

---

## 📊 هيكل المشروع

```
englishom-placement-test/
├── client/                          # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # الصفحة الرئيسية
│   │   │   ├── QuestionInputPanel.tsx  # إضافة الأسئلة
│   │   │   ├── TestPage.tsx        # صفحة الاختبار
│   │   │   └── TestResult.tsx      # عرض النتيجة
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx # لوحة التحكم
│   │   │   └── AIChatBox.tsx       # صندوق الدردشة
│   │   ├── lib/
│   │   │   └── trpc.ts             # عميل tRPC
│   │   └── App.tsx                 # التوجيه الرئيسي
│   └── index.html
│
├── server/                          # الخادم الخلفي (Express + tRPC)
│   ├── mongodb.ts                  # اتصال MongoDB
│   ├── models/
│   │   ├── TestResult.ts           # نموذج النتائج
│   │   └── testResultHelpers.ts    # دوال مساعدة
│   ├── routers/
│   │   ├── testRouter.ts           # API endpoints
│   │   └── ...
│   ├── db.ts                       # دوال قاعدة البيانات
│   └── routers.ts                  # التوجيه الرئيسي
│
├── drizzle/                         # Migrations (MySQL)
│   └── schema.ts
│
├── shared/                          # الكود المشترك
│   └── scoring.ts                  # منطق الحساب
│
├── .env                            # متغيرات البيئة
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🗄️ قواعد البيانات

### MongoDB (نتائج الاختبار)
```
Collections:
- testresults        # نتائج الاختبار
```

### MySQL (بيانات المستخدمين)
```
Tables:
- users              # المستخدمون
- questions          # الأسئلة
- testResults        # النتائج (MySQL)
- testAnswers        # الإجابات
- adminMessages      # الرسائل الإدارية
- levelThresholds    # حدود المستويات
```

---

## 🔌 API Endpoints الرئيسية

### Test Results (MongoDB)
```
POST   /api/trpc/testResults.submitResult      # حفظ نتيجة
GET    /api/trpc/testResults.getResult         # جلب نتيجة
GET    /api/trpc/testResults.getResultsByEmail # جلب النتائج بالبريد
GET    /api/trpc/testResults.getAllResults     # جميع النتائج (Admin)
GET    /api/trpc/testResults.getStatistics     # الإحصائيات (Admin)
```

### Questions
```
GET    /api/trpc/test.getQuestionsByStage      # جلب الأسئلة
POST   /api/trpc/test.submitTest               # إرسال الاختبار
GET    /api/trpc/test.getResult                # جلب النتيجة
```

### Auth
```
GET    /api/trpc/auth.me                       # بيانات المستخدم الحالي
POST   /api/trpc/auth.logout                   # تسجيل الخروج
```

---

## 🧪 الاختبار

### اختبار الاتصال بـ MongoDB
```bash
# في الكونسول
curl -X GET http://localhost:3000/api/health
```

### اختبار API
```bash
# حفظ نتيجة
curl -X POST http://localhost:3000/api/trpc/testResults.submitResult \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "studentName": "Test User",
    "overallLevel": "intermediate",
    "totalScore": 75,
    "isEmailSaved": true
  }'
```

---

## 🚀 النشر

### على Manus Platform
1. انقر على زر **Publish** في لوحة التحكم
2. اختر النطاق المخصص (custom domain)
3. انتظر اكتمال النشر

### على خادم خارجي
```bash
# بناء الإنتاج
pnpm build

# تشغيل الإنتاج
pnpm start
```

---

## 📝 ملاحظات مهمة

### 1. المصادقة (Authentication)
- يستخدم المشروع **Manus OAuth**
- جميع الـ endpoints المحمية تتطلب تسجيل دخول

### 2. الأدوار (Roles)
- **user**: مستخدم عادي
- **admin**: مسؤول النظام (يمكنه الوصول لجميع البيانات)

### 3. الأداء
- استخدم `pagination` عند جلب عدد كبير من النتائج
- فهارس MongoDB مُنشأة تلقائياً

### 4. الأمان
- لا تضع `MONGODB_URI` في الكود
- استخدم `.env` دائماً
- تحقق من الصلاحيات في جميع الـ Admin endpoints

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Cannot connect to MongoDB"
**الحل:**
1. تحقق من `MONGODB_URI` في `.env`
2. تأكد من اتصال الإنترنت
3. تحقق من صلاحيات MongoDB (IP Whitelist)

### المشكلة: "Port 3000 is already in use"
**الحل:**
```bash
# قتل العملية على المنفذ
lsof -i :3000
kill -9 <PID>
```

### المشكلة: "Module not found"
**الحل:**
```bash
# إعادة تثبيت المكتبات
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📚 موارد إضافية

- [Mongoose Documentation](https://mongoosejs.com)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Checklist قبل النشر

- [ ] تحديث جميع متغيرات `.env`
- [ ] اختبار الاتصال بـ MongoDB
- [ ] اختبار جميع API endpoints
- [ ] اختبار المصادقة (OAuth)
- [ ] اختبار الأدوار (Admin vs User)
- [ ] اختبار الواجهة الأمامية
- [ ] اختبار على أجهزة مختلفة (Desktop, Mobile)
- [ ] اختبار الأداء (Load Testing)
- [ ] مراجعة الأمان
- [ ] نسخ احتياطية من البيانات

---

**آخر تحديث:** 2026-04-30
**الإصدار:** 1.0.0
**الحالة:** جاهز للنشر ✅
