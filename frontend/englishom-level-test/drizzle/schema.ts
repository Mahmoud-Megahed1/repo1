import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Questions table for storing test questions across all 5 stages
 * Stages: 1=Vocabulary, 2=Grammar, 3=Reading, 4=Listening, 5=Writing
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  stage: int("stage").notNull(), // 1-5
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  questionText: text("questionText").notNull(),
  questionArabic: text("questionArabic"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  audioUrl: varchar("audioUrl", { length: 512 }),
  correctAnswer: varchar("correctAnswer", { length: 255 }).notNull(),
  options: text("options").notNull(), // JSON array of options
  explanation: text("explanation"),
  explanationArabic: text("explanationArabic"),
  timeLimit: int("timeLimit").default(30).notNull(), // Time in seconds per question
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Test attempts - records each user's test session
 */
export const testAttempts = mysqlTable("testAttempts", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  userId: int("userId"), // Optional - for anonymous users
  email: varchar("email", { length: 320 }),
  userName: varchar("userName", { length: 255 }),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestAttempt = typeof testAttempts.$inferSelect;
export type InsertTestAttempt = typeof testAttempts.$inferInsert;

/**
 * Test results - detailed scoring and performance data
 */
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  testAttemptId: int("testAttemptId").notNull(),
  totalScore: int("totalScore").notNull(), // 0-100
  cefrLevel: mysqlEnum("cefrLevel", ["A1", "A2", "B1", "B2", "C1", "C2"]).notNull(),
  vocabularyScore: int("vocabularyScore").notNull().default(0),
  grammarScore: int("grammarScore").notNull().default(0),
  readingScore: int("readingScore").notNull().default(0),
  listeningScore: int("listeningScore").notNull().default(0),
  writingScore: int("writingScore").notNull().default(0),
  strengths: text("strengths"), // JSON array
  weaknesses: text("weaknesses"), // JSON array
  recommendations: text("recommendations"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

/**
 * Answer log - tracks individual question responses
 */
export const answerLog = mysqlTable("answerLog", {
  id: int("id").autoincrement().primaryKey(),
  testAttemptId: int("testAttemptId").notNull(),
  questionId: int("questionId").notNull(),
  userAnswer: varchar("userAnswer", { length: 512 }).notNull(),
  isCorrect: int("isCorrect").notNull(), // 0 or 1
  timeSpentSeconds: int("timeSpentSeconds"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnswerLog = typeof answerLog.$inferSelect;
export type InsertAnswerLog = typeof answerLog.$inferInsert;