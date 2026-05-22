import mysql from 'mysql2/promise';

const sampleQuestions = [
  {
    question: "What is the correct spelling of the word meaning 'to move quickly'?",
    choiceA: "runn",
    choiceB: "run",
    choiceC: "rune",
    choiceD: "rund",
    correctAnswer: "B",
    level: "A1",
    category: "Spelling"
  },
  {
    question: "Which sentence is grammatically correct?",
    choiceA: "She go to school every day",
    choiceB: "She goes to school every day",
    choiceC: "She going to school every day",
    choiceD: "She gone to school every day",
    correctAnswer: "B",
    level: "A1",
    category: "Grammar"
  },
  {
    question: "What does 'hello' mean?",
    choiceA: "goodbye",
    choiceB: "a greeting",
    choiceC: "thank you",
    choiceD: "please",
    correctAnswer: "B",
    level: "A1",
    category: "Vocabulary"
  },
  {
    question: "Choose the correct form of the verb: 'I ___ to the store yesterday'",
    choiceA: "go",
    choiceB: "goes",
    choiceC: "went",
    choiceD: "going",
    correctAnswer: "C",
    level: "A2",
    category: "Grammar"
  },
  {
    question: "What is the opposite of 'hot'?",
    choiceA: "warm",
    choiceB: "cold",
    choiceC: "cool",
    choiceD: "freezing",
    correctAnswer: "B",
    level: "A2",
    category: "Vocabulary"
  },
  {
    question: "Which word is spelled correctly?",
    choiceA: "recieve",
    choiceB: "receive",
    choiceC: "recive",
    choiceD: "receeve",
    correctAnswer: "B",
    level: "B1",
    category: "Spelling"
  },
  {
    question: "If I had known about the party, I ___ attended.",
    choiceA: "would have",
    choiceB: "will have",
    choiceC: "would",
    choiceD: "have",
    correctAnswer: "A",
    level: "B1",
    category: "Grammar"
  },
  {
    question: "What does 'persevere' mean?",
    choiceA: "to give up easily",
    choiceB: "to continue despite difficulty",
    choiceC: "to move quickly",
    choiceD: "to speak loudly",
    correctAnswer: "B",
    level: "B2",
    category: "Vocabulary"
  },
  {
    question: "Choose the sentence with correct punctuation:",
    choiceA: "She said, I love reading books.",
    choiceB: "She said \"I love reading books.\"",
    choiceC: "She said I love reading books",
    choiceD: "She said, \"I love reading books.\"",
    correctAnswer: "D",
    level: "B2",
    category: "Grammar"
  },
  {
    question: "Which word is a synonym for 'meticulous'?",
    choiceA: "careless",
    choiceB: "thorough",
    choiceC: "hasty",
    choiceD: "lazy",
    correctAnswer: "B",
    level: "C1",
    category: "Vocabulary"
  }
];

async function seedQuestions() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'englishom_ques',
    });

    console.log('Connected to database');

    for (const question of sampleQuestions) {
      const sql = `
        INSERT INTO questions (question, choiceA, choiceB, choiceC, choiceD, correctAnswer, level, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(sql, [
        question.question,
        question.choiceA,
        question.choiceB,
        question.choiceC,
        question.choiceD,
        question.correctAnswer,
        question.level,
        question.category
      ]);

      console.log(`✓ Added: ${question.question.substring(0, 50)}...`);
    }

    console.log(`\n✅ Successfully seeded ${sampleQuestions.length} questions!`);
    await connection.end();
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
