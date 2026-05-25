import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const questions = [
  {
    question: "The dog ___ loudly.",
    choiceA: "barks",
    choiceB: "bark",
    choiceC: "barking",
    choiceD: "barked",
    correctAnswer: "A",
    level: "A1",
    category: "Grammar",
    timePerQuestion: 15
  },
  {
    question: "She ___ to the store yesterday.",
    choiceA: "goes",
    choiceB: "went",
    choiceC: "gone",
    choiceD: "going",
    correctAnswer: "B",
    level: "A1",
    category: "Grammar",
    timePerQuestion: 15
  },
  {
    question: "I have ___ apples.",
    choiceA: "much",
    choiceB: "many",
    choiceC: "a lot",
    choiceD: "any",
    correctAnswer: "B",
    level: "A1",
    category: "Grammar",
    timePerQuestion: 15
  }
];

async function seedQues() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'englishom_db_user',
    password: process.env.DB_PASSWORD || 'SecurePass123!',
    database: process.env.DB_NAME || 'db_ques',
  });

  try {
    console.log('Seeding db_ques...');
    
    for (const q of questions) {
      const query = `
        INSERT INTO questions (question, choiceA, choiceB, choiceC, choiceD, correctAnswer, level, category, timePerQuestion, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await connection.execute(query, [
        q.question,
        q.choiceA,
        q.choiceB,
        q.choiceC,
        q.choiceD,
        q.correctAnswer,
        q.level,
        q.category,
        q.timePerQuestion
      ]);
    }
    
    console.log(`✅ Successfully seeded ${questions.length} questions for englishom-ques!`);
  } catch (error) {
    console.error('Error seeding questions:', error);
  } finally {
    await connection.end();
  }
}

seedQues();
