import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import * as schema from "../drizzle/schema";

describe("Ratings API", () => {
  const testPostId = 1;
  const testUserId = 1;

  it("should create a post rating", async () => {
    const rating = await db.createPostRating({
      postId: testPostId,
      userId: testUserId,
      rating: 5,
      review: "Excellent lesson!",
    });

    expect(rating).toBeDefined();
    expect(rating.rating).toBe(5);
    expect(rating.review).toBe("Excellent lesson!");
  });

  it("should get post ratings", async () => {
    const ratings = await db.getPostRatings(testPostId);
    expect(Array.isArray(ratings)).toBe(true);
    expect(ratings.length).toBeGreaterThan(0);
  });

  it("should get average rating for a post", async () => {
    const avgRating = await db.getPostAverageRating(testPostId);
    expect(avgRating).toBeDefined();
    expect(avgRating.avgRating).toBeGreaterThan(0);
    expect(avgRating.count).toBeGreaterThan(0);
  });

  it("should get user's rating for a post", async () => {
    const userRating = await db.getUserPostRating(testPostId, testUserId);
    expect(userRating).toBeDefined();
    expect(userRating.userId).toBe(testUserId);
  });

  it("should update a post rating", async () => {
    const ratings = await db.getPostRatings(testPostId);
    if (ratings.length > 0) {
      const ratingId = ratings[0].id;
      const updated = await db.updatePostRating(ratingId, {
        rating: 4,
        review: "Updated review",
      });
      expect(updated.rating).toBe(4);
      expect(updated.review).toBe("Updated review");
    }
  });

  it("should delete a post rating", async () => {
    const ratings = await db.getPostRatings(testPostId);
    if (ratings.length > 0) {
      const ratingId = ratings[ratings.length - 1].id;
      const result = await db.deletePostRating(ratingId);
      expect(result).toBeDefined();
    }
  });
});
