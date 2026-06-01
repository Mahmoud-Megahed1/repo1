import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import mysql from "mysql2/promise";
import { questions } from "../drizzle/schema";

const poolConnection = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(poolConnection);

const allQuestions: Array<{
  stage: number;
  questionText: string;
  imageUrl?: string;
  audioUrl?: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  timeLimit: number;
}> = [
  // ============================================================
  // STAGE 1: VOCABULARY (10 questions)
  // ============================================================
  {
    stage: 1,
    questionText: "What is the meaning of the word 'happy'?",
    options: ["Sad", "Angry", "Joyful", "Tired"],
    correctAnswer: "Joyful",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "Choose the synonym of 'big':",
    options: ["Small", "Large", "Thin", "Short"],
    correctAnswer: "Large",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "What is the opposite of 'cold'?",
    options: ["Warm", "Cool", "Hot", "Freezing"],
    correctAnswer: "Hot",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "Which word means 'a place where you sleep'?",
    options: ["Kitchen", "Bedroom", "Bathroom", "Garden"],
    correctAnswer: "Bedroom",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "What does 'purchase' mean?",
    options: ["Sell", "Buy", "Throw", "Break"],
    correctAnswer: "Buy",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "Choose the word that means 'very small':",
    options: ["Enormous", "Tiny", "Huge", "Massive"],
    correctAnswer: "Tiny",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "What is the meaning of 'delicious'?",
    options: ["Ugly", "Tasty", "Boring", "Loud"],
    correctAnswer: "Tasty",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "Which word is the opposite of 'ancient'?",
    options: ["Old", "Modern", "Classic", "Traditional"],
    correctAnswer: "Modern",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "What does 'magnificent' mean?",
    options: ["Terrible", "Ordinary", "Wonderful", "Simple"],
    correctAnswer: "Wonderful",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 1,
    questionText: "Choose the synonym of 'intelligent':",
    options: ["Foolish", "Smart", "Slow", "Lazy"],
    correctAnswer: "Smart",
    difficulty: "medium",
    timeLimit: 30,
  },

  // ============================================================
  // STAGE 2: GRAMMAR (10 questions)
  // ============================================================
  {
    stage: 2,
    questionText: "She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: "goes",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "I ___ to the store yesterday.",
    options: ["go", "goes", "went", "going"],
    correctAnswer: "went",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "They ___ playing football right now.",
    options: ["is", "are", "was", "were"],
    correctAnswer: "are",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "He ___ already finished his homework.",
    options: ["have", "has", "had", "having"],
    correctAnswer: "has",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    correctAnswer: "were",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "The book ___ on the table.",
    options: ["is", "are", "am", "be"],
    correctAnswer: "is",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "We ___ been waiting for two hours.",
    options: ["has", "have", "had", "having"],
    correctAnswer: "have",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "She asked me where I ___.",
    options: ["live", "lived", "living", "lives"],
    correctAnswer: "lived",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "Neither the students nor the teacher ___ present.",
    options: ["was", "were", "are", "is"],
    correctAnswer: "was",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 2,
    questionText: "By next year, I ___ graduated from university.",
    options: ["will have", "will", "would", "had"],
    correctAnswer: "will have",
    difficulty: "hard",
    timeLimit: 30,
  },

  // ============================================================
  // STAGE 3: READING COMPREHENSION (10 questions)
  // ============================================================
  {
    stage: 3,
    questionText: "\"The cat sat on the mat.\" — What is the subject of this sentence?",
    options: ["mat", "sat", "cat", "on"],
    correctAnswer: "cat",
    difficulty: "easy",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"John loves reading books in the evening.\" — When does John read?",
    options: ["Morning", "Afternoon", "Evening", "Night"],
    correctAnswer: "Evening",
    difficulty: "easy",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"The weather was sunny, so we went to the beach.\" — Why did they go to the beach?",
    options: ["It was raining", "It was sunny", "It was cold", "It was windy"],
    correctAnswer: "It was sunny",
    difficulty: "easy",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"Despite the heavy rain, Sarah walked to work.\" — What does 'despite' mean here?",
    options: ["Because of", "Even though", "After", "Before"],
    correctAnswer: "Even though",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"The company's profits increased by 20% last quarter.\" — What happened to the profits?",
    options: ["They decreased", "They stayed the same", "They went up", "They disappeared"],
    correctAnswer: "They went up",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"Tom is taller than his brother, but shorter than his father.\" — Who is the tallest?",
    options: ["Tom", "His brother", "His father", "They are equal"],
    correctAnswer: "His father",
    difficulty: "easy",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"She hesitated before answering the difficult question.\" — What did she do before answering?",
    options: ["Ran away", "Paused", "Laughed", "Shouted"],
    correctAnswer: "Paused",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"The museum opens at 9 AM and closes at 6 PM on weekdays.\" — How many hours is the museum open?",
    options: ["7 hours", "8 hours", "9 hours", "10 hours"],
    correctAnswer: "9 hours",
    difficulty: "medium",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"Although he was exhausted, he continued to study for the exam.\" — What is the main idea?",
    options: ["He stopped studying", "He was too tired to study", "He kept studying even though tired", "He failed the exam"],
    correctAnswer: "He kept studying even though tired",
    difficulty: "hard",
    timeLimit: 45,
  },
  {
    stage: 3,
    questionText: "\"The research concluded that regular exercise reduces stress levels significantly.\" — What does exercise do according to the text?",
    options: ["Increases stress", "Has no effect on stress", "Reduces stress", "Causes anxiety"],
    correctAnswer: "Reduces stress",
    difficulty: "medium",
    timeLimit: 45,
  },

  // ============================================================
  // STAGE 4: LISTENING (10 questions)
  // ============================================================
  {
    stage: 4,
    questionText: "Which word rhymes with 'cat'?",
    options: ["Dog", "Hat", "Cup", "Pen"],
    correctAnswer: "Hat",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "How many syllables does the word 'beautiful' have?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which word has the same vowel sound as 'boat'?",
    options: ["Boot", "Coat", "Bat", "Bit"],
    correctAnswer: "Coat",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which word is stressed on the second syllable?",
    options: ["Table", "Begin", "Water", "Apple"],
    correctAnswer: "Begin",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which pair of words are homophones?",
    options: ["Read/Red", "Cat/Hat", "Big/Small", "Run/Walk"],
    correctAnswer: "Read/Red",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "How do you pronounce the 'th' in 'this'?",
    options: ["Like 's'", "Like 'z'", "Voiced (soft)", "Voiceless (hard)"],
    correctAnswer: "Voiced (soft)",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which word has a silent letter?",
    options: ["Cat", "Knife", "Dog", "Pen"],
    correctAnswer: "Knife",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which sentence uses rising intonation?",
    options: ["Close the door.", "What a beautiful day!", "Are you coming?", "I live in Cairo."],
    correctAnswer: "Are you coming?",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "In 'photograph' and 'photography', which syllable changes stress?",
    options: ["First", "Second", "Third", "None"],
    correctAnswer: "Second",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 4,
    questionText: "Which word ends with the /ʃ/ sound (like 'sh')?",
    options: ["Watch", "Wash", "Walk", "Want"],
    correctAnswer: "Wash",
    difficulty: "medium",
    timeLimit: 30,
  },

  // ============================================================
  // STAGE 5: WRITING / SPELLING (10 questions)
  // ============================================================
  {
    stage: 5,
    questionText: "Which word is spelled correctly?",
    options: ["Recieve", "Receive", "Recive", "Receeve"],
    correctAnswer: "Receive",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Choose the correct spelling:",
    options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"],
    correctAnswer: "Accommodate",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Which is the correct way to write this sentence?",
    options: ["Their going to the park.", "They're going to the park.", "There going to the park.", "Thier going to the park."],
    correctAnswer: "They're going to the park.",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Choose the correctly punctuated sentence:",
    options: ["Its a beautiful day.", "It's a beautiful day.", "Its' a beautiful day.", "It,s a beautiful day."],
    correctAnswer: "It's a beautiful day.",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Which word is spelled correctly?",
    options: ["Neccessary", "Necessery", "Necessary", "Nessecary"],
    correctAnswer: "Necessary",
    difficulty: "hard",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Complete the sentence correctly: \"I would like ___ a coffee, please.\"",
    options: ["to have", "having", "have", "had"],
    correctAnswer: "to have",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Which sentence has correct word order?",
    options: ["Always she is happy.", "She always is happy.", "She is always happy.", "She happy always is."],
    correctAnswer: "She is always happy.",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Choose the correct form: \"The children ___ outside when it started raining.\"",
    options: ["was playing", "were playing", "is playing", "are playing"],
    correctAnswer: "were playing",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Which word is spelled correctly?",
    options: ["Enviroment", "Environmant", "Environment", "Enviorment"],
    correctAnswer: "Environment",
    difficulty: "medium",
    timeLimit: 30,
  },
  {
    stage: 5,
    questionText: "Choose the correct sentence:",
    options: [
      "Me and him went to the store.",
      "He and I went to the store.",
      "Him and I went to the store.",
      "Me and he went to the store.",
    ],
    correctAnswer: "He and I went to the store.",
    difficulty: "hard",
    timeLimit: 30,
  },
];

async function seed() {
  try {
    console.log("🗑️  Clearing existing questions...");
    await db.execute(sql`DELETE FROM questions`);

    console.log(`📝 Seeding ${allQuestions.length} questions...`);
    let count = 0;
    for (const q of allQuestions) {
      await db.insert(questions).values({
        stage: q.stage,
        questionText: q.questionText,
        imageUrl: q.imageUrl || null,
        audioUrl: q.audioUrl || null,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        explanation: q.explanation,
        timeLimit: q.timeLimit,
      });
      count++;
    }

    console.log(`✅ Successfully seeded ${count} questions!`);
    console.log(`   Stage 1 (Vocabulary): ${allQuestions.filter(q => q.stage === 1).length}`);
    console.log(`   Stage 2 (Grammar):    ${allQuestions.filter(q => q.stage === 2).length}`);
    console.log(`   Stage 3 (Reading):    ${allQuestions.filter(q => q.stage === 3).length}`);
    console.log(`   Stage 4 (Listening):  ${allQuestions.filter(q => q.stage === 4).length}`);
    console.log(`   Stage 5 (Writing):    ${allQuestions.filter(q => q.stage === 5).length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
}

seed();
