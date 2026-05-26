import { eq, desc, and, like, isNull, count, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogPosts, blogCategories, blogComments, blogTags, blogPostTags, blogMedia, blogCta, blogAnalytics, postRatings, InsertPostRating } from "../drizzle/schema";
import { ENV } from './_core/env';

import { createPool } from "mysql2/promise";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = createPool({
        uri: process.env.DATABASE_URL,
        charset: 'utf8mb4'
      });
      _db = drizzle(pool);
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

    if (Object.keys(updateSet).length > 0) {
      updateSet.updatedAt = new Date();
      updateSet.lastSignedIn = new Date();
    } else {
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

export async function getOrCreateGuestUser(name: string, email: string): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Try to find existing user by email
  const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUsers.length > 0) {
    return existingUsers[0].id;
  }

  // Create new guest user
  const randomOpenId = `guest_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  
  const result: any = await db.insert(users).values({
    openId: randomOpenId,
    name: name,
    email: email,
    role: "user",
    loginMethod: "guest",
  });
  
  return result[0].insertId;
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

// ============================================================================
// BLOG POSTS QUERIES
// ============================================================================

export async function getPublishedPosts(limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  return posts;
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
    .limit(1);

  if (result.length === 0) return null;

  const post = result[0];
  
  // Fetch author and category info
  const author = await db.select().from(users).where(eq(users.id, post.authorId)).limit(1);
  const category = await db.select().from(blogCategories).where(eq(blogCategories.id, post.categoryId)).limit(1);

  return {
    ...post,
    author: author[0] || null,
    category: category[0] || null,
  };
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);

  if (result.length === 0) return null;

  const post = result[0];
  
  // Fetch author and category info
  const author = await db.select().from(users).where(eq(users.id, post.authorId)).limit(1);
  const category = await db.select().from(blogCategories).where(eq(blogCategories.id, post.categoryId)).limit(1);

  return {
    ...post,
    author: author[0] || null,
    category: category[0] || null,
  };
}

export async function createPost(data: {
  slug: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  excerptEn?: string;
  excerptAr?: string;
  categoryId: number;
  authorId: number;
  status: "draft" | "published" | "scheduled";
  readingTimeMinutes?: number;
  metaDescriptionEn?: string;
  metaDescriptionAr?: string;
  metaKeywordsEn?: string;
  metaKeywordsAr?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogPosts).values({
    ...data,
    publishedAt: data.status === "published" ? new Date() : null,
  });

  return result;
}

export async function updatePost(id: number, data: Partial<typeof blogPosts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogPosts).set({ deletedAt: new Date() }).where(eq(blogPosts.id, id));
}

export async function getFeaturedPosts(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.isFeatured, true)))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);

  // Enrich with author and category info
  return Promise.all(
    posts.map(async (post) => {
      const author = await db.select().from(users).where(eq(users.id, post.authorId)).limit(1);
      const category = await db.select().from(blogCategories).where(eq(blogCategories.id, post.categoryId)).limit(1);
      return {
        ...post,
        author: author[0] || null,
        category: category[0] || null,
      };
    })
  );
}

export async function searchPosts(query: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  const searchTerm = `%${query}%`;

  return db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.status, "published"),
        sql`(${blogPosts.titleEn} LIKE ${searchTerm} OR ${blogPosts.titleAr} LIKE ${searchTerm} OR ${blogPosts.contentEn} LIKE ${searchTerm} OR ${blogPosts.contentAr} LIKE ${searchTerm})`
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

export async function incrementPostViews(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(blogPosts)
    .set({ viewsCount: sql`viewsCount + 1` })
    .where(eq(blogPosts.id, postId));
}

export async function getPostsByCategory(categoryId: number, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(and(eq(blogPosts.categoryId, categoryId), eq(blogPosts.status, "published")));

  const posts = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.categoryId, categoryId), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);

  return posts;
}

export async function getPostsCategoryCount(categoryId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(and(eq(blogPosts.categoryId, categoryId), eq(blogPosts.status, "published")));

  return result[0]?.count || 0;
}

export async function getPostsByAuthor(authorId: number, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.authorId, authorId), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getRelatedPosts(postId: number, categoryId: number, limit: number = 3) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.categoryId, categoryId),
        eq(blogPosts.status, "published"),
        sql`${blogPosts.id} != ${postId}`
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);

  // Enrich with author and category info
  return Promise.all(
    posts.map(async (post) => {
      const author = await db.select().from(users).where(eq(users.id, post.authorId)).limit(1);
      const category = await db.select().from(blogCategories).where(eq(blogCategories.id, post.categoryId)).limit(1);
      return {
        ...post,
        author: author[0] || null,
        category: category[0] || null,
      };
    })
  );
}

// ============================================================================
// BLOG CATEGORIES QUERIES
// ============================================================================

export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.isActive, true))
    .orderBy(blogCategories.displayOrder);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(blogCategories)
    .where(and(eq(blogCategories.slug, slug), eq(blogCategories.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogCategories).where(eq(blogCategories.id, id)).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createCategory(data: typeof blogCategories.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogCategories).values(data);
}

export async function updateCategory(id: number, data: Partial<typeof blogCategories.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogCategories).set(data).where(eq(blogCategories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogCategories).set({ isActive: false }).where(eq(blogCategories.id, id));
}

// ============================================================================
// BLOG COMMENTS QUERIES
// ============================================================================

export async function getApprovedComments(postId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select({
      comment: blogComments,
      user: {
        name: users.name,
        role: users.role,
        email: users.email
      }
    })
    .from(blogComments)
    .leftJoin(users, eq(blogComments.userId, users.id))
    .where(and(eq(blogComments.postId, postId), eq(blogComments.status, "approved")))
    .orderBy(desc(blogComments.createdAt))
    .limit(limit)
    .offset(offset);

  return results.map((r) => ({
    ...r.comment,
    user: r.user
  }));
}

export async function getPendingComments(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select({
      comment: blogComments,
      user: {
        name: users.name,
        role: users.role,
        email: users.email
      }
    })
    .from(blogComments)
    .leftJoin(users, eq(blogComments.userId, users.id))
    .where(eq(blogComments.status, "pending"))
    .orderBy(desc(blogComments.createdAt))
    .limit(limit);

  return results.map((r) => ({
    ...r.comment,
    user: r.user
  }));
}

export async function createComment(data: typeof blogComments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(blogComments).values(data);
  // Fetch and return the created comment
  const result = await db
    .select()
    .from(blogComments)
    .where(and(eq(blogComments.postId, data.postId), eq(blogComments.userId, data.userId)))
    .orderBy(desc(blogComments.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCommentStatus(id: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(blogComments)
    .set({
      status,
      approvedAt: status === "approved" ? new Date() : null,
    })
    .where(eq(blogComments.id, id));
  
  // Fetch and return the updated comment
  const result = await db
    .select()
    .from(blogComments)
    .where(eq(blogComments.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(blogComments).where(eq(blogComments.id, id));
}

export async function getCommentById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogComments).where(eq(blogComments.id, id)).limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// BLOG MEDIA QUERIES
// ============================================================================

export async function createMedia(data: typeof blogMedia.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogMedia).values(data);
}

export async function getMediaByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(blogMedia).where(eq(blogMedia.postId, postId));
}

export async function deleteMedia(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(blogMedia).where(eq(blogMedia.id, id));
}

// ============================================================================
// BLOG TAGS QUERIES
// ============================================================================

export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(blogTags).orderBy(desc(blogTags.usageCount));
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogTags).where(eq(blogTags.slug, slug)).limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function createTag(data: typeof blogTags.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogTags).values(data);
}

// ============================================================================
// BLOG CTA QUERIES
// ============================================================================

export async function getCtaByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogCta)
    .where(and(eq(blogCta.postId, postId), eq(blogCta.isActive, true)));
}

export async function createCta(data: typeof blogCta.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogCta).values(data);
}

export async function updateCta(id: number, data: Partial<typeof blogCta.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogCta).set(data).where(eq(blogCta.id, id));
}

// ============================================================================
// BLOG ANALYTICS QUERIES
// ============================================================================

export async function getPostAnalytics(postId: number, daysBack: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);

  return db
    .select()
    .from(blogAnalytics)
    .where(
      and(
        eq(blogAnalytics.postId, postId),
        sql`${blogAnalytics.date} >= ${fromDate.toISOString().split('T')[0]}`
      )
    )
    .orderBy(desc(blogAnalytics.date));
}

export async function recordAnalytics(data: typeof blogAnalytics.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(blogAnalytics).values(data);
}

export async function getCommentCountForPost(postId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: count() })
    .from(blogComments)
    .where(and(eq(blogComments.postId, postId), eq(blogComments.status, "approved")));

  return result[0]?.count || 0;
}

export async function getPublishedPostsCount() {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: count() })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  return result[0]?.count || 0;
}

// ============================================================================
// ADVANCED TAGS QUERIES
// ============================================================================

export async function getPostsByTag(tagId: number, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const posts = await db
    .select({ postId: blogPostTags.postId })
    .from(blogPostTags)
    .where(eq(blogPostTags.tagId, tagId))
    .limit(limit)
    .offset(offset);

  const postIds = posts.map(p => p.postId);
  if (postIds.length === 0) return [];

  return db
    .select()
    .from(blogPosts)
    .where(and(inArray(blogPosts.id, postIds), eq(blogPosts.status, "published")))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getPostTags(postId: number) {
  const db = await getDb();
  if (!db) return [];

  const tagIds = await db
    .select({ tagId: blogPostTags.tagId })
    .from(blogPostTags)
    .where(eq(blogPostTags.postId, postId));

  if (tagIds.length === 0) return [];

  const ids = tagIds.map(t => t.tagId);
  return db
    .select()
    .from(blogTags)
    .where(inArray(blogTags.id, ids));
}

export async function addTagToPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already exists
  const existing = await db
    .select()
    .from(blogPostTags)
    .where(and(eq(blogPostTags.postId, postId), eq(blogPostTags.tagId, tagId)));

  if (existing.length === 0) {
    await db.insert(blogPostTags).values({ postId, tagId });
    // Increment usage count
    await db.update(blogTags).set({ usageCount: sql`usageCount + 1` }).where(eq(blogTags.id, tagId));
  }
}

export async function removeTagFromPost(postId: number, tagId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogPostTags).where(and(eq(blogPostTags.postId, postId), eq(blogPostTags.tagId, tagId)));
  // Decrement usage count
  await db.update(blogTags).set({ usageCount: sql`GREATEST(usageCount - 1, 0)` }).where(eq(blogTags.id, tagId));
}

export async function updateTag(id: number, data: Partial<typeof blogTags.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(blogTags).set(data).where(eq(blogTags.id, id));
}

export async function deleteTag(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete all post-tag associations
  await db.delete(blogPostTags).where(eq(blogPostTags.tagId, id));
  // Delete the tag
  return db.delete(blogTags).where(eq(blogTags.id, id));
}

export async function getTagById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogTags).where(eq(blogTags.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}


// ============================================================================
// EMAIL SUBSCRIBERS QUERIES
// ============================================================================

export async function subscribeEmail(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailSubscribers } = await import("../drizzle/schema");
  
  return db.insert(emailSubscribers).values({
    email,
    name,
    isActive: true,
    isVerified: false,
  }).onDuplicateKeyUpdate({
    set: {
      isActive: true,
      unsubscribedAt: null,
    },
  });
}

export async function unsubscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailSubscribers } = await import("../drizzle/schema");
  
  return db
    .update(emailSubscribers)
    .set({
      isActive: false,
      unsubscribedAt: new Date(),
    })
    .where(eq(emailSubscribers.email, email));
}

export async function getActiveSubscribers() {
  const db = await getDb();
  if (!db) return [];

  const { emailSubscribers } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(emailSubscribers)
    .where(and(eq(emailSubscribers.isActive, true), eq(emailSubscribers.isVerified, true)));
}

export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  const { emailSubscribers } = await import("../drizzle/schema");
  
  const result = await db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// EMAIL NOTIFICATIONS QUERIES
// ============================================================================

export async function createEmailNotification(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailNotifications } = await import("../drizzle/schema");
  
  return db.insert(emailNotifications).values(data);
}

export async function getPendingNotifications(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const { emailNotifications } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.status, "pending"))
    .orderBy(emailNotifications.createdAt)
    .limit(limit);
}

export async function updateNotificationStatus(id: number, status: "sent" | "failed", failureReason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailNotifications } = await import("../drizzle/schema");
  
  return db
    .update(emailNotifications)
    .set({
      status,
      sentAt: status === "sent" ? new Date() : null,
      failureReason: status === "failed" ? failureReason : null,
    })
    .where(eq(emailNotifications.id, id));
}

export async function getNotificationsByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];

  const { emailNotifications } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.postId, postId));
}


// Post Ratings Functions
export async function createPostRating(rating: InsertPostRating) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create rating: database not available");
    return undefined;
  }

  try {
    await db.insert(postRatings).values(rating);
    // Fetch and return the created rating
    const result = await db
      .select()
      .from(postRatings)
      .where(and(eq(postRatings.postId, rating.postId), eq(postRatings.userId, rating.userId)))
      .orderBy(desc(postRatings.createdAt))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create rating:", error);
    throw error;
  }
}

export async function getPostRatings(postId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get ratings: database not available");
    return [];
  }

  try {
    const results = await db
      .select({
        rating: postRatings,
        user: {
          name: users.name,
          role: users.role,
          email: users.email,
        }
      })
      .from(postRatings)
      .leftJoin(users, eq(postRatings.userId, users.id))
      .where(
        and(
          eq(postRatings.postId, postId),
          eq(postRatings.status, "approved")
        )
      )
      .orderBy(desc(postRatings.createdAt));
      
    return results.map(r => ({
      ...r.rating,
      user: r.user
    }));
  } catch (error) {
    console.error("[Database] Failed to get ratings:", error);
    throw error;
  }
}

export async function getPostAverageRating(postId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get average rating: database not available");
    return 0;
  }

  try {
    const result = await db
      .select({
        avgRating: sql`AVG(${postRatings.rating})`,
        count: sql`COUNT(*)`,
      })
      .from(postRatings)
      .where(eq(postRatings.postId, postId));

    return result[0] ? { avgRating: Number(result[0].avgRating) || 0, count: Number(result[0].count) || 0 } : { avgRating: 0, count: 0 };
  } catch (error) {
    console.error("[Database] Failed to get average rating:", error);
    throw error;
  }
}

export async function getUserPostRating(postId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user rating: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(postRatings)
      .where(and(eq(postRatings.postId, postId), eq(postRatings.userId, userId)))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user rating:", error);
    throw error;
  }
}

export async function getPostRatingById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get rating: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(postRatings)
      .where(eq(postRatings.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get rating by id:", error);
    throw error;
  }
}

export async function updatePostRating(id: number, rating: Partial<InsertPostRating>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update rating: database not available");
    return undefined;
  }

  try {
    await db
      .update(postRatings)
      .set({ ...rating, updatedAt: new Date() })
      .where(eq(postRatings.id, id));
    
    // Fetch and return the updated rating
    const result = await db
      .select()
      .from(postRatings)
      .where(eq(postRatings.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update rating:", error);
    throw error;
  }
}

export async function deletePostRating(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete rating: database not available");
    return undefined;
  }

  try {
    return await db.delete(postRatings).where(eq(postRatings.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete rating:", error);
    throw error;
  }
}

export async function getPendingRatings(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const results = await db
    .select({
      rating: postRatings,
      user: {
        name: users.name,
        role: users.role,
        email: users.email,
      }
    })
    .from(postRatings)
    .leftJoin(users, eq(postRatings.userId, users.id))
    .where(eq(postRatings.status, "pending"))
    .orderBy(desc(postRatings.createdAt))
    .limit(limit);

  return results.map(r => ({
    ...r.rating,
    user: r.user
  }));
}

export async function updatePostRatingStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  await db
    .update(postRatings)
    .set({ status, updatedAt: new Date() })
    .where(eq(postRatings.id, id));
    
  return true;
}
