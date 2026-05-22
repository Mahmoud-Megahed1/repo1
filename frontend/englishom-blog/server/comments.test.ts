import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import * as schema from "../drizzle/schema";

describe("Comments API", () => {
  const testPostId = 1;
  const testUserId = 1;

  it("should create a comment", async () => {
    const comment = await db.createComment({
      postId: testPostId,
      userId: testUserId,
      content: "Great lesson! Very helpful.",
      status: "approved",
    });

    expect(comment).toBeDefined();
    expect(comment.content).toBe("Great lesson! Very helpful.");
    expect(comment.postId).toBe(testPostId);
  });

  it("should get approved comments for a post", async () => {
    const comments = await db.getApprovedComments(testPostId, 10, 0);
    expect(Array.isArray(comments)).toBe(true);
  });

  it("should get pending comments", async () => {
    const pendingComments = await db.getPendingComments();
    expect(Array.isArray(pendingComments)).toBe(true);
  });

  it("should get comment by ID", async () => {
    const comments = await db.getApprovedComments(testPostId, 10, 0);
    if (comments.length > 0) {
      const commentId = comments[0].id;
      const comment = await db.getCommentById(commentId);
      expect(comment).toBeDefined();
      expect(comment?.id).toBe(commentId);
    }
  });

  it("should update comment status", async () => {
    const comments = await db.getApprovedComments(testPostId, 10, 0);
    if (comments.length > 0) {
      const commentId = comments[0].id;
      const updated = await db.updateCommentStatus(commentId, "rejected");
      expect(updated.status).toBe("rejected");
    }
  });

  it("should delete a comment", async () => {
    const comment = await db.createComment({
      postId: testPostId,
      userId: testUserId,
      content: "Test comment for deletion",
      status: "approved",
    });

    const result = await db.deleteComment(comment.id);
    expect(result).toBeDefined();
  });

  it("should create nested comment (reply)", async () => {
    const parentComment = await db.createComment({
      postId: testPostId,
      userId: testUserId,
      content: "Parent comment",
      status: "approved",
    });

    const replyComment = await db.createComment({
      postId: testPostId,
      userId: testUserId,
      content: "Reply to parent",
      parentCommentId: parentComment.id,
      status: "approved",
    });

    expect(replyComment.parentCommentId).toBe(parentComment.id);
  });
});
