import { drizzle } from "drizzle-orm/mysql2";
import { questions } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const sampleQuestions: Array<{
  stage: number;
  questionText: string;
  imageUrl?: string;
  audioUrl?: string;
  options: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
}> = [
  {
    stage: 1,
    questionText: "What is this object?",
    imageUrl: "https://via.placeholder.com/200?text=Apple",
    options: ["Apple", "Orange", "Banana", "Grape", "Watermelon"],
    correctAnswer: "Apple",
    difficulty: "easy",
    explanation: "The image shows an apple."
  },
  {
    stage: 2,
    questionText: "She ___ to the store yesterday.",
    options: ["go", "goes", "went", "going", "gone"],
    correctAnswer: "went",
    difficulty: "easy",
    explanation: "Past tense is needed."
  },
  {
    stage: 3,
    questionText: "What is the subject in this sentence?",
    options: ["cat", "sat", "mat", "on", "the"],
    correctAnswer: "cat",
    difficulty: "easy",
    explanation: "The subject is the noun performing the action."
  },
  {
    stage: 4,
    questionText: "Listen to the audio.",
    audioUrl: "https://via.placeholder.com/audio",
    options: ["Hello", "Goodbye", "Thank you", "Please", "Sorry"],
    correctAnswer: "Hello",
    difficulty: "easy",
    explanation: "The audio says hello."
  },
  {
    stage: 5,
    questionText: "How do you spell the word?",
    options: ["Cat", "Kat", "Catt", "Katt", "Caat"],
    correctAnswer: "Cat",
    difficulty: "easy",
    explanation: "The correct spelling is Cat."
  }
];

async function seed() {
  try {
    console.log("Seeding questions...");
    for (const q of sampleQuestions) {
      await db.insert(questions).values({
        stage: q.stage,
        questionText: q.questionText,
        imageUrl: q.imageUrl || null,
        audioUrl: q.audioUrl || null,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty as "easy" | "medium" | "hard",
        explanation: q.explanation,
      });
    }
    console.log("Seeded successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

seed();
