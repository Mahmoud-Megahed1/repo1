import { eq, and, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  questions,
  testAttempts,
  testResults,
  answerLog,
  InsertTestAttempt,
  InsertTestResult,
  InsertAnswerLog,
} from "../drizzle/schema";
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
 * Get all active questions for a specific stage
 */
export async function getQuestionsByStage(stage: number, limit?: number) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(questions)
    .where(and(eq(questions.isActive, 1), eq(questions.stage, stage)));

  if (limit) {
    query = query.limit(limit) as typeof query;
  }

  return query;
}

/**
 * Get a random question from a stage
 */
export async function getRandomQuestionByStage(stage: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(questions)
    .where(and(eq(questions.isActive, 1), eq(questions.stage, stage)))
    .orderBy(sql`RAND()`)
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new test attempt
 */
export async function createTestAttempt(data: InsertTestAttempt) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(testAttempts).values(data);
  return result;
}

/**
 * Get test attempt by session ID
 */
export async function getTestAttemptBySessionId(sessionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(testAttempts)
    .where(eq(testAttempts.sessionId, sessionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Save test result
 */
export async function saveTestResult(data: InsertTestResult) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(testResults).values(data);
  return result;
}

/**
 * Get test result by attempt ID
 */
export async function getTestResultByAttemptId(attemptId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(testResults)
    .where(eq(testResults.testAttemptId, attemptId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Log user answer
 */
export async function logAnswer(data: InsertAnswerLog) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(answerLog).values(data);
  return result;
}

/**
 * Get all answers for a test attempt
 */
export async function getAnswersForAttempt(attemptId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(answerLog)
    .where(eq(answerLog.testAttemptId, attemptId));
}

/**
 * Update test attempt status
 */
export async function updateTestAttemptStatus(
  sessionId: string,
  status: "in_progress" | "completed" | "abandoned"
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .update(testAttempts)
    .set({ status, updatedAt: new Date() })
    .where(eq(testAttempts.sessionId, sessionId));

  return result;
}


/**
 * Get all questions
 */
export async function getAllQuestions() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(questions).where(eq(questions.isActive, 1));
}

export async function getQuestionById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Batch fetch questions by IDs (avoids N+1 queries in submitTest)
 */
export async function getQuestionsByIds(ids: number[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];

  return db.select().from(questions).where(inArray(questions.id, ids));
}

/**
 * Create a new question
 */
export async function createQuestion(data: {
  stage: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(questions).values({
    stage: data.stage,
    questionText: data.questionText,
    options: data.options,
    correctAnswer: data.correctAnswer,
    difficulty: data.difficulty as "easy" | "medium" | "hard",
    timeLimit: data.timeLimit || 30,
    isActive: 1,
  });

  return result;
}

/**
 * Update a question
 */
export async function updateQuestion(
  id: number,
  data: {
    stage: number;
    questionText: string;
    options: string;
    correctAnswer: string;
    difficulty: "easy" | "medium" | "hard";
    timeLimit?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(questions)
    .set({
      stage: data.stage,
      questionText: data.questionText,
      options: data.options,
      correctAnswer: data.correctAnswer,
      difficulty: data.difficulty as "easy" | "medium" | "hard",
      timeLimit: data.timeLimit || 30,
    })
    .where(eq(questions.id, id));

  return result;
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .update(questions)
    .set({ isActive: 0 })
    .where(eq(questions.id, id));

  return result;
}
