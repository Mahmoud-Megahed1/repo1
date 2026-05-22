import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, questions, testResults, userAchievements, userProgress } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get questions by level with optional limit
 */
export async function getQuestionsByLevel(
  level: string,
  limit: number = 10
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get questions: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(questions)
      .where(eq(questions.level, level as any))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get questions:", error);
    throw error;
  }
}

/**
 * Get all questions for admin
 */
export async function getAllQuestions() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get questions: database not available");
    return [];
  }

  try {
    const result = await db.select().from(questions);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get questions:", error);
    throw error;
  }
}

/**
 * Get or create user progress
 */
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get user progress:", error);
    return null;
  }
}

/**
 * Update user progress after quiz completion
 */
export async function updateUserProgress(
  userId: number,
  accuracy: number,
  level: string,
  totalTimeSpent: number,
  correctAnswers: number,
  totalQuestions: number
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await getUserProgress(userId);
    
    if (existing) {
      const newTotal = existing.totalQuestionsAnswered + totalQuestions;
      const newCorrect = existing.totalCorrectAnswers + correctAnswers;
      const newAvgAccuracy = Math.round((newCorrect / newTotal) * 100);
      
      return await db
        .update(userProgress)
        .set({
          totalQuizzesTaken: existing.totalQuizzesTaken + 1,
          totalCorrectAnswers: newCorrect,
          totalQuestionsAnswered: newTotal,
          averageAccuracy: newAvgAccuracy,
          bestLevel: level,
          bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
          totalTimeSpent: existing.totalTimeSpent + totalTimeSpent,
        })
        .where(eq(userProgress.userId, userId));
    } else {
      return await db.insert(userProgress).values({
        userId,
        totalQuizzesTaken: 1,
        totalCorrectAnswers: correctAnswers,
        totalQuestionsAnswered: totalQuestions,
        averageAccuracy: accuracy,
        bestLevel: level,
        bestAccuracy: accuracy,
        totalTimeSpent: totalTimeSpent,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to update user progress:", error);
    throw error;
  }
}

/**
 * Get user achievements
 */
export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user achievements:", error);
    return [];
  }
}

/**
 * Add achievement to user
 */
export async function addAchievement(
  userId: number,
  badgeType: string,
  badgeName: string,
  badgeDescription?: string
) {
  const db = await getDb();
  if (!db) return null;

  try {
    return await db.insert(userAchievements).values({
      userId,
      badgeType,
      badgeName,
      badgeDescription,
    });
  } catch (error) {
    console.error("[Database] Failed to add achievement:", error);
    throw error;
  }
}

/**
 * Get user quiz history
 */
export async function getUserQuizHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(testResults)
      .where(eq(testResults.userId, userId))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get quiz history:", error);
    return [];
  }
}

// TODO: add feature queries here as your schema grows.
