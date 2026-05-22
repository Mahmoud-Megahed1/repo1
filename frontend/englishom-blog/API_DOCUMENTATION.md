# 🔌 API Documentation - EnglishOM Blog System

## 📌 نقطة الدخول الرئيسية

```
Base URL: https://englishomblog-aksasp4i.manus.space/api/trpc
```

---

## 📚 جميع الإجراءات المتاحة (Procedures)

### 🔐 المصادقة (Authentication)

#### `auth.me`
**الوصف:** الحصول على بيانات المستخدم الحالي
```javascript
const user = await trpc.auth.me.useQuery();
// النتيجة: { id, name, email, role, ... }
```

#### `auth.logout`
**الوصف:** تسجيل الخروج
```javascript
await trpc.auth.logout.useMutation();
```

---

### 📰 المقالات (Blog Posts)

#### `blog.posts.list` ✅
**الوصف:** الحصول على قائمة المقالات المنشورة
```javascript
const { data, isLoading } = trpc.blog.posts.list.useQuery({
  limit: 10,
  offset: 0,
  categoryId?: 2,  // اختياري - تصفية حسب الفئة
  search?: "phrasal verbs"  // اختياري - البحث
});

// النتيجة:
// {
//   posts: [
//     {
//       id: 1,
//       slug: "common-phrasal-verbs",
//       titleEn: "Common Phrasal Verbs You Need to Know",
//       titleAr: "الأفعال الشرطية الشائعة",
//       excerptEn: "Discover the most commonly used...",
//       contentEn: "<h2>What are Phrasal Verbs?</h2>...",
//       categoryId: 2,
//       authorId: 1,
//       status: "published",
//       publishedAt: "2026-05-10T...",
//       viewsCount: 189,
//       readingTimeMinutes: 7,
//       author: { id: 1, name: "Badr Al" },
//       category: { id: 2, nameEn: "Vocabulary", nameAr: "المفردات" }
//     },
//     ...
//   ],
//   total: 45
// }
```

#### `blog.posts.featured` ✅
**الوصف:** الحصول على المقالات المميزة (Featured)
```javascript
const { data } = trpc.blog.posts.featured.useQuery({ limit: 6 });
// النتيجة: نفس صيغة blog.posts.list
```

#### `blog.posts.getBySlug` ✅
**الوصف:** الحصول على مقالة واحدة حسب الـ slug
```javascript
const { data: article } = trpc.blog.posts.getBySlug.useQuery({
  slug: "common-phrasal-verbs"
});

// النتيجة:
// {
//   id: 1,
//   slug: "common-phrasal-verbs",
//   titleEn: "Common Phrasal Verbs You Need to Know",
//   contentEn: "<h2>What are Phrasal Verbs?</h2>...",
//   contentAr: "<h2>ما هي الأفعال الشرطية؟</h2>...",
//   author: { id: 1, name: "Badr Al", email: "..." },
//   category: { id: 2, nameEn: "Vocabulary", colorHex: "#4CA853" },
//   viewsCount: 189,
//   publishedAt: "2026-05-10T09:45:00Z"
// }
```

#### `blog.posts.create` 🔐 (Admin Only)
**الوصف:** إنشاء مقالة جديدة
```javascript
const { mutate } = trpc.blog.posts.create.useMutation();

mutate({
  slug: "new-article",
  titleEn: "New Article Title",
  titleAr: "عنوان المقالة الجديدة",
  contentEn: "<h2>Content here</h2>...",
  contentAr: "<h2>المحتوى هنا</h2>...",
  categoryId: 2,  // معرّف الفئة
  status: "published",
  readingTimeMinutes: 5,
  metaDescriptionEn: "SEO description",
  metaDescriptionAr: "وصف SEO",
  featuredImageUrl: "/manus-storage/image.jpg"
}, {
  onSuccess: (data) => {
    console.log("Article created:", data);
  }
});
```

#### `blog.posts.update` 🔐 (Admin Only)
**الوصف:** تحديث مقالة
```javascript
const { mutate } = trpc.blog.posts.update.useMutation();

mutate({
  id: 1,
  titleEn: "Updated Title",
  contentEn: "<h2>Updated content</h2>...",
  status: "published"
}, {
  onSuccess: () => {
    console.log("Article updated");
  }
});
```

#### `blog.posts.delete` 🔐 (Admin Only)
**الوصف:** حذف مقالة (حذف ناعم - soft delete)
```javascript
const { mutate } = trpc.blog.posts.delete.useMutation();

mutate({ id: 1 }, {
  onSuccess: () => {
    console.log("Article deleted");
  }
});
```

---

### 📂 الفئات (Categories)

#### `blog.categories.list` ✅
**الوصف:** الحصول على جميع الفئات
```javascript
const { data: categories } = trpc.blog.categories.list.useQuery();

// النتيجة:
// [
//   {
//     id: 1,
//     slug: "grammar",
//     nameEn: "Grammar",
//     nameAr: "القواعد",
//     colorHex: "#2167D1",
//     displayOrder: 1
//   },
//   {
//     id: 2,
//     slug: "vocabulary",
//     nameEn: "Vocabulary",
//     nameAr: "المفردات",
//     colorHex: "#4CA853",
//     displayOrder: 2
//   },
//   ...
// ]
```

#### `blog.categories.getBySlug` ✅
**الوصف:** الحصول على فئة واحدة مع مقالاتها
```javascript
const { data } = trpc.blog.categories.getBySlug.useQuery({
  slug: "vocabulary",
  limit: 10,
  offset: 0
});

// النتيجة:
// {
//   category: { id: 2, nameEn: "Vocabulary", ... },
//   posts: [ ... ]
// }
```

#### `blog.categories.create` 🔐 (Admin Only)
**الوصف:** إنشاء فئة جديدة
```javascript
const { mutate } = trpc.blog.categories.create.useMutation();

mutate({
  slug: "business-english",
  nameEn: "Business English",
  nameAr: "الإنجليزية للأعمال",
  colorHex: "#F5BB41",
  displayOrder: 5
}, {
  onSuccess: (category) => {
    console.log("Category created:", category);
  }
});
```

#### `blog.categories.update` 🔐 (Admin Only)
**الوصف:** تحديث فئة
```javascript
const { mutate } = trpc.blog.categories.update.useMutation();

mutate({
  id: 2,
  nameEn: "Vocabulary Updated",
  colorHex: "#4CA853"
});
```

---

### 💬 التعليقات (Comments)

#### `blog.comments.list` ✅
**الوصف:** الحصول على تعليقات المقالة
```javascript
const { data: comments } = trpc.blog.comments.list.useQuery({
  postId: 1,
  status: "approved"  // اختياري: approved, pending, rejected
});

// النتيجة:
// [
//   {
//     id: 1,
//     postId: 1,
//     userId: 5,
//     content: "Great article!",
//     status: "approved",
//     createdAt: "2026-05-10T...",
//     user: { id: 5, name: "John Doe", email: "john@example.com" },
//     replies: [
//       {
//         id: 2,
//         parentCommentId: 1,
//         content: "Thanks!",
//         user: { ... }
//       }
//     ]
//   }
// ]
```

#### `blog.comments.create` 🔐 (Authenticated Users Only)
**الوصف:** إضافة تعليق جديد
```javascript
const { mutate } = trpc.blog.comments.create.useMutation();

mutate({
  postId: 1,
  content: "This is a great article! Thanks for sharing.",
  parentCommentId: null  // اختياري - للرد على تعليق
}, {
  onSuccess: (comment) => {
    console.log("Comment created:", comment);
    // سيتم إرسال إشعار للمدير تلقائياً
  }
});
```

#### `blog.comments.approve` 🔐 (Admin Only)
**الوصف:** الموافقة على تعليق
```javascript
const { mutate } = trpc.blog.comments.approve.useMutation();

mutate({ commentId: 1 });
```

#### `blog.comments.reject` 🔐 (Admin Only)
**الوصف:** رفض تعليق
```javascript
const { mutate } = trpc.blog.comments.reject.useMutation();

mutate({ commentId: 1 });
```

---

### 🏷️ الوسوم (Tags)

#### `blog.tags.list` ✅
**الوصف:** الحصول على جميع الوسوم
```javascript
const { data: tags } = trpc.blog.tags.list.useQuery();

// النتيجة:
// [
//   { id: 1, slug: "phrasal-verbs", nameEn: "Phrasal Verbs", usageCount: 5 },
//   { id: 2, slug: "beginner", nameEn: "Beginner", usageCount: 12 },
//   ...
// ]
```

---

### 📊 التحليلات (Analytics)

#### `blog.analytics.getPostStats` 🔐 (Admin Only)
**الوصف:** الحصول على إحصائيات المقالة
```javascript
const { data: stats } = trpc.blog.analytics.getPostStats.useQuery({
  postId: 1,
  days: 30  // آخر 30 يوم
});

// النتيجة:
// {
//   totalViews: 1250,
//   uniqueVisitors: 890,
//   avgTimeOnPage: 245,  // بالثواني
//   bounceRate: 32.5,
//   dailyStats: [
//     { date: "2026-05-10", views: 45, uniqueVisitors: 32 },
//     { date: "2026-05-09", views: 38, uniqueVisitors: 28 },
//     ...
//   ]
// }
```

---

## 🔄 أمثلة عملية للربط مع englishom.com

### مثال 1: عرض آخر 5 مقالات على الصفحة الرئيسية
```javascript
// في englishom.com
async function getLatestBlogPosts() {
  const response = await fetch('https://englishomblog-aksasp4i.manus.space/api/trpc/blog.posts.list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'blog.posts.list',
      params: { limit: 5, offset: 0 }
    })
  });
  
  const result = await response.json();
  return result.result.data.posts;
}
```

### مثال 2: عرض مقالة كاملة
```javascript
async function getArticleContent(slug) {
  const response = await fetch('https://englishomblog-aksasp4i.manus.space/api/trpc/blog.posts.getBySlug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'blog.posts.getBySlug',
      params: { slug }
    })
  });
  
  const result = await response.json();
  const article = result.result.data;
  
  // عرض المحتوى
  document.getElementById('article-title').textContent = article.titleEn;
  document.getElementById('article-content').innerHTML = article.contentEn;
  document.getElementById('article-author').textContent = article.author.name;
}
```

### مثال 3: إضافة تعليق (للمستخدمين المسجلين)
```javascript
async function submitComment(postId, content) {
  const response = await fetch('https://englishomblog-aksasp4i.manus.space/api/trpc/blog.comments.create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`  // إذا لزم الأمر
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'blog.comments.create',
      params: { postId, content }
    })
  });
  
  const result = await response.json();
  console.log("Comment submitted:", result);
  // سيتم إرسال إشعار للمدير تلقائياً
}
```

---

## 🔐 الصلاحيات (Permissions)

| الإجراء | المستخدم العادي | المدير |
|--------|-----------------|--------|
| `blog.posts.list` | ✅ | ✅ |
| `blog.posts.getBySlug` | ✅ | ✅ |
| `blog.posts.create` | ❌ | ✅ |
| `blog.posts.update` | ❌ | ✅ |
| `blog.posts.delete` | ❌ | ✅ |
| `blog.categories.list` | ✅ | ✅ |
| `blog.categories.create` | ❌ | ✅ |
| `blog.comments.create` | ✅ (مسجل) | ✅ |
| `blog.comments.approve` | ❌ | ✅ |
| `blog.analytics.getPostStats` | ❌ | ✅ |

---

## 📧 الإشعارات التلقائية

### عند إضافة تعليق جديد:
```
✉️ إشعار يُرسل للمدير:
- عنوان: "تعليق جديد على المقالة: Common Phrasal Verbs"
- المحتوى: "John Doe أضاف تعليقاً: Great article!"
- رابط: https://englishomblog-aksasp4i.manus.space/blog/common-phrasal-verbs
```

### عند نشر مقالة جديدة:
```
✉️ إشعار يُرسل للمدير:
- عنوان: "مقالة جديدة منشورة: New Article Title"
- المحتوى: "تم نشر المقالة بنجاح"
- رابط: https://englishomblog-aksasp4i.manus.space/blog/new-article
```

---

## 🛠️ معلومات تقنية للمبرمج

| المعلومة | القيمة |
|---------|--------|
| **Framework** | tRPC 11 + React 19 |
| **Database** | MySQL with Drizzle ORM |
| **Language** | TypeScript |
| **API Format** | JSON-RPC 2.0 |
| **Authentication** | Manus OAuth |
| **Content Format** | HTML (from Tiptap editor) |
| **File Storage** | S3 via Manus |
| **Notifications** | Built-in Manus notifications |

---

## ✅ جاهز للاستخدام!

جميع الإجراءات **مختبرة وجاهزة** للاستخدام الفوري. يمكن للمبرمج:
1. استدعاء أي إجراء من englishom.com
2. أو دمج المدونة مباشرة في الموقع الرئيسي
3. أو استخدام Webhooks للتنبيهات الفورية
