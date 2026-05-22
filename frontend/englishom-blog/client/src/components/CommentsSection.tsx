import React, { useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocalization } from "@/contexts/LocalizationContext";
import { toast } from "sonner";

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const { language } = useLocalization();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  const { data: comments, refetch } = trpc.blog.comments.list.useQuery({
    postId,
  });

  const createComment = trpc.blog.comments.create.useMutation();
  const deleteComment = trpc.blog.comments.delete.useMutation();

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error(language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please log in first");
      return;
    }

    if (!commentText.trim()) {
      toast.error(language === "ar" ? "يرجى كتابة تعليق" : "Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await createComment.mutateAsync({
        postId,
        content: commentText,
      });
      toast.success(language === "ar" ? "تم إضافة التعليق" : "Comment added");
      setCommentText("");
      refetch();
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm(language === "ar" ? "هل تريد حذف التعليق؟" : "Delete this comment?")) {
      return;
    }

    try {
      await deleteComment.mutateAsync({ id: commentId });
      toast.success(language === "ar" ? "تم حذف التعليق" : "Comment deleted");
      refetch();
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ" : "An error occurred");
    }
  };

  return (
    <div className="space-y-6 mt-8 pt-8 border-t border-border">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        <h3 className="text-2xl font-bold">
          {language === "ar" ? "التعليقات" : "Comments"} ({comments?.length || 0})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="space-y-3 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <img
              src={user.email ? `https://ui-avatars.com/api/?name=${user.name || "User"}` : ""}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "الآن" : "Just now"}
              </p>
            </div>
          </div>

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              language === "ar"
                ? "اكتب تعليقك هنا..."
                : "Write your comment here..."
            }
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            disabled={isSubmitting}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setCommentText("")}
              className="px-4 py-2 text-foreground hover:bg-background rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {language === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !commentText.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting
                ? language === "ar"
                  ? "جاري الإرسال..."
                  : "Sending..."
                : language === "ar"
                ? "إرسال"
                : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-card rounded-lg border border-border text-center">
          <p className="text-muted-foreground">
            {language === "ar"
              ? "يجب تسجيل الدخول لإضافة تعليق"
              : "Please log in to add a comment"}
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div
              key={comment.id}
              className="p-4 bg-card rounded-lg border border-border space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${comment.user?.name || "User"}`}
                    alt={comment.user?.name || "User"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{comment.user?.name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString(
                        language === "ar" ? "ar-SA" : "en-US"
                      )}
                    </p>
                  </div>
                </div>

                {user?.id === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>

              {comment.status === "pending" && user?.role === "admin" && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  {language === "ar" ? "في انتظار المراجعة" : "Pending review"}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {language === "ar"
              ? "لا توجد تعليقات حتى الآن. كن الأول!"
              : "No comments yet. Be the first!"}
          </div>
        )}
      </div>
    </div>
  );
}
