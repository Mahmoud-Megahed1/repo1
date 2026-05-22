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
 * Public Dashboard Statistics - البيانات العامة المعروضة للجمهور
 * يتم التحكم بها من قبل المسؤول فقط
 */
export const publicDashboardStats = mysqlTable('publicDashboardStats', {
  id: int('id').autoincrement().primaryKey(),
  // Live Learning Activity
  wordsWrittenToday: int('wordsWrittenToday').default(0).notNull(),
  audioMinutesListened: int('audioMinutesListened').default(0).notNull(),
  voiceRecordingsToday: int('voiceRecordingsToday').default(0).notNull(),
  // Daily Shield Challenges
  shieldsEarnedToday: int('shieldsEarnedToday').default(0).notNull(),
  shieldCompletionRate: int('shieldCompletionRate').default(0).notNull(),
  // Reality Challenge
  recordedStoriesCount: int('recordedStoriesCount').default(0).notNull(),
  totalSpeakingSeconds: int('totalSpeakingSeconds').default(0).notNull(),
  // Gateway Quiz
  passedStudentsCount: int('passedStudentsCount').default(0).notNull(),
  quizSuccessRate: int('quizSuccessRate').default(0).notNull(),
  // Cities
  citiesCount: int('citiesCount').default(53).notNull(),
  // Visibility
  isPublished: int('isPublished').default(1).notNull(), // 1 = visible, 0 = hidden
  // Timestamps
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
});

export type PublicDashboardStats = typeof publicDashboardStats.$inferSelect;
export type InsertPublicDashboardStats = typeof publicDashboardStats.$inferInsert;