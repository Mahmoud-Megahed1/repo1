# تعليمات الإعداد والتثبيت

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- **Node.js 18+** - [تحميل](https://nodejs.org/)
- **pnpm 8+** - `npm install -g pnpm`

---

## 🚀 خطوات التثبيت

### الخطوة 1: فك ضغط الملف
```bash
unzip englishom-dashboard-complete.zip
cd englishom-dashboard
```

### الخطوة 2: تثبيت المتطلبات
```bash
pnpm install
```

**ملاحظة:** قد يستغرق التثبيت 5-10 دقائق في المرة الأولى.

### الخطوة 3: تشغيل خادم التطوير
```bash
pnpm dev
```

**النتيجة المتوقعة:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## 🌐 الوصول إلى التطبيق

بعد تشغيل الخادم، افتح المتصفح وانتقل إلى:
- **الصفحة الرئيسية:** http://localhost:3000/
- **لوحة البيانات:** http://localhost:3000/dashboard

---

## 🧪 تشغيل الاختبارات

### تشغيل جميع الاختبارات:
```bash
pnpm test
```

**النتيجة المتوقعة:**
```
✓ client/src/components/Footer.test.ts (4 tests)
✓ server/auth.logout.test.ts (1 test)

Test Files  2 passed (2)
Tests  5 passed (5)
```

### التحقق من TypeScript:
```bash
pnpm tsc --noEmit
```

**النتيجة المتوقعة:** بدون أخطاء

---

## 🏗️ البناء للإنتاج

### بناء التطبيق:
```bash
pnpm build
```

### معاينة الإنتاج محلياً:
```bash
pnpm preview
```

---

## 📁 الملفات المهمة

| الملف | الوصف |
|------|-------|
| `PROGRAMMER_GUIDE.md` | دليل المبرمج الشامل |
| `README_AR.md` | النسخة العربية من README |
| `todo.md` | قائمة المهام والإنجازات |
| `API_INTEGRATION.md` | تعليمات تكامل API |
| `package.json` | المتطلبات والسكريبتات |

---

## 🔧 الأوامر المتاحة

```bash
# تشغيل خادم التطوير
pnpm dev

# البناء للإنتاج
pnpm build

# معاينة الإنتاج محلياً
pnpm preview

# تشغيل الاختبارات
pnpm test

# التحقق من TypeScript
pnpm tsc --noEmit

# تنسيق الكود
pnpm format

# فحص الكود
pnpm lint
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Command not found: pnpm"
**الحل:**
```bash
npm install -g pnpm
```

### المشكلة: "Port 3000 is already in use"
**الحل:**
```bash
# استخدم منفذ مختلف
pnpm dev -- --port 3001
```

### المشكلة: "Module not found"
**الحل:**
```bash
# أعد تثبيت المتطلبات
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### المشكلة: الخريطة لا تظهر الومضات
**الحل:**
1. تحقق من أن الخادم يعمل بشكل صحيح
2. افتح أدوات المطور (F12) وتحقق من الأخطاء
3. تأكد من أن الإحداثيات صحيحة في `ArabicMapImage.tsx`

---

## 📊 هيكل المشروع

```
englishom-dashboard/
├── client/                          # تطبيق React
│   ├── src/
│   │   ├── components/              # المكونات
│   │   ├── pages/                   # الصفحات
│   │   ├── App.tsx                  # التطبيق الرئيسي
│   │   └── main.tsx                 # نقطة الدخول
│   ├── public/                      # الملفات الثابتة
│   └── index.html                   # HTML الرئيسي
├── server/                          # Express backend
│   ├── routers.ts                   # tRPC procedures
│   ├── db.ts                        # استعلامات قاعدة البيانات
│   └── auth.logout.test.ts          # الاختبارات
├── drizzle/                         # قاعدة البيانات
│   └── schema.ts                    # schema
├── package.json                     # المتطلبات
├── vite.config.ts                   # إعدادات Vite
├── vitest.config.ts                 # إعدادات الاختبارات
├── todo.md                          # قائمة المهام
├── PROGRAMMER_GUIDE.md              # دليل المبرمج
├── README_AR.md                     # النسخة العربية
└── SETUP_INSTRUCTIONS.md            # هذا الملف
```

---

## 🎯 الخطوات التالية

بعد التثبيت والتشغيل الناجح:

1. **اقرأ الملفات:**
   - `PROGRAMMER_GUIDE.md` - للتفاصيل الفنية
   - `README_AR.md` - لنظرة عامة على المشروع
   - `todo.md` - لقائمة المهام

2. **استكشف المشروع:**
   - تصفح الصفحة الرئيسية
   - اختبر لوحة البيانات
   - تحقق من الخريطة والومضات

3. **قم بالتطوير:**
   - أضف ميزات جديدة
   - عدّل التصميم
   - أكمل المهام المتبقية في `todo.md`

---

## 💡 نصائح مهمة

### 1. استخدم Hot Module Replacement (HMR)
Vite يدعم HMR، لذا التغييرات ستظهر فوراً بدون إعادة تحميل الصفحة.

### 2. استخدم أدوات المطور
افتح أدوات المطور (F12) للتحقق من الأخطاء والأداء.

### 3. اختبر على أجهزة مختلفة
استخدم أجهزة محمولة وأحجام شاشات مختلفة للتحقق من الاستجابة.

### 4. اقرأ التعليقات في الكود
الكود يحتوي على تعليقات مفيدة لفهم الوظائف.

---

## 📞 الدعم

إذا واجهت مشاكل:

1. **اقرأ الملفات:**
   - `PROGRAMMER_GUIDE.md`
   - `README_AR.md`
   - `API_INTEGRATION.md`

2. **تحقق من الأخطاء:**
   - افتح أدوات المطور (F12)
   - تحقق من console للأخطاء
   - تحقق من Network tab للطلبات

3. **جرب الحلول:**
   - أعد تثبيت المتطلبات
   - امسح ذاكرة التخزين المؤقتة
   - أعد تشغيل الخادم

---

## ✅ قائمة التحقق

- [ ] تثبيت Node.js و pnpm
- [ ] فك ضغط الملف
- [ ] تشغيل `pnpm install`
- [ ] تشغيل `pnpm dev`
- [ ] الوصول إلى http://localhost:3000
- [ ] تشغيل `pnpm test`
- [ ] قراءة الملفات المهمة
- [ ] استكشاف المشروع

---

**تم إنشاء هذا الملف:** 15 مايو 2026

**الإصدار:** 76d74f42

**الحالة:** ✅ جاهز للاستخدام
