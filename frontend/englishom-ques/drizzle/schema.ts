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
 * Questions table for storing English learning quiz questions
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  choiceA: text("choiceA").notNull(),
  choiceB: text("choiceB").notNull(),
  choiceC: text("choiceC").notNull(),
  choiceD: text("choiceD").notNull(),
  correctAnswer: varchar("correctAnswer", { length: 1 }).notNull(), // A, B, C, or D
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1", "C2"]).notNull(),
  category: varchar("category", { length: 100 }),
  timePerQuestion: int("timePerQuestion").default(10).notNull(), // time in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Test results table for storing user quiz performance
 */
export const testResults = mysqlTable("testResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1", "C2"]).notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  accuracy: int("accuracy").notNull(), // percentage 0-100
  averageResponseTime: int("averageResponseTime"), // in seconds
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = typeof testResults.$inferInsert;

/**
 * User achievements/badges table
 */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  badgeType: varchar("badgeType", { length: 50 }).notNull(),
  badgeName: varchar("badgeName", { length: 100 }).notNull(),
  badgeDescription: text("badgeDescription"),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;

/**
 * User progress tracking
 */
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  totalQuizzesTaken: int("totalQuizzesTaken").default(0).notNull(),
  totalCorrectAnswers: int("totalCorrectAnswers").default(0).notNull(),
  totalQuestionsAnswered: int("totalQuestionsAnswered").default(0).notNull(),
  averageAccuracy: int("averageAccuracy").default(0).notNull(),
  bestLevel: varchar("bestLevel", { length: 2 }),
  bestAccuracy: int("bestAccuracy").default(0).notNull(),
  totalTimeSpent: int("totalTimeSpent").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;