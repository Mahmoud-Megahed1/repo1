import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import axios from "axios";
import { sdk } from "./_core/sdk";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    adminLogin: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const res = await axios.post("http://127.0.0.1:5000/api/admin/auth/login", {
            email: input.email,
            password: input.password,
          });
          const { user } = res.data;
          
          if (user.adminRole !== "super" && user.adminRole !== "blog_admin" && user.adminRole !== "operator") {
            throw new TRPCError({ code: "FORBIDDEN", message: "You don't have permission to access Blog Admin" });
          }

          const openId = user._id || user.id;
          await db.upsertUser({
            openId: openId,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Admin",
            email: user.email,
            role: "admin",
          });

          const sessionToken = await sdk.createSessionToken(openId, { name: user.firstName || "Admin" });
          
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
          
          return { success: true };
        } catch (error: any) {
          console.error("====== BLOG LOGIN ERROR ======");
          console.error("Email attempted:", input.email);
          console.error("Password length:", input.password.length);
          console.error("Error from backend:", error?.response?.data || error?.message);
          console.error("==============================");
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ 
            code: "UNAUTHORIZED", 
            message: `[DEBUG BLOG] ${error.response?.data?.message || "Invalid email or password"}` 
          });
        }
      }),
  }),

  // ============================================================================
  // BLOG POSTS ROUTER
  // ============================================================================
  blog: router({
    posts: router({
      // Get published posts with pagination
      list: publicProcedure
        .input(
          z.object({
            limit: z.number().min(1).max(100).default(10),
            offset: z.number().min(0).default(0),
            categoryId: z.number().optional(),
            search: z.string().optional(),
          })
        )
        .query(async ({ input }) => {
          if (input.search) {
            const results = await db.searchPosts(input.search, input.limit);
            return {
              posts: results,
              total: results.length,
            };
          }

          if (input.categoryId) {
            const posts = await db.getPostsByCategory(input.categoryId, input.limit, input.offset);
            const total = await db.getPublishedPostsCount();
            return { posts, total };
          }

          const posts = await db.getPublishedPosts(input.limit, input.offset);
          const total = await db.getPublishedPostsCount();
          return { posts, total };
        }),

      // Get single post by slug
      getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
          const post = await db.getPostBySlug(input.slug);
          if (!post) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
          }

          // Increment view count
          await db.incrementPostViews(post.id);

          return post;
        }),

      // Get featured posts
      featured: publicProcedure
        .input(z.object({ limit: z.number().min(1).max(20).default(6) }))
        .query(async ({ input }) => {
          return db.getFeaturedPosts(input.limit);
        }),

      // Get related posts
      related: publicProcedure
        .input(
          z.object({
            postId: z.number(),
            categoryId: z.number(),
            limit: z.number().min(1).max(10).default(3),
          })
        )
        .query(async ({ input }) => {
          return db.getRelatedPosts(input.postId, input.categoryId, input.limit);
        }),

      // Create post (admin only)
      create: adminProcedure
        .input(
          z.object({
            slug: z.string().min(1),
            titleEn: z.string().min(1),
            titleAr: z.string().min(1),
            contentEn: z.string().min(1),
            contentAr: z.string().min(1),
            excerptEn: z.string().optional(),
            excerptAr: z.string().optional(),
            categoryId: z.number(),
            status: z.enum(["draft", "published", "scheduled"]),
            readingTimeMinutes: z.number().optional(),
            metaDescriptionEn: z.string().optional(),
            metaDescriptionAr: z.string().optional(),
            metaKeywordsEn: z.string().optional(),
            metaKeywordsAr: z.string().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          const post = await db.createPost({
            ...input,
            authorId: ctx.user.id,
          });

          // Notify owner of new post
          if (input.status === "published") {
            await notifyOwner({
              title: "New Blog Post Published",
              content: `A new blog post "${input.titleEn}" has been published.`,
            });
          }

          return post;
        }),

      // Update post (admin only)
      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            titleEn: z.string().optional(),
            titleAr: z.string().optional(),
            contentEn: z.string().optional(),
            contentAr: z.string().optional(),
            excerptEn: z.string().optional(),
            excerptAr: z.string().optional(),
            categoryId: z.number().optional(),
            status: z.enum(["draft", "published", "scheduled"]).optional(),
            isFeatured: z.boolean().optional(),
            metaDescriptionEn: z.string().optional(),
            metaDescriptionAr: z.string().optional(),
            metaKeywordsEn: z.string().optional(),
            metaKeywordsAr: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return db.updatePost(id, data);
        }),

      // Delete post (admin only)
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.deletePost(input.id);
        }),

      // Publish post (admin only)
      publish: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          const result = await db.updatePost(input.id, {
            status: "published",
            publishedAt: new Date(),
          });

          const post = await db.getPostById(input.id);
          if (post) {
            await notifyOwner({
              title: "Blog Post Published",
              content: `The blog post "${post.titleEn}" has been published.`,
            });
          }

          return result;
        }),

      // Upload featured image
      uploadImage: adminProcedure
        .input(
          z.object({
            postId: z.number(),
            fileName: z.string(),
            fileData: z.string(), // base64 encoded
          })
        )
        .mutation(async ({ input, ctx }) => {
          try {
            const buffer = Buffer.from(input.fileData, "base64");
            const { url, key } = await storagePut(
              `blog/featured-images/${input.postId}-${Date.now()}-${input.fileName}`,
              buffer,
              "image/jpeg"
            );

            await db.updatePost(input.postId, {
              featuredImageUrl: url,
              featuredImageKey: key,
            });

            return { url, key };
          } catch (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to upload image",
            });
          }
        }),
    }),

    // ============================================================================
    // BLOG CATEGORIES ROUTER
    // ============================================================================
    categories: router({
      list: publicProcedure.query(async () => {
        return db.getAllCategories();
      }),

      getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
          return db.getCategoryBySlug(input.slug);
        }),

      create: adminProcedure
        .input(
          z.object({
            slug: z.string().min(1),
            nameEn: z.string().min(1),
            nameAr: z.string().min(1),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
            colorHex: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          return db.createCategory(input);
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            nameEn: z.string().optional(),
            nameAr: z.string().optional(),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
            colorHex: z.string().optional(),
            displayOrder: z.number().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return db.updateCategory(id, data);
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.deleteCategory(input.id);
        }),
    }),

    // ============================================================================
    // BLOG COMMENTS ROUTER
    // ============================================================================
    comments: router({
      list: publicProcedure
        .input(
          z.object({
            postId: z.number(),
            limit: z.number().min(1).max(100).default(20),
            offset: z.number().min(0).default(0),
          })
        )
        .query(async ({ input }) => {
          return db.getApprovedComments(input.postId, input.limit, input.offset);
        }),

      create: publicProcedure
        .input(
          z.object({
            postId: z.number(),
            content: z.string().min(1).max(5000),
            parentCommentId: z.number().optional(),
            guestName: z.string().optional(),
            guestEmail: z.string().email().optional(),
          })
        )
        .mutation(async ({ input, ctx }) => {
          let userId: number;
          let isAdmin = false;
          
          if (ctx.user) {
            userId = ctx.user.id;
            isAdmin = ctx.user.role === "admin";
          } else {
            if (!input.guestName || !input.guestEmail) {
              throw new TRPCError({ code: "BAD_REQUEST", message: "Name and email are required for guests" });
            }
            userId = await db.getOrCreateGuestUser(input.guestName, input.guestEmail);
          }
          const post = await db.getPostById(input.postId);
          if (!post) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
          }

          const status = isAdmin ? "approved" : "pending";

          const comment = await db.createComment({
            postId: input.postId,
            userId: userId,
            content: input.content,
            parentCommentId: input.parentCommentId,
            status: status,
          });

          // Notify owner of new comment only if it needs approval
          if (status === "pending") {
            await notifyOwner({
              title: "New Comment Pending Approval",
              content: `A new comment has been posted on "${post.titleEn}" and is awaiting approval.`,
            });
          }

          return comment;
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const comment = await db.getCommentById(input.id);
          if (!comment) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Comment not found" });
          }

          if (comment.userId !== ctx.user.id && ctx.user.role !== "admin") {
            throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete this comment" });
          }

          return db.deleteComment(input.id);
        }),

      // Admin only - get pending comments
      listPending: adminProcedure
        .input(z.object({ limit: z.number().default(50) }))
        .query(async () => {
          return db.getPendingComments();
        }),

      // Admin only - approve comment
      approve: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.updateCommentStatus(input.id, "approved");
        }),

      // Admin only - reject comment
      reject: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.updateCommentStatus(input.id, "rejected");
        }),
    }),

    // ============================================================================
    // BLOG MEDIA ROUTER
    // ============================================================================
    media: router({
      getByPost: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => {
          return db.getMediaByPost(input.postId);
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.deleteMedia(input.id);
        }),
    }),

    // ============================================================================
    // BLOG TAGS ROUTER
    // ============================================================================
    tags: router({
      list: publicProcedure.query(async () => {
        return db.getAllTags();
      }),

      getBySlug: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
          return db.getTagBySlug(input.slug);
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.getTagById(input.id);
        }),

      create: adminProcedure
        .input(z.object({
          nameEn: z.string().min(1),
          nameAr: z.string().min(1),
          slug: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
          return db.createTag(input);
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          nameEn: z.string().optional(),
          nameAr: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return db.updateTag(id, data);
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.deleteTag(input.id);
        }),

      getPostTags: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => {
          return db.getPostTags(input.postId);
        }),

      addToPost: adminProcedure
        .input(z.object({ postId: z.number(), tagId: z.number() }))
        .mutation(async ({ input }) => {
          return db.addTagToPost(input.postId, input.tagId);
        }),

      removeFromPost: adminProcedure
        .input(z.object({ postId: z.number(), tagId: z.number() }))
        .mutation(async ({ input }) => {
          return db.removeTagFromPost(input.postId, input.tagId);
        }),

      getPostsByTag: publicProcedure
        .input(z.object({
          tagId: z.number(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        }))
        .query(async ({ input }) => {
          return db.getPostsByTag(input.tagId, input.limit, input.offset);
        }),
    }),

    // ============================================================================
    // BLOG CTA ROUTER
    // ============================================================================
    cta: router({
      getByPost: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => {
          return db.getCtaByPost(input.postId);
        }),

      create: adminProcedure
        .input(
          z.object({
            postId: z.number().optional(),
            titleEn: z.string(),
            titleAr: z.string(),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
            buttonTextEn: z.string(),
            buttonTextAr: z.string(),
            buttonUrl: z.string().url(),
            buttonStyle: z.enum(["primary", "secondary", "outline"]).optional(),
            position: z.enum(["top", "middle", "bottom", "sidebar"]).optional(),
          })
        )
        .mutation(async ({ input }) => {
          return db.createCta(input);
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.number(),
            titleEn: z.string().optional(),
            titleAr: z.string().optional(),
            descriptionEn: z.string().optional(),
            descriptionAr: z.string().optional(),
            buttonTextEn: z.string().optional(),
            buttonTextAr: z.string().optional(),
            buttonUrl: z.string().optional(),
            isActive: z.boolean().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          return db.updateCta(id, data);
        }),
    }),
    analytics: router({
      getPostStats: adminProcedure
        .input(z.object({ postId: z.number(), daysBack: z.number().default(30) }))
        .query(async ({ input }) => {
          return db.getPostAnalytics(input.postId, input.daysBack);
        }),
    }),
    email: router({
      subscribe: publicProcedure
        .input(z.object({ email: z.string().email(), name: z.string().optional() }))
        .mutation(async ({ input }) => db.subscribeEmail(input.email, input.name)),
      unsubscribe: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .mutation(async ({ input }) => db.unsubscribeEmail(input.email)),
      getSubscribers: adminProcedure
        .query(async () => db.getActiveSubscribers()),
      sendNotification: adminProcedure
        .input(z.object({ postId: z.number(), subject: z.string(), body: z.string() }))
        .mutation(async ({ input }) => {
          const subscribers = await db.getActiveSubscribers();
          const notifications = await Promise.all(
            subscribers.map(sub => db.createEmailNotification({
              postId: input.postId,
              subscriberEmail: sub.email,
              subject: input.subject,
              body: input.body,
              status: "pending",
            }))
          );
          return { count: notifications.length };
        }),
      getPendingNotifications: adminProcedure
        .query(async () => db.getPendingNotifications()),
      updateNotificationStatus: adminProcedure
        .input(z.object({ id: z.number(), status: z.enum(["sent", "failed"]), failureReason: z.string().optional() }))
        .mutation(async ({ input }) => db.updateNotificationStatus(input.id, input.status, input.failureReason)),
    }),
    ratings: router({
      create: publicProcedure
        .input(z.object({ 
          postId: z.number(), 
          rating: z.number().min(1).max(5), 
          review: z.string().optional(),
          guestName: z.string().optional(),
          guestEmail: z.string().email().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          let userId: number;
          let isAdmin = false;
          
          if (ctx.user) {
            userId = ctx.user.id;
            isAdmin = ctx.user.role === "admin";
          } else {
            if (!input.guestName || !input.guestEmail) {
              throw new TRPCError({ code: "BAD_REQUEST", message: "Name and email are required for guests" });
            }
            userId = await db.getOrCreateGuestUser(input.guestName, input.guestEmail);
          }

          const status = isAdmin ? "approved" : "pending";
          return db.createPostRating({ postId: input.postId, userId, rating: input.rating, review: input.review, status });
        }),
      getByPost: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => db.getPostRatings(input.postId)),
      getAverageByPost: publicProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ input }) => db.getPostAverageRating(input.postId)),
      getUserRating: protectedProcedure
        .input(z.object({ postId: z.number() }))
        .query(async ({ ctx, input }) => db.getUserPostRating(input.postId, ctx.user.id)),
      update: protectedProcedure
        .input(z.object({ id: z.number(), rating: z.number().min(1).max(5).optional(), review: z.string().optional(), adminReply: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
          const rating = await db.getPostRatingById(input.id);
          if (!rating) throw new TRPCError({ code: "NOT_FOUND", message: "Rating not found" });
          if (rating.userId !== ctx.user.id && ctx.user.role !== "admin") {
            throw new TRPCError({ code: "FORBIDDEN", message: "Cannot edit this rating" });
          }
          
          const updateData: any = {};
          if (input.rating !== undefined) updateData.rating = input.rating;
          if (input.review !== undefined) updateData.review = input.review;
          if (input.adminReply !== undefined && ctx.user.role === "admin") {
            updateData.adminReply = input.adminReply;
          }
          
          return db.updatePostRating(input.id, updateData);
        }),
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const rating = await db.getPostRatingById(input.id);
          if (!rating) throw new TRPCError({ code: "NOT_FOUND", message: "Rating not found" });
          if (rating.userId !== ctx.user.id && ctx.user.role !== "admin") {
            throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete this rating" });
          }
          return db.deletePostRating(input.id);
        }),
      listPending: adminProcedure
        .input(z.object({ limit: z.number().optional() }))
        .query(async ({ input }) => {
          return db.getPendingRatings(input.limit || 50);
        }),
      approve: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.updatePostRatingStatus(input.id, "approved");
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
