import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

// Questions table for all 5 stages
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  stage: mysqlEnum("stage", [
    "visual_recognition",
    "auditory_processing",
    "spelling_structure",
    "reading_sprint",
    "vocal_challenge",
  ]).notNull(),
  level: mysqlEnum("level", [
    "beginner",
    "elementary",
    "intermediate",
    "upper_intermediate",
    "advanced",
  ]).notNull(),
  questionText: text("questionText"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  audioUrl: varchar("audioUrl", { length: 500 }),
  correctAnswer: text("correctAnswer").notNull(),
  options: text("options"), // JSON array of options
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

// Test results table
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  studentName: varchar("studentName", { length: 255 }),
  studentEmail: varchar("studentEmail", { length: 320 }),
  overallLevel: mysqlEnum("overallLevel", [
    "beginner",
    "elementary",
    "intermediate",
    "upper_intermediate",
    "advanced",
  ]).notNull(),
  totalScore: decimal("totalScore", { precision: 5, scale: 2 }).notNull(),
  visualScore: decimal("visualScore", { precision: 5, scale: 2 }),
  auditoryScore: decimal("auditoryScore", { precision: 5, scale: 2 }),
  spellingScore: decimal("spellingScore", { precision: 5, scale: 2 }),
  readingScore: decimal("readingScore", { precision: 5, scale: 2 }),
  vocalScore: decimal("vocalScore", { precision: 5, scale: 2 }),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

// Test answers table for detailed tracking
export const testAnswers = mysqlTable("testAnswers", {
  id: int("id").autoincrement().primaryKey(),
  testResultId: int("testResultId").notNull(),
  questionId: int("questionId").notNull(),
  stage: mysqlEnum("stage", [
    "visual_recognition",
    "auditory_processing",
    "spelling_structure",
    "reading_sprint",
    "vocal_challenge",
  ]).notNull(),
  userAnswer: text("userAnswer"),
  isCorrect: mysqlEnum("isCorrect", ["yes", "no"]).notNull(),
  timeSpent: int("timeSpent"), // in milliseconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TestAnswer = typeof testAnswers.$inferSelect;
export type InsertTestAnswer = typeof testAnswers.$inferInsert;

// Admin messages for feedback
export const adminMessages = mysqlTable("adminMessages", {
  id: int("id").autoincrement().primaryKey(),
  level: mysqlEnum("level", [
    "beginner",
    "elementary",
    "intermediate",
    "upper_intermediate",
    "advanced",
  ]).notNull(),
  scoreRange: varchar("scoreRange", { length: 50 }).notNull(), // e.g., "90-100", "70-89", "0-69"
  titleAr: text("titleAr"),
  titleEn: text("titleEn"),
  messageAr: text("messageAr"),
  messageEn: text("messageEn"),
  recommendationAr: text("recommendationAr"),
  recommendationEn: text("recommendationEn"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminMessage = typeof adminMessages.$inferSelect;
export type InsertAdminMessage = typeof adminMessages.$inferInsert;

// Level thresholds for scoring
export const levelThresholds = mysqlTable("levelThresholds", {
  id: int("id").autoincrement().primaryKey(),
  level: mysqlEnum("level", [
    "beginner",
    "elementary",
    "intermediate",
    "upper_intermediate",
    "advanced",
  ]).notNull().unique(),
  minScore: decimal("minScore", { precision: 5, scale: 2 }).notNull(),
  maxScore: decimal("maxScore", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LevelThreshold = typeof levelThresholds.$inferSelect;
export type InsertLevelThreshold = typeof levelThresholds.$inferInsert;