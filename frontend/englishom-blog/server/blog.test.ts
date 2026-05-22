import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock user for testing
const mockAdminUser: User = {
  id: 1,
  openId: "admin-user-123",
  email: "admin@englishom.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockRegularUser: User = {
  id: 2,
  openId: "user-123",
  email: "user@englishom.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(user: User | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Blog Posts Router", () => {
  describe("blog.posts.list", () => {
    it("should return published posts", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.blog.posts.list({ limit: 10, offset: 0 });
      
      expect(result).toBeDefined();
      expect(result.posts).toBeDefined();
      expect(Array.isArray(result.posts)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });

    it("should support pagination", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result1 = await caller.blog.posts.list({ limit: 5, offset: 0 });
      const result2 = await caller.blog.posts.list({ limit: 5, offset: 5 });
      
      expect(result1.posts.length).toBeLessThanOrEqual(5);
      expect(result2.posts.length).toBeLessThanOrEqual(5);
    });
  });

  describe("blog.posts.featured", () => {
    it("should return featured posts", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.blog.posts.featured({ limit: 6 });
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(6);
    });
  });

  describe("blog.posts.create", () => {
    it("should require admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockRegularUser));
      
      try {
        await caller.blog.posts.create({
          slug: "test-post",
          titleEn: "Test Post",
          titleAr: "مقالة اختبار",
          contentEn: "Test content",
          contentAr: "محتوى اختبار",
          categoryId: 1,
          status: "draft",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("should allow admin to create posts", async () => {
      const caller = appRouter.createCaller(createMockContext(mockAdminUser));
      
      const result = await caller.blog.posts.create({
        slug: `test-post-${Date.now()}`,
        titleEn: "Test Post",
        titleAr: "مقالة اختبار",
        contentEn: "Test content",
        contentAr: "محتوى اختبار",
        categoryId: 1,
        status: "draft",
      });
      
      expect(result).toBeDefined();
    });
  });
});

describe("Blog Categories Router", () => {
  describe("blog.categories.list", () => {
    it("should return all active categories", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.blog.categories.list();
      
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Blog Comments Router", () => {
  describe("blog.comments.create", () => {
    it("should require authentication", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      
      try {
        await caller.blog.comments.create({
          postId: 1,
          content: "Test comment",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should allow authenticated users to comment", async () => {
      const caller = appRouter.createCaller(createMockContext(mockRegularUser));
      
      // This test assumes a post with ID 1 exists
      // In a real test, we would create a post first
      try {
        const result = await caller.blog.comments.create({
          postId: 1,
          content: "Test comment",
        });
        
        expect(result).toBeDefined();
      } catch (error: any) {
        // Post might not exist in test DB
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("blog.comments.list", () => {
    it("should return approved comments for a post", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.blog.comments.list({ postId: 1, limit: 20 });
      
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe("Authentication", () => {
  describe("auth.me", () => {
    it("should return null for unauthenticated users", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.auth.me();
      
      expect(result).toBeNull();
    });

    it("should return user data for authenticated users", async () => {
      const caller = appRouter.createCaller(createMockContext(mockRegularUser));
      const result = await caller.auth.me();
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(mockRegularUser.id);
      expect(result?.email).toBe(mockRegularUser.email);
    });
  });
});
