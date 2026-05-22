# 📊 بنية قاعدة البيانات - EnglishOM Blog System

## 🎯 نظرة عامة

نظام المدونة يستخدم **MySQL** مع **Drizzle ORM** ويتضمن 8 جداول رئيسية مع علاقات معقدة بينها.

---

## 📋 الجداول الرئيسية

### 1️⃣ جدول المستخدمين (users)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**الاستخدام:**
- تخزين بيانات المستخدمين المسجلين
- تحديد الأدوار (مستخدم عادي أو مدير)
- تتبع آخر تسجيل دخول

---

### 2️⃣ جدول الفئات (blog_categories)
```sql
CREATE TABLE blog_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255) NOT NULL,
  descriptionEn TEXT,
  descriptionAr TEXT,
  iconUrl VARCHAR(512),
  colorHex VARCHAR(7) DEFAULT '#2167D1',
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX slug_idx (slug)
);
```

**الاستخدام:**
- تصنيف المقالات (Grammar, Vocabulary, Pronunciation, etc.)
- دعم ثنائي اللغة (English + Arabic)
- تخزين الألوان المخصصة لكل فئة

**الأمثلة:**
- `slug: "grammar"` → `nameEn: "Grammar"` → `nameAr: "القواعد"`
- `slug: "vocabulary"` → `nameEn: "Vocabulary"` → `nameAr: "المفردات"`

---

### 3️⃣ جدول المقالات (blog_posts) ⭐ الأساسي
```sql
CREATE TABLE blog_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- المحتوى بصيغة HTML (يمكن تحويله من Markdown)
  titleEn VARCHAR(255) NOT NULL,
  titleAr VARCHAR(255) NOT NULL,
  contentEn LONGTEXT NOT NULL,          -- محتوى HTML الكامل
  contentAr LONGTEXT NOT NULL,          -- محتوى HTML الكامل
  excerptEn TEXT,                       -- ملخص قصير للعرض
  excerptAr TEXT,                       -- ملخص قصير للعرض
  
  -- الصورة
  featuredImageUrl VARCHAR(512),        -- رابط الصورة من S3
  featuredImageKey VARCHAR(512),        -- مفتاح الصورة في التخزين
  
  -- العلاقات
  categoryId INT NOT NULL,              -- ✅ ربط بجدول الفئات
  authorId INT NOT NULL,                -- ✅ ربط بجدول المستخدمين
  
  -- الحالة والنشر
  status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
  publishedAt TIMESTAMP,
  scheduledFor TIMESTAMP,
  
  -- البيانات الإضافية
  readingTimeMinutes INT DEFAULT 5,
  viewsCount INT DEFAULT 0,
  isFeatured BOOLEAN DEFAULT FALSE,
  
  -- SEO
  metaDescriptionEn VARCHAR(160),
  metaDescriptionAr VARCHAR(160),
  metaKeywordsEn VARCHAR(255),
  metaKeywordsAr VARCHAR(255),
  
  -- التتبع
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP,                  -- للحذف الناعم
  
  INDEX post_slug_idx (slug),
  INDEX post_category_idx (categoryId),
  INDEX post_author_idx (authorId),
  INDEX post_status_idx (status)
);
```

**🔑 النقاط الهامة:**

| الحقل | الوصف | الملاحظات |
|------|-------|---------|
| `slug` | معرّف فريد للمقالة | مثل: `common-phrasal-verbs` |
| `contentEn/contentAr` | المحتوى الكامل | **صيغة HTML** (من محرر Tiptap) |
| `categoryId` | ✅ ربط بالفئة | مثل: `1` (Grammar) |
| `authorId` | ✅ ربط بالمستخدم | معرّف الكاتب |
| `status` | حالة النشر | `draft` أو `published` أو `scheduled` |
| `publishedAt` | تاريخ النشر | يُملأ عند النشر |
| `featuredImageUrl` | رابط الصورة | من `/manus-storage/...` |

---

### 4️⃣ جدول الوسوم (blog_tags)
```sql
CREATE TABLE blog_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  nameEn VARCHAR(255) NOT NULL,
  nameAr VARCHAR(255) NOT NULL,
  usageCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX tag_slug_idx (slug)
);
```

**الاستخدام:**
- وسوم إضافية للمقالات (مثل: `phrasal-verbs`, `beginner`, `advanced`)
- تتبع عدد استخدام كل وسم

---

### 5️⃣ جدول ربط المقالات بالوسوم (blog_post_tags)
```sql
CREATE TABLE blog_post_tags (
  postId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (postId, tagId)
);
```

**الاستخدام:**
- علاقة Many-to-Many بين المقالات والوسوم
- مثال: المقالة `#1` يمكن أن تحتوي على الوسوم `#1, #2, #3`

---

### 6️⃣ جدول التعليقات (blog_comments)
```sql
CREATE TABLE blog_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,              -- ✅ ربط بالمقالة
  userId INT NOT NULL,              -- ✅ ربط بالمستخدم
  parentCommentId INT,              -- ✅ للتعليقات المتداخلة (Replies)
  content TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  isHelpfulCount INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  approvedAt TIMESTAMP,
  INDEX comment_post_idx (postId),
  INDEX comment_user_idx (userId),
  INDEX comment_status_idx (status)
);
```

**الاستخدام:**
- تعليقات المستخدمين على المقالات
- دعم التعليقات المتداخلة (replies)
- نظام الموافقة على التعليقات

---

### 7️⃣ جدول الوسائط (blog_media)
```sql
CREATE TABLE blog_media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT,                       -- ✅ ربط بالمقالة (اختياري)
  fileKey VARCHAR(512) NOT NULL,    -- مفتاح الملف في S3
  fileUrl VARCHAR(512) NOT NULL,    -- رابط الملف
  fileName VARCHAR(255) NOT NULL,
  fileType VARCHAR(100),            -- مثل: image/jpeg, video/mp4
  fileSize INT,                     -- حجم الملف بالبايت
  uploadedBy INT NOT NULL,          -- ✅ ربط بالمستخدم
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX media_post_idx (postId),
  INDEX media_user_idx (uploadedBy)
);
```

**الاستخدام:**
- تخزين معلومات الصور والفيديوهات
- تتبع من قام برفع الملف

---

### 8️⃣ جدول CTA (Call To Action)
```sql
CREATE TABLE blog_cta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT,                       -- ✅ ربط بالمقالة (اختياري)
  titleEn VARCHAR(255) NOT NULL,
  titleAr VARCHAR(255) NOT NULL,
  descriptionEn TEXT,
  descriptionAr TEXT,
  buttonTextEn VARCHAR(100),
  buttonTextAr VARCHAR(100),
  buttonUrl VARCHAR(512) NOT NULL,
  buttonStyle ENUM('primary', 'secondary', 'outline') DEFAULT 'primary',
  position ENUM('top', 'middle', 'bottom', 'sidebar') DEFAULT 'bottom',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**الاستخدام:**
- أزرار الحث على الإجراء (مثل: "ابدأ الدرس الآن")
- يمكن وضعها في مواقع مختلفة بالمقالة

---

### 9️⃣ جدول التحليلات (blog_analytics)
```sql
CREATE TABLE blog_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  postId INT NOT NULL,              -- ✅ ربط بالمقالة
  date DATE NOT NULL,
  views INT DEFAULT 0,
  uniqueVisitors INT DEFAULT 0,
  commentsCount INT DEFAULT 0,
  sharesCount INT DEFAULT 0,
  avgTimeOnPage INT,
  bounceRate DECIMAL(5,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX analytics_post_date_idx (postId, date)
);
```

**الاستخدام:**
- تتبع إحصائيات المقالات يومياً
- عدد المشاهدات والزوار الفريدين

---

## 🔗 العلاقات بين الجداول

### رسم توضيحي للعلاقات:

```
┌─────────────┐
│   users     │
│ (المستخدمون)│
└──────┬──────┘
       │
       ├─── authorId ──→ blog_posts (الكاتب)
       ├─── userId ──→ blog_comments (المعلّق)
       └─── uploadedBy ──→ blog_media (من رفع الملف)

┌──────────────────┐
│ blog_categories  │
│  (الفئات)        │
└────────┬─────────┘
         │
         └─── categoryId ──→ blog_posts (الفئة)

┌──────────────────┐
│   blog_posts     │
│  (المقالات) ⭐   │
└────────┬─────────┘
         │
         ├─── postId ──→ blog_comments (التعليقات)
         ├─── postId ──→ blog_media (الوسائط)
         ├─── postId ──→ blog_cta (الأزرار)
         ├─── postId ──→ blog_analytics (الإحصائيات)
         └─── postId ──→ blog_post_tags ──→ blog_tags (الوسوم)
```

---

## 💾 صيغة المحتوى (Content Format)

### المحتوى يُخزّن بصيغة HTML:

**مثال من قاعدة البيانات:**
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

**كيفية الإنشاء:**
1. المستخدم يكتب في محرر Tiptap (Rich Text Editor)
2. Tiptap يحول النص إلى HTML
3. يُحفظ في `contentEn` أو `contentAr` كـ LONGTEXT

**كيفية الاسترجاع:**
```javascript
// في الـ Frontend
const article = await trpc.blog.posts.getBySlug.useQuery({ slug: "common-phrasal-verbs" });
// article.contentEn = "<h2>What are Phrasal Verbs?</h2>..."
```

---

## 🔄 مثال عملي: ربط مقالة بفئة

### السيناريو:
إنشاء مقالة جديدة عن "Phrasal Verbs" في فئة "Vocabulary"

### الخطوات:

**1. الحصول على معرّف الفئة:**
```sql
SELECT id FROM blog_categories WHERE slug = 'vocabulary';
-- النتيجة: id = 2
```

**2. إدراج المقالة:**
```sql
INSERT INTO blog_posts (
  slug,
  titleEn,
  titleAr,
  contentEn,
  contentAr,
  categoryId,      -- ✅ ربط بالفئة (2)
  authorId,        -- معرّف الكاتب (1)
  status,
  publishedAt,
  featuredImageUrl
) VALUES (
  'common-phrasal-verbs',
  'Common Phrasal Verbs You Need to Know',
  'الأفعال الشرطية الشائعة',
  '<h2>What are Phrasal Verbs?</h2>...',
  '<h2>ما هي الأفعال الشرطية؟</h2>...',
  2,               -- ✅ معرّف الفئة
  1,               -- معرّف الكاتب
  'published',
  NOW(),
  '/manus-storage/featured-image-xyz.jpg'
);
```

**3. الاسترجاع مع معلومات الفئة:**
```sql
SELECT 
  p.id,
  p.slug,
  p.titleEn,
  p.contentEn,
  c.nameEn as categoryName,    -- ✅ اسم الفئة
  c.colorHex as categoryColor,
  u.name as authorName
FROM blog_posts p
LEFT JOIN blog_categories c ON p.categoryId = c.id
LEFT JOIN users u ON p.authorId = u.id
WHERE p.slug = 'common-phrasal-verbs';
```

---

## 🔌 الربط مع englishom.com

### الخيارات المتاحة:

#### ✅ الخيار 1: API Integration (الأفضل)
```javascript
// من englishom.com، استدعاء API المدونة
const response = await fetch('https://englishomblog.manus.space/api/trpc/blog.posts.list', {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'blog.posts.list',
    params: { limit: 10, offset: 0 }
  })
});
```

#### ✅ الخيار 2: Database Direct Connection
إذا كانت englishom.com على نفس الخادم:
```javascript
// استخدام نفس DATABASE_URL
const posts = await db.select().from(blogPosts).limit(10);
```

#### ✅ الخيار 3: Webhook Integration
عند نشر مقالة جديدة، إرسال webhook إلى englishom.com:
```javascript
// عند نشر مقالة
await notifyEnglishomWebhook({
  event: 'article.published',
  data: { postId, title, slug }
});
```

---

## 📝 ملخص للمبرمج

| المعلومة | التفاصيل |
|---------|---------|
| **عدد الجداول** | 8 جداول رئيسية |
| **صيغة المحتوى** | HTML (من محرر Tiptap) |
| **ربط المقالة بالفئة** | `blog_posts.categoryId` → `blog_categories.id` |
| **ربط المقالة بالكاتب** | `blog_posts.authorId` → `users.id` |
| **ربط التعليقات** | `blog_comments.postId` → `blog_posts.id` |
| **دعم اللغات** | كل جدول يحتوي على `En` و `Ar` |
| **الحذف الناعم** | `blog_posts.deletedAt` (لا يُحذف فعلياً) |
| **التخزين** | صور وملفات في S3 (`/manus-storage/...`) |
| **الإشعارات** | عند تعليق جديد أو مقالة جديدة |

---

## ✅ جاهز للربط!

جميع الجداول والعلاقات **جاهزة تماماً** للربط مع englishom.com. المبرمج يمكنه:
1. استدعاء API المدونة
2. أو الوصول المباشر إلى قاعدة البيانات
3. أو استخدام Webhooks للتنبيهات الفورية
