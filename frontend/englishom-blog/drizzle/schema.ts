import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, date, longtext, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

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

// Blog Categories Table
export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  iconUrl: varchar("iconUrl", { length: 512 }),
  colorHex: varchar("colorHex", { length: 7 }).default("#2167D1"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index("slug_idx").on(table.slug),
}));

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

// Blog Posts Table
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  contentEn: longtext("contentEn").notNull(),
  contentAr: longtext("contentAr").notNull(),
  excerptEn: text("excerptEn"),
  excerptAr: text("excerptAr"),
  featuredImageUrl: varchar("featuredImageUrl", { length: 512 }),
  featuredImageKey: varchar("featuredImageKey", { length: 512 }),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId").notNull(),
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft"),
  publishedAt: timestamp("publishedAt"),
  scheduledFor: timestamp("scheduledFor"),
  readingTimeMinutes: int("readingTimeMinutes").default(5),
  viewsCount: int("viewsCount").default(0),
  isFeatured: boolean("isFeatured").default(false),
  metaDescriptionEn: varchar("metaDescriptionEn", { length: 160 }),
  metaDescriptionAr: varchar("metaDescriptionAr", { length: 160 }),
  metaKeywordsEn: varchar("metaKeywordsEn", { length: 255 }),
  metaKeywordsAr: varchar("metaKeywordsAr", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"),
}, (table) => ({
  slugIdx: index("post_slug_idx").on(table.slug),
  categoryIdx: index("post_category_idx").on(table.categoryId),
  authorIdx: index("post_author_idx").on(table.authorId),
  statusIdx: index("post_status_idx").on(table.status),
}));

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Blog Tags Table
export const blogTags = mysqlTable("blog_tags", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  usageCount: int("usageCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("tag_slug_idx").on(table.slug),
}));

export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = typeof blogTags.$inferInsert;

// Blog Post Tags Junction Table
export const blogPostTags = mysqlTable("blog_post_tags", {
  postId: int("postId").notNull(),
  tagId: int("tagId").notNull(),
}, (table) => ({
  pk: { name: "pk", columns: [table.postId, table.tagId] },
}));

// Blog Comments Table
export const blogComments = mysqlTable("blog_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  parentCommentId: int("parentCommentId"),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  isHelpfulCount: int("isHelpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  approvedAt: timestamp("approvedAt"),
}, (table) => ({
  postIdx: index("comment_post_idx").on(table.postId),
  userIdx: index("comment_user_idx").on(table.userId),
  statusIdx: index("comment_status_idx").on(table.status),
}));

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = typeof blogComments.$inferInsert;

// Blog Media Table
export const blogMedia = mysqlTable("blog_media", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId"),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 100 }),
  fileSize: int("fileSize"),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  postIdx: index("media_post_idx").on(table.postId),
  uploadedByIdx: index("media_user_idx").on(table.uploadedBy),
}));

export type BlogMedia = typeof blogMedia.$inferSelect;
export type InsertBlogMedia = typeof blogMedia.$inferInsert;

// Blog CTA Table
export const blogCta = mysqlTable("blog_cta", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId"),
  titleEn: varchar("titleEn", { length: 255 }).notNull(),
  titleAr: varchar("titleAr", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionAr: text("descriptionAr"),
  buttonTextEn: varchar("buttonTextEn", { length: 100 }),
  buttonTextAr: varchar("buttonTextAr", { length: 100 }),
  buttonUrl: varchar("buttonUrl", { length: 512 }).notNull(),
  buttonStyle: mysqlEnum("buttonStyle", ["primary", "secondary", "outline"]).default("primary"),
  position: mysqlEnum("position", ["top", "middle", "bottom", "sidebar"]).default("bottom"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogCta = typeof blogCta.$inferSelect;
export type InsertBlogCta = typeof blogCta.$inferInsert;

// Blog Analytics Table
export const blogAnalytics = mysqlTable("blog_analytics", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  date: date("date").notNull(),
  views: int("views").default(0),
  uniqueVisitors: int("uniqueVisitors").default(0),
  commentsCount: int("commentsCount").default(0),
  sharesCount: int("sharesCount").default(0),
  avgTimeOnPage: int("avgTimeOnPage"),
  bounceRate: decimal("bounceRate", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  postDateIdx: index("analytics_post_date_idx").on(table.postId, table.date),
}));

export type BlogAnalytic = typeof blogAnalytics.$inferSelect;
export type InsertBlogAnalytic = typeof blogAnalytics.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogPosts: many(blogPosts),
  blogComments: many(blogComments),
  blogMedia: many(blogMedia),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  comments: many(blogComments),
  tags: many(blogPostTags),
  media: many(blogMedia),
  ctas: many(blogCta),
  analytics: many(blogAnalytics),
}));

export const blogCommentsRelations = relations(blogComments, ({ one, many }) => ({
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
  }),
  user: one(users, {
    fields: [blogComments.userId],
    references: [users.id],
  }),
  parentComment: one(blogComments, {
    fields: [blogComments.parentCommentId],
    references: [blogComments.id],
  }),
  replies: many(blogComments),
}));

export const blogMediaRelations = relations(blogMedia, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogMedia.postId],
    references: [blogPosts.id],
  }),
  uploadedByUser: one(users, {
    fields: [blogMedia.uploadedBy],
    references: [users.id],
  }),
}));

export const blogCtaRelations = relations(blogCta, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogCta.postId],
    references: [blogPosts.id],
  }),
}));

export const blogAnalyticsRelations = relations(blogAnalytics, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogAnalytics.postId],
    references: [blogPosts.id],
  }),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));


// Email Subscribers Table
export const emailSubscribers = mysqlTable("email_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  verificationToken: varchar("verificationToken", { length: 255 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  isActiveIdx: index("is_active_idx").on(table.isActive),
}));

export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = typeof emailSubscribers.$inferInsert;

// Email Notifications Table
export const emailNotifications = mysqlTable("email_notifications", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  subscriberEmail: varchar("subscriberEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdIdx: index("post_id_idx").on(table.postId),
  statusIdx: index("status_idx").on(table.status),
  createdAtIdx: index("created_at_idx").on(table.createdAt),
}));

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

// Relations for Email Subscribers
export const emailSubscribersRelations = relations(emailSubscribers, ({ many }) => ({
  notifications: many(emailNotifications),
}));

// Relations for Email Notifications
export const emailNotificationsRelations = relations(emailNotifications, ({ one }) => ({
  post: one(blogPosts, {
    fields: [emailNotifications.postId],
    references: [blogPosts.id],
  }),
}));


// Post Ratings Table
export const postRatings = mysqlTable("post_ratings", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  review: text("review"),
  isHelpful: boolean("isHelpful"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdIdx: index("post_id_idx").on(table.postId),
  userIdIdx: index("user_id_idx").on(table.userId),
  uniqueRating: index("unique_rating").on(table.postId, table.userId),
}));

export type PostRating = typeof postRatings.$inferSelect;
export type InsertPostRating = typeof postRatings.$inferInsert;

// Relations for Post Ratings
export const postRatingsRelations = relations(postRatings, ({ one }) => ({
  post: one(blogPosts, {
    fields: [postRatings.postId],
    references: [blogPosts.id],
  }),
  user: one(users, {
    fields: [postRatings.userId],
    references: [users.id],
  }),
}));

// Update blogPostsRelations to include ratings
export const blogPostsRelationsUpdated = relations(blogPosts, ({ one, many }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  comments: many(blogComments),
  tags: many(blogPostTags),
  media: many(blogMedia),
  ctas: many(blogCta),
  analytics: many(blogAnalytics),
  ratings: many(postRatings),
}));
