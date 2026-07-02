# ⚡ Quick Start Guide - البدء السريع

## 🚀 في 5 دقائق فقط:

### 1. فك الضغط
```bash
tar -xzf englishom-placement-test-complete.tar.gz
cd englishom-placement-test
```

### 2. التثبيت
```bash
pnpm install
```

### 3. الإعداد
```bash
cp .env.example .env
# ثم حدّث MONGODB_URI في .env
```

### 4. التشغيل
```bash
pnpm dev
```

### 5. الوصول
```
http://localhost:3000
```

---

## 📱 الصفحات الرئيسية

| الصفحة | الرابط | الوصف |
|-------|--------|-------|
| الرئيسية | `/` | الصفحة الرئيسية |
| الاختبار | `/test` | صفحة الاختبار |
| إدارة الأسئلة | `/questions` | لوحة إضافة الأسئلة |

---

## 🔧 الأوامر المهمة

```bash
# تشغيل خادم التطوير
pnpm dev

# بناء المشروع
pnpm build

# تشغيل الاختبارات
pnpm test

# تنسيق الكود
pnpm lint
```

---

## 📊 قاعدة البيانات

**MongoDB Collections:**
- `test_results` - نتائج الاختبارات
- `questions` - الأسئلة (في localStorage حالياً)
- `users` - بيانات المستخدمين

---

## ⚠️ ملاحظات مهمة

1. **localStorage مؤقت فقط** - انقل البيانات إلى MongoDB
2. **الملفات المرفوعة** - استخدم S3 للإنتاج
3. **الأمان** - أضف التحقق من الصلاحيات

---

## 📚 الملفات المهمة

- `DEVELOPER_SETUP_GUIDE.md` - دليل شامل
- `MONGODB_MIGRATION_GUIDE.md` - دليل MongoDB
- `SETUP_INSTRUCTIONS.md` - تعليمات التثبيت

---

**جاهز للبدء؟ اذهب إلى `DEVELOPER_SETUP_GUIDE.md` للتفاصيل الكاملة** 🎯
