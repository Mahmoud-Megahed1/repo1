import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  console.log('🌱 Starting seed data...');

  // Insert categories
  const categories = [
    { slug: 'grammar', nameEn: 'Grammar', nameAr: 'القواعد', colorHex: '#2167D1', isActive: true },
    { slug: 'vocabulary', nameEn: 'Vocabulary', nameAr: 'المفردات', colorHex: '#4CA853', isActive: true },
    { slug: 'pronunciation', nameEn: 'Pronunciation', nameAr: 'النطق', colorHex: '#F5BB41', isActive: true },
    { slug: 'conversation', nameEn: 'Conversation', nameAr: 'المحادثة', colorHex: '#2167D1', isActive: true },
    { slug: 'business-english', nameEn: 'Business English', nameAr: 'الإنجليزية للأعمال', colorHex: '#4CA853', isActive: true },
  ];

  for (const cat of categories) {
    await connection.execute(
      'INSERT INTO blog_categories (slug, nameEn, nameAr, colorHex, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [cat.slug, cat.nameEn, cat.nameAr, cat.colorHex, cat.isActive]
    );
  }
  console.log('✅ Categories inserted');

  // Get category IDs
  const [categories_result] = await connection.execute('SELECT id FROM blog_categories LIMIT 5');
  const categoryIds = categories_result.map(c => c.id);

  // Insert blog posts
  const posts = [
    {
      slug: 'present-perfect-tense',
      titleEn: 'Master the Present Perfect Tense',
      titleAr: 'إتقان زمن المضارع التام',
      excerptEn: 'Learn how to use the present perfect tense correctly in English.',
      excerptAr: 'تعلم كيفية استخدام زمن المضارع التام بشكل صحيح.',
      contentEn: '<h2>What is Present Perfect?</h2><p>The present perfect tense is used to describe actions that happened at an unspecified time in the past or actions that started in the past and continue to the present.</p><h3>Examples</h3><ul><li>I have lived here for 5 years.</li><li>She has visited Paris three times.</li><li>They have been friends since childhood.</li></ul>',
      contentAr: '<h2>ما هو المضارع التام؟</h2><p>يُستخدم زمن المضارع التام لوصف الأفعال التي حدثت في وقت غير محدد في الماضي أو الأفعال التي بدأت في الماضي وتستمر حتى الحاضر.</p>',
      categoryId: categoryIds[0],
      authorId: 1,
      status: 'published',
      isFeatured: true,
      readingTimeMinutes: 5,
      viewsCount: 245,
      publishedAt: new Date(),
    },
    {
      slug: 'common-phrasal-verbs',
      titleEn: 'Common Phrasal Verbs You Need to Know',
      titleAr: 'الأفعال الجملية الشائعة التي تحتاج إلى معرفتها',
      excerptEn: 'Discover the most commonly used phrasal verbs in English conversation.',
      excerptAr: 'اكتشف الأفعال الجملية الأكثر استخداماً في المحادثة الإنجليزية.',
      contentEn: '<h2>What are Phrasal Verbs?</h2><p>Phrasal verbs are verbs that are made up of a main verb plus an adverb or preposition.</p><h3>Common Examples</h3><ul><li>Put up with - tolerate</li><li>Look forward to - anticipate</li><li>Break down - stop working</li></ul>',
      contentAr: '<h2>ما هي الأفعال الجملية؟</h2><p>الأفعال الجملية هي أفعال تتكون من فعل رئيسي بالإضافة إلى ظرف أو حرف جر.</p>',
      categoryId: categoryIds[1],
      authorId: 1,
      status: 'published',
      isFeatured: true,
      readingTimeMinutes: 7,
      viewsCount: 189,
      publishedAt: new Date(),
    },
    {
      slug: 'improve-pronunciation',
      titleEn: 'Tips to Improve Your English Pronunciation',
      titleAr: 'نصائح لتحسين نطقك للإنجليزية',
      excerptEn: 'Practical techniques to enhance your English pronunciation skills.',
      excerptAr: 'تقنيات عملية لتحسين مهارات النطق الإنجليزية لديك.',
      contentEn: '<h2>Pronunciation Tips</h2><p>Good pronunciation is essential for effective communication.</p><h3>Key Techniques</h3><ul><li>Listen to native speakers</li><li>Practice with tongue twisters</li><li>Record yourself and compare</li></ul>',
      contentAr: '<h2>نصائح النطق</h2><p>النطق الجيد ضروري للتواصل الفعال.</p>',
      categoryId: categoryIds[2],
      authorId: 1,
      status: 'published',
      isFeatured: false,
      readingTimeMinutes: 6,
      viewsCount: 156,
      publishedAt: new Date(),
    },
    {
      slug: 'daily-conversation-phrases',
      titleEn: 'Essential Daily Conversation Phrases',
      titleAr: 'عبارات المحادثة اليومية الأساسية',
      excerptEn: 'Learn the phrases you need for everyday English conversations.',
      excerptAr: 'تعلم العبارات التي تحتاجها للمحادثات الإنجليزية اليومية.',
      contentEn: '<h2>Greeting Phrases</h2><p>Here are some useful phrases for daily conversations.</p><h3>Examples</h3><ul><li>How are you doing?</li><li>What\'s up?</li><li>See you later!</li></ul>',
      contentAr: '<h2>عبارات التحية</h2><p>إليك بعض العبارات المفيدة للمحادثات اليومية.</p>',
      categoryId: categoryIds[3],
      authorId: 1,
      status: 'published',
      isFeatured: true,
      readingTimeMinutes: 4,
      viewsCount: 312,
      publishedAt: new Date(),
    },
    {
      slug: 'business-email-writing',
      titleEn: 'How to Write Professional Business Emails',
      titleAr: 'كيفية كتابة رسائل بريد إلكتروني احترافية',
      excerptEn: 'Master the art of writing effective business emails in English.',
      excerptAr: 'أتقن فن كتابة رسائل بريد إلكتروني فعالة للأعمال.',
      contentEn: '<h2>Email Structure</h2><p>A professional email should have a clear structure.</p><h3>Key Components</h3><ul><li>Subject line</li><li>Greeting</li><li>Body</li><li>Closing</li></ul>',
      contentAr: '<h2>هيكل البريد الإلكتروني</h2><p>يجب أن يكون البريد الإلكتروني الاحترافي له هيكل واضح.</p>',
      categoryId: categoryIds[4],
      authorId: 1,
      status: 'published',
      isFeatured: false,
      readingTimeMinutes: 8,
      viewsCount: 267,
      publishedAt: new Date(),
    },
  ];

  for (const post of posts) {
    await connection.execute(
      `INSERT INTO blog_posts 
       (slug, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, categoryId, authorId, status, isFeatured, readingTimeMinutes, viewsCount, publishedAt, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        post.slug,
        post.titleEn,
        post.titleAr,
        post.excerptEn,
        post.excerptAr,
        post.contentEn,
        post.contentAr,
        post.categoryId,
        post.authorId,
        post.status,
        post.isFeatured,
        post.readingTimeMinutes,
        post.viewsCount,
        post.publishedAt,
      ]
    );
  }
  console.log('✅ Blog posts inserted');

  console.log('✅ Seed data completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error seeding data:', error);
  process.exit(1);
} finally {
  await connection.end();
}
