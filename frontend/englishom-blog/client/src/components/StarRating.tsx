import React, { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocalization } from "@/contexts/LocalizationContext";
import { toast } from "sonner";

interface StarRatingProps {
  postId: number;
  onRatingSubmit?: () => void;
}

export default function StarRating({ postId, onRatingSubmit }: StarRatingProps) {
  const { user } = useAuth();
  const { language } = useLocalization();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch average rating
  const { data: averageRating } = trpc.blog.ratings.getAverageByPost.useQuery({
    postId,
  });

  // Fetch all ratings
  const { data: allRatings } = trpc.blog.ratings.getByPost.useQuery({
    postId,
  });

  const createRating = trpc.blog.ratings.create.useMutation();
  const deleteRating = trpc.blog.ratings.delete.useMutation();
  const updateRating = trpc.blog.ratings.update.useMutation();

  const handleSubmit = async () => {
    if (!user) {
      toast.error(language === "ar" ? "يجب تسجيل الدخول أولاً" : "Please log in first");
      return;
    }

    if (selectedRating === 0) {
      toast.error(language === "ar" ? "يرجى اختيار تقييم" : "Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRating.mutateAsync({
        postId,
        rating: selectedRating,
        review,
      });
      toast.success(language === "ar" ? "شكراً لتقييمك" : "Thank you for rating");
      setSelectedRating(0);
      setReview("");
      onRatingSubmit?.();
    } catch (error) {
      toast.error(language === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">
          {language === "ar" ? "قيّم هذا الدرس" : "Rate this lesson"}
        </h3>

        {/* Star Rating Display */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              disabled={isSubmitting}
            >
              <Star
                size={32}
                className={`transition-colors ${
                  (hoverRating || selectedRating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Average Rating Display */}
        {averageRating && averageRating.count > 0 && (
          <div className="text-sm text-muted-foreground">
            {language === "ar"
              ? `متوسط التقييم: ${averageRating.avgRating.toFixed(1)} من 5 (${averageRating.count} تقييم)`
              : `Average: ${averageRating.avgRating.toFixed(1)}/5 (${averageRating.count} ratings)`}
          </div>
        )}
      </div>

      {/* Review Text Area */}
      {user && (
        <div className="space-y-2">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={
              language === "ar"
                ? "أضف رأيك (اختياري)"
                : "Add your review (optional)"
            }
            className="w-full p-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRating === 0}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? language === "ar"
                ? "جاري الإرسال..."
                : "Submitting..."
              : language === "ar"
              ? "إرسال التقييم"
              : "Submit Rating"}
          </button>
        </div>
      )}

      {/* Ratings List */}
      {allRatings && allRatings.length > 0 && (
        <div className="space-y-3 mt-4 pt-4 border-t border-border">
          <h4 className="font-semibold">
            {language === "ar" ? "التقييمات" : "Reviews"}
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {allRatings.map((rating: any) => (
              <div key={rating.id} className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${rating.user?.name || "User"}&background=random`}
                      alt={rating.user?.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {rating.user?.name || (language === "ar" ? "مستخدم" : "User")}
                        </p>
                        {user?.role === "admin" && rating.user?.email && (
                          <a 
                            href={`mailto:${rating.user.email}`}
                            className="text-xs text-blue-600 hover:underline"
                            title={rating.user.email}
                          >
                            📧 {rating.user.email}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(rating.createdAt).toLocaleDateString(
                        language === "ar" ? "ar-SA" : "en-US"
                      )}
                    </span>
                    {(user?.role === "admin" || user?.id === rating.userId) && (
                      <button
                        onClick={async () => {
                          if (confirm(language === "ar" ? "هل تريد حذف هذا التقييم؟" : "Delete this rating?")) {
                            try {
                              await deleteRating.mutateAsync({ id: rating.id });
                              toast.success(language === "ar" ? "تم الحذف" : "Deleted");
                              window.location.reload();
                            } catch (error) {
                              toast.error("Error deleting rating");
                            }
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {rating.review && (
                  <p className="text-sm text-foreground mt-2">{rating.review}</p>
                )}
                
                {/* Admin Reply Section */}
                {rating.adminReply && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">
                      {language === "ar" ? "رد الإدارة:" : "Admin Reply:"}
                    </p>
                    <p className="text-sm">{rating.adminReply}</p>
                  </div>
                )}
                
                {user?.role === "admin" && !rating.adminReply && (
                  <div className="mt-3 flex gap-2">
                    <input 
                      type="text" 
                      id={`reply-${rating.id}`}
                      placeholder={language === "ar" ? "اكتب رداً..." : "Write a reply..."}
                      className="text-sm p-1.5 border border-border rounded flex-1 focus:outline-none focus:ring-1"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById(`reply-${rating.id}`) as HTMLInputElement;
                        if (!input.value.trim()) return;
                        try {
                          await updateRating.mutateAsync({ 
                            id: rating.id, 
                            adminReply: input.value 
                          });
                          toast.success(language === "ar" ? "تم الرد" : "Replied");
                          window.location.reload();
                        } catch (error) {
                          toast.error("Error replying");
                        }
                      }}
                      className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90"
                    >
                      {language === "ar" ? "رد" : "Reply"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
