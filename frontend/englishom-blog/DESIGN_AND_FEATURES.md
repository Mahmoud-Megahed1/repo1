# 🎨 التصميم والميزات - EnglishOM Blog System

## 📱 صفحة قراءة المقال (Article Reading Page)

### التصميم الحالي:

```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Blog]                          [Share] [🌙]  │  ← Header ثابت
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📌 [Conversation] 7 min read                           │
│                                                          │
│  Common Phrasal Verbs You Need to Know                  │
│  ═══════════════════════════════════════                │
│                                                          │
│  Discover the most commonly used phrasal verbs...       │
│                                                          │
│  👤 Badr Al  •  5/10/2026  •  198 views                 │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📖 محتوى المقالة (HTML):                              │
│  ─────────────────────────────────────────              │
│  <h2>What are Phrasal Verbs?</h2>                       │
│  <p>Phrasal verbs are verbs that are made up of...</p>  │
│  <h3>Common Examples</h3>                               │
│  <ul>                                                    │
│    <li>Put up with - tolerate</li>                      │
│    <li>Look forward to - anticipate</li>                │
│    <li>Break down - stop working</li>                   │
│  </ul>                                                   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  💬 التعليقات (Comments):                              │
│  ─────────────────────────────────────────              │
│  ⚠️ "Please login to add a comment"                     │
│  (إذا كان المستخدم غير مسجل)                           │
│                                                          │
│  📝 [نموذج إضافة تعليق - للمسجلين فقط]                │
│                                                          │
│  ✅ التعليقات المعتمدة:                                │
│  - "Great article!" - John Doe                          │
│    └─ 🔄 Reply: "Thanks!" - Admin                       │
│                                                          │
│  ⏳ التعليقات المعلقة (للمدير فقط)                     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📚 المقالات ذات الصلة (Related Articles):             │
│  ─────────────────────────────────────────              │
│  [Card 1]  [Card 2]  [Card 3]                          │
│  Same Category Posts                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### ✅ الميزات المتوفرة:

- ✅ عرض المقالة الكاملة بصيغة HTML
- ✅ معلومات الكاتب والفئة والتاريخ وعدد المشاهدات
- ✅ نظام التعليقات (للمسجلين فقط)
- ✅ التعليقات المتداخلة (Replies)
- ✅ زر العودة والمشاركة
- ✅ دعم اللغتين (EN/AR) مع RTL/LTR تلقائي
- ✅ الوضع الداكن والفاتح

### ⏳ الميزات المخطط إضافتها:

- [ ] عرض المقالات ذات الصلة (Related Articles) - **جاهز في الـ Backend**
- [ ] زر المشاركة على وسائل التواصل
- [ ] نموذج الاشتراك في النشرة البريدية
- [ ] تقييم المقالة (Rating System)
- [ ] جدول المحتويات (Table of Contents)

---

## 🎛️ لوحة التحكم (Admin Dashboard)

### التصميم الحالي:

```
┌─────────────────────────────────────────────────────────┐
│ Admin Dashboard                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 [Overview] [Posts] [Categories] [Comments] [Analytics]
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Overview Tab:                                    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │ │ Total      │ │ Total      │ │ Total      │   │  │
│  │ │ Posts      │ │ Comments   │ │ Views      │   │  │
│  │ │ 0          │ │ 0          │ │ 0          │   │  │
│  │ └────────────┘ └────────────┘ └────────────┘   │  │
│  │                                                  │  │
│  │ ┌────────────┐                                  │  │
│  │ │ Pending    │                                  │  │
│  │ │ Comments   │                                  │  │
│  │ │ 0          │                                  │  │
│  │ └────────────┘                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Posts Tab:                                       │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ [+ Create Post]                                  │  │
│  │ Posts management coming soon...                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Categories Tab:                                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ [+ Create Category]                              │  │
│  │ Categories management coming soon...             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Comments Tab:                                    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Comments moderation coming soon...               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Analytics Tab:                                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Analytics dashboard coming soon...               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### ⚠️ الحالة الحالية:

**لوحة التحكم موجودة لكن تحتاج إلى إكمال الميزات:**

- ✅ الهيكل الأساسي موجود
- ✅ نظام التبويبات (Tabs) جاهز
- ✅ التحقق من صلاحيات المدير
- ⏳ **الميزات الفعلية قيد التطوير**

### 📝 كيفية الوصول إلى لوحة التحكم:

```
رابط: https://englishomblog-aksasp4i.manus.space/admin

⚠️ ملاحظة مهمة:
- اللوحة تظهر فقط للمستخدمين الذين لديهم role = "admin"
- المستخدم العادي سيرى رسالة "Access denied"
- يجب تسجيل الدخول أولاً عبر Manus OAuth
```

---

## 🔧 محرر النصوص الغني (Rich Text Editor)

### الميزات المتوفرة:

```
┌────────────────────────────────────────────┐
│ 🎨 Rich Text Editor Toolbar:               │
├────────────────────────────────────────────┤
│ [B] [I] [H2] [H3] [•] [1.] [🔗] [🖼️] [↶] [↷] │
├────────────────────────────────────────────┤
│                                            │
│ [محتوى المقالة يُكتب هنا...]              │
│                                            │
│ يُحفظ تلقائياً بصيغة HTML                 │
│                                            │
└────────────────────────────────────────────┘
```

### الأدوات المتاحة:

| الأداة | الوظيفة |
|-------|--------|
| **B** | Bold (غامق) |
| **I** | Italic (مائل) |
| **H2** | Heading 2 |
| **H3** | Heading 3 |
| **•** | Bullet List |
| **1.** | Ordered List |
| **🔗** | Insert Link |
| **🖼️** | Insert Image (URL) |
| **↶** | Undo |
| **↷** | Redo |

### مثال على الإخراج (HTML):

```html
<h2>What are Phrasal Verbs?</h2>
<p>Phrasal verbs are verbs that are made up of a main verb plus an adverb or preposition.</p>
<h3>Common Examples</h3>
<ul>
  <li>Put up with - tolerate</li>
  <li>Look forward to - anticipate</li>
  <li>Break down - stop working</li>
</ul>
```

---

## 🗄️ قاعدة البيانات - التوافق والمتطلبات

### ✅ المحرك الحالي: **MySQL** (أو TiDB)

```
Database Configuration:
├─ Engine: MySQL 8.0+
├─ ORM: Drizzle ORM
├─ Connection: DATABASE_URL (من متغيرات البيئة)
└─ Dialect: mysql
```

### 📋 الجداول الرئيسية:

| الجدول | الوصف | الحقول الرئيسية |
|--------|-------|-----------------|
| `users` | المستخدمون | id, openId, name, email, role |
| `blog_posts` | المقالات | id, slug, titleEn, contentEn, categoryId, authorId |
| `blog_categories` | الفئات | id, slug, nameEn, nameAr, colorHex |
| `blog_comments` | التعليقات | id, postId, userId, content, status |
| `blog_tags` | الوسوم | id, slug, nameEn, nameAr |
| `blog_post_tags` | ربط المقالات بالوسوم | postId, tagId |
| `blog_media` | الوسائط | id, postId, fileKey, fileUrl |
| `blog_cta` | أزرار الحث | id, postId, buttonUrl |
| `blog_analytics` | الإحصائيات | id, postId, date, views |

### ⚠️ **هام: التوافق مع منصتك**

#### ❌ **MongoDB غير مدعوم حالياً**
```
السبب: تم بناء المشروع على MySQL/TiDB مع Drizzle ORM
الحل: إذا كنت تستخدم MongoDB، يجب:
1. تحويل schema من Drizzle إلى Mongoose
2. أو استخدام MySQL/TiDB بدلاً من MongoDB
```

#### ✅ **التوافق مع englishom.com**

إذا كانت منصتك تستخدم:

**MySQL/TiDB:**
```javascript
// ✅ متوافق تماماً
// يمكن استخدام نفس DATABASE_URL
// أو ربط منفصل للمدونة
```

**PostgreSQL:**
```javascript
// ⚠️ يحتاج تحويل
// تغيير dialect من "mysql" إلى "postgresql"
// في drizzle.config.ts
```

**MongoDB:**
```javascript
// ❌ غير متوافق
// يحتاج إعادة كتابة كاملة
```

---

## 🔌 الربط مع englishom.com

### الخيار 1: API Integration (الأفضل)

```javascript
// من englishom.com
async function getLatestBlogPosts() {
  const response = await fetch(
    'https://englishomblog-aksasp4i.manus.space/api/trpc/blog.posts.list',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'blog.posts.list',
        params: { limit: 5, offset: 0 }
      })
    }
  );
  
  const result = await response.json();
  return result.result.data.posts;
}
```

### الخيار 2: Direct Database Connection

```javascript
// إذا كانت englishom.com على نفس الخادم
import { getDb } from 'englishom-blog/server/db';

const posts = await getPublishedPosts(10, 0);
```

### الخيار 3: Webhooks

```javascript
// عند نشر مقالة جديدة
POST https://englishom.com/webhooks/blog/article-published
{
  event: 'article.published',
  data: {
    postId: 1,
    title: 'Common Phrasal Verbs',
    slug: 'common-phrasal-verbs',
    categoryId: 2
  }
}
```

---

## 📊 ملخص الحالة الحالية

| المكون | الحالة | الملاحظات |
|-------|--------|---------|
| **صفحة المقالة** | ✅ 90% | تصميم جميل، تحتاج لـ Related Articles |
| **لوحة التحكم** | ⏳ 30% | الهيكل موجود، الميزات قيد التطوير |
| **محرر النصوص** | ✅ 100% | جاهز وعامل بشكل مثالي |
| **قاعدة البيانات** | ✅ 100% | MySQL جاهزة وتعمل |
| **التعليقات** | ✅ 95% | تحتاج لـ Notification System |
| **المقالات ذات الصلة** | ✅ Backend | Frontend قيد التطوير |

---

## 🎯 الخطوات التالية الموصى بها

### المرحلة 1: إكمال لوحة التحكم (أولوية عالية)
```
- [ ] واجهة إنشاء/تعديل المقالات
- [ ] واجهة إدارة الفئات
- [ ] نموذج الموافقة على التعليقات
- [ ] لوحة الإحصائيات
```

### المرحلة 2: إضافة الميزات المتقدمة
```
- [ ] عرض المقالات ذات الصلة
- [ ] نظام الإشعارات البريدية
- [ ] تقييم المقالات
- [ ] جدول المحتويات التلقائي
```

### المرحلة 3: التكامل مع englishom.com
```
- [ ] API Webhooks
- [ ] Single Sign-On (SSO)
- [ ] مشاركة المستخدمين
```

---

## 🔐 ملاحظات الأمان

✅ **المستخدمون العاديون:**
- يمكنهم قراءة المقالات المنشورة فقط
- يمكنهم إضافة التعليقات (بعد التسجيل)
- لا يمكنهم الوصول إلى لوحة التحكم

✅ **المديرون:**
- يمكنهم الوصول إلى لوحة التحكم
- يمكنهم إنشاء وتعديل وحذف المقالات
- يمكنهم الموافقة على التعليقات
- يمكنهم عرض الإحصائيات

✅ **المصادقة:**
- Manus OAuth مدمج
- جلسات آمنة مع HttpOnly Cookies
- CSRF Protection

---

## 📞 الدعم والمساعدة

إذا كنت تواجه مشاكل:

1. **تحقق من قاعدة البيانات:**
   ```sql
   SELECT * FROM blog_posts LIMIT 5;
   ```

2. **تحقق من الأخطاء:**
   - افتح Developer Console (F12)
   - تحقق من Network Tab
   - ابحث عن رسائل الخطأ

3. **اتصل بفريق الدعم:**
   - https://help.manus.im
