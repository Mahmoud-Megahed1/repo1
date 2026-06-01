import { drizzle } from "drizzle-orm/mysql2";
import { questions, adminMessages, levelThresholds } from "../drizzle/schema.ts";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Seeding database...");

  // Seed Visual Recognition Questions
  const visualQuestions = [
    {
      stage: "visual_recognition",
      level: "beginner",
      questionText: "What is this?",
      imageUrl: "https://via.placeholder.com/300x200?text=Apple",
      correctAnswer: "apple",
      options: JSON.stringify(["apple", "orange", "banana", "grape", "pear"]),
    },
    {
      stage: "visual_recognition",
      level: "beginner",
      questionText: "What is this?",
      imageUrl: "https://via.placeholder.com/300x200?text=Cat",
      correctAnswer: "cat",
      options: JSON.stringify(["dog", "cat", "bird", "fish", "rabbit"]),
    },
    {
      stage: "visual_recognition",
      level: "elementary",
      questionText: "What is this?",
      imageUrl: "https://via.placeholder.com/300x200?text=Computer",
      correctAnswer: "computer",
      options: JSON.stringify(["phone", "tablet", "computer", "keyboard", "mouse"]),
    },
  ];

  // Seed Auditory Processing Questions
  const auditoryQuestions = [
    {
      stage: "auditory_processing",
      level: "beginner",
      questionText: "Listen and select the correct image",
      audioUrl: "https://via.placeholder.com/audio?text=hello",
      correctAnswer: "greeting",
      options: JSON.stringify(["greeting", "number", "animal", "food", "color"]),
    },
    {
      stage: "auditory_processing",
      level: "elementary",
      questionText: "Listen and select the correct word",
      audioUrl: "https://via.placeholder.com/audio?text=book",
      correctAnswer: "book",
      options: JSON.stringify(["look", "book", "cook", "hook", "took"]),
    },
  ];

  // Seed Spelling & Structure Questions
  const spellingQuestions = [
    {
      stage: "spelling_structure",
      level: "beginner",
      questionText: "Complete the word: c_t",
      correctAnswer: "a",
      options: JSON.stringify(["a", "e", "i", "o", "u"]),
    },
    {
      stage: "spelling_structure",
      level: "elementary",
      questionText: "Complete the sentence: I ___ a student",
      correctAnswer: "am",
      options: JSON.stringify(["am", "is", "are", "be", "been"]),
    },
  ];

  // Seed Reading Sprint Questions
  const readingQuestions = [
    {
      stage: "reading_sprint",
      level: "elementary",
      questionText: "What is the main idea of the story?",
      correctAnswer: "friendship",
      options: JSON.stringify(["adventure", "friendship", "mystery", "romance", "horror"]),
    },
    {
      stage: "reading_sprint",
      level: "intermediate",
      questionText: "Why did the character make that decision?",
      correctAnswer: "to help others",
      options: JSON.stringify(["to help others", "to gain money", "to become famous", "to escape", "to learn"]),
    },
  ];

  // Seed Vocal Challenge Questions
  const vocalQuestions = [
    {
      stage: "vocal_challenge",
      level: "beginner",
      questionText: "Say: Hello, my name is...",
      correctAnswer: "greeting",
      options: JSON.stringify(["greeting"]),
    },
    {
      stage: "vocal_challenge",
      level: "elementary",
      questionText: "Describe your favorite food",
      correctAnswer: "description",
      options: JSON.stringify(["description"]),
    },
  ];

  try {
    // Insert Visual Recognition Questions
    for (const q of visualQuestions) {
      await db.insert(questions).values(q);
    }
    console.log("✅ Visual Recognition questions seeded");

    // Insert Auditory Processing Questions
    for (const q of auditoryQuestions) {
      await db.insert(questions).values(q);
    }
    console.log("✅ Auditory Processing questions seeded");

    // Insert Spelling & Structure Questions
    for (const q of spellingQuestions) {
      await db.insert(questions).values(q);
    }
    console.log("✅ Spelling & Structure questions seeded");

    // Insert Reading Sprint Questions
    for (const q of readingQuestions) {
      await db.insert(questions).values(q);
    }
    console.log("✅ Reading Sprint questions seeded");

    // Insert Vocal Challenge Questions
    for (const q of vocalQuestions) {
      await db.insert(questions).values(q);
    }
    console.log("✅ Vocal Challenge questions seeded");

    // Seed Admin Messages
    const messages = [
      {
        level: "beginner",
        titleEn: "Great Start!",
        titleAr: "بداية رائعة!",
        messageEn: "You are at the Beginner level. Keep practicing to improve your English skills.",
        messageAr: "أنت في مستوى المبتدئين. استمر في الممارسة لتحسين مهاراتك في اللغة الإنجليزية.",
        recommendationEn: "Focus on basic vocabulary and simple sentence structures. Practice daily conversations.",
        recommendationAr: "ركز على المفردات الأساسية والجمل البسيطة. مارس المحادثات اليومية.",
      },
      {
        level: "elementary",
        titleEn: "Good Progress!",
        titleAr: "تقدم جيد!",
        messageEn: "You are at the Elementary level. You have a solid foundation in English.",
        messageAr: "أنت في المستوى الابتدائي. لديك أساس قوي في اللغة الإنجليزية.",
        recommendationEn: "Continue building your vocabulary and practice more complex sentence structures.",
        recommendationAr: "استمر في بناء مفرداتك ومارس الجمل الأكثر تعقيداً.",
      },
      {
        level: "intermediate",
        titleEn: "Excellent Work!",
        titleAr: "عمل ممتاز!",
        messageEn: "You are at the Intermediate level. You can communicate effectively in most situations.",
        messageAr: "أنت في المستوى المتوسط. يمكنك التواصل بفعالية في معظم الحالات.",
        recommendationEn: "Focus on advanced grammar and idiomatic expressions. Watch English movies and read books.",
        recommendationAr: "ركز على القواعد المتقدمة والتعبيرات الاصطلاحية. شاهد أفلام إنجليزية واقرأ الكتب.",
      },
      {
        level: "upper_intermediate",
        titleEn: "Outstanding!",
        titleAr: "رائع جداً!",
        messageEn: "You are at the Upper-Intermediate level. You have strong English proficiency.",
        messageAr: "أنت في المستوى المتوسط المتقدم. لديك كفاءة قوية في اللغة الإنجليزية.",
        recommendationEn: "Practice professional English and specialized vocabulary. Engage in debates and discussions.",
        recommendationAr: "مارس اللغة الإنجليزية المهنية والمفردات المتخصصة. شارك في النقاشات والمناقشات.",
      },
      {
        level: "advanced",
        titleEn: "Exceptional!",
        titleAr: "استثنائي!",
        messageEn: "You are at the Advanced level. You have near-native English proficiency.",
        messageAr: "أنت في المستوى المتقدم. لديك كفاءة قريبة من الأصلية في اللغة الإنجليزية.",
        recommendationEn: "Continue refining your skills through advanced literature and professional communication.",
        recommendationAr: "استمر في تحسين مهاراتك من خلال الأدب المتقدم والتواصل المهني.",
      },
    ];

    for (const msg of messages) {
      await db.insert(adminMessages).values(msg);
    }
    console.log("✅ Admin messages seeded");

    // Seed Level Thresholds
    const thresholds = [
      { level: "beginner", minScore: 0, maxScore: 59 },
      { level: "elementary", minScore: 60, maxScore: 69 },
      { level: "intermediate", minScore: 70, maxScore: 79 },
      { level: "upper_intermediate", minScore: 80, maxScore: 89 },
      { level: "advanced", minScore: 90, maxScore: 100 },
    ];

    for (const threshold of thresholds) {
      await db.insert(levelThresholds).values(threshold);
    }
    console.log("✅ Level thresholds seeded");

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
