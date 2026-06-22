import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, questions, testResults, testAnswers, adminMessages, levelThresholds, InsertTestResult, InsertTestAnswer } from "../drizzle/schema";
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

// Test-related queries
export async function getQuestionsByStage(stage: string, limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(questions).where(eq(questions.stage, stage as any));
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query;
}

export async function getQuestionsByStageAndLevel(stage: string, level: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(questions)
    .where(
      and(
        eq(questions.stage, stage as any),
        eq(questions.level, level as any)
      )
    );
}

export async function createTestResult(data: InsertTestResult) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(testResults).values(data);
  return { insertId: (result as any).insertId || 0 };
}

export async function getTestResultById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(testResults)
    .where(eq(testResults.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function saveTestAnswer(data: InsertTestAnswer) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(testAnswers).values(data);
  return { insertId: (result as any).insertId || 0 };
}

export async function getAdminMessage(level: string, scoreRange: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(adminMessages)
    .where(
      and(
        eq(adminMessages.level, level as any),
        eq(adminMessages.scoreRange, scoreRange)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getLevelThreshold(level: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(levelThresholds)
    .where(eq(levelThresholds.level, level as any))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllTestResults(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(testResults);
  if (limit) {
    query = query.limit(limit) as any;
  }
  return query;
}

export async function getTestAnswersByResultId(testResultId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(testAnswers)
    .where(eq(testAnswers.testResultId, testResultId));
}

// Admin Question Management via Drizzle
export async function getAllQuestions() {
  const db = await getDb();
  if (!db) return [];
  const res = await db.select().from(questions);
  return res.map(q => ({ ...q, _id: q.id.toString(), imageData: q.imageUrl }));
}

export async function createQuestion(data: any) {
  const db = await getDb();
  if (!db) return null;
  const insertData = { ...data, imageUrl: data.imageData };
  delete insertData.imageData;
  const [result] = await db.insert(questions).values(insertData);
  return result;
}

export async function updateQuestion(id: string | number, data: any) {
  const db = await getDb();
  if (!db) return null;
  const updateData = { ...data };
  if (updateData.imageData !== undefined) {
    updateData.imageUrl = updateData.imageData;
    delete updateData.imageData;
  }
  await db.update(questions).set(updateData).where(eq(questions.id, Number(id)));
  return true;
}

export async function deleteQuestion(id: string | number) {
  const db = await getDb();
  if (!db) return null;
  await db.delete(questions).where(eq(questions.id, Number(id)));
  return true;
}
