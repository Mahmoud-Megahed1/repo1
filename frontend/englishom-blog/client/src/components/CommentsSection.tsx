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
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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
        parentCommentId: replyingTo || undefined,
      });
      toast.success(language === "ar" ? "تم إضافة التعليق" : "Comment added");
      setCommentText("");
      setReplyingTo(null);
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

          {replyingTo && (
            <div className="flex items-center justify-between text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 p-2 rounded-md mb-2">
              <span>{language === "ar" ? "أنت تقوم بالرد على تعليق" : "Replying to a comment"}</span>
              <button 
                onClick={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
                className="text-xs hover:underline"
              >
                {language === "ar" ? "إلغاء الرد" : "Cancel reply"}
              </button>
            </div>
          )}

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
              onClick={() => {
                setCommentText("");
                setReplyingTo(null);
              }}
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
          (() => {
            const topLevelComments = comments.filter((c: any) => !c.parentCommentId);
            const getReplies = (parentId: number) => comments.filter((c: any) => c.parentCommentId === parentId);

            return topLevelComments.map((comment: any) => (
              <div key={comment.id} className="space-y-3">
                <div className="p-4 bg-card rounded-lg border border-border space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${comment.user?.name || "User"}`}
                        alt={comment.user?.name || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{comment.user?.name || "Anonymous"}</p>
                          {comment.user?.role === "admin" && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] uppercase font-bold rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            language === "ar" ? "ar-SA" : "en-US"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {user?.role === "admin" && user?.id !== comment.userId && (
                        <button
                          onClick={() => {
                            setCommentText(`@${comment.user?.name || "Anonymous"} `);
                            setReplyingTo(comment.id);
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                          }}
                          className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 p-2 rounded-lg transition-colors text-sm font-medium"
                        >
                          {language === "ar" ? "رد" : "Reply"}
                        </button>
                      )}
                      {(user?.id === comment.userId || user?.role === "admin") && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950 p-2 rounded-lg transition-colors"
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>

                  {comment.status === "pending" && user?.role === "admin" && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      {language === "ar" ? "في انتظار المراجعة" : "Pending review"}
                    </div>
                  )}
                </div>

                {/* Replies */}
                {getReplies(comment.id).length > 0 && (
                  <div className="pl-8 md:pl-12 space-y-3">
                    {getReplies(comment.id).map((reply: any) => (
                      <div key={reply.id} className="p-3 bg-muted/50 rounded-lg border border-border space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${reply.user?.name || "User"}`}
                              alt={reply.user?.name || "User"}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{reply.user?.name || "Anonymous"}</p>
                                {reply.user?.role === "admin" && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] uppercase font-bold rounded">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleDateString(
                                  language === "ar" ? "ar-SA" : "en-US"
                                )}
                              </p>
                            </div>
                          </div>

                          {(user?.id === reply.userId || user?.role === "admin") && (
                            <button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950 p-1.5 rounded-lg transition-colors"
                              title={language === "ar" ? "حذف" : "Delete"}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ));
          })()
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
