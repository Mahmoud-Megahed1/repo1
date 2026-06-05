const { MongoClient } = require('mongodb');

async function updateCourses() {
  const uri = 'mongodb://127.0.0.1:27017/englishom?directConnection=true';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('englishom');
    const courses = db.collection('courses');

    const updates = [
      {
        level_name: 'LEVEL_A1',
        titleAr: 'إصدار التأسيس التفاعلي',
        titleEn: 'Foundational Track',
        descriptionAr: 'تهيئة النظام وبناء النواة اللغوية الأساسية للمستخدم',
        descriptionEn: 'Initializing the system and building the basic linguistic core for the user',
        price: 999,
      },
      {
        level_name: 'LEVEL_A2',
        titleAr: 'مسار التواصل الأساسي',
        titleEn: 'Basic Interaction',
        descriptionAr: 'معالجة الصياغات المباشرة والمواقف اليومية التفاعلية',
        descriptionEn: 'Processing direct formulations and interactive daily situations',
        price: 1199,
      },
      {
        level_name: 'LEVEL_B1',
        titleAr: 'البيئة المتوسطة الذكية',
        titleEn: 'Smart Intermediate',
        descriptionAr: 'تنشيط أدوات التعبير الموقوت ومحاكاة الحوارات المتنوعة',
        descriptionEn: 'Activating timed expression tools and simulating diverse dialogues',
        price: 1399,
      },
      {
        level_name: 'LEVEL_B2',
        titleAr: 'حزمة الإتقان التقني',
        titleEn: 'Professional Suite',
        descriptionAr: 'تفعيل خوارزميات النطق المحترف وضبط التركيب النصي المتقدم',
        descriptionEn: 'Activating professional pronunciation algorithms and adjusting advanced text composition',
        price: 1499,
      },
      {
        level_name: 'LEVEL_C1',
        titleAr: 'إصدار الخبراء المتقدم',
        titleEn: 'Expert Release',
        descriptionAr: 'تحقيق معايير التحدث التلقائي والتحليل البرمجي المعقد للنصوص',
        descriptionEn: 'Achieving automatic speaking standards and complex programmatic text analysis',
        price: 1799,
      },
      {
        level_name: 'LEVEL_C2',
        titleAr: 'نظام المحاكاة الاحترافية الكاملة',
        titleEn: 'Mastery Simulation',
        descriptionAr: 'التدفق التقني الكامل ومحاكاة بيئات التحدث القيادية',
        descriptionEn: 'Complete technical flow and simulation of leadership speaking environments',
        price: 1999,
      },
    ];

    for (const update of updates) {
      const result = await courses.updateOne(
        { level_name: update.level_name },
        {
          $set: {
            titleAr: update.titleAr,
            titleEn: update.titleEn,
            descriptionAr: update.descriptionAr,
            descriptionEn: update.descriptionEn,
            price: update.price,
          },
        }
      );
      console.log(`Updated ${update.level_name}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
    }
  } catch (err) {
    console.error('Error updating courses:', err);
  } finally {
    await client.close();
  }
}

updateCourses();
