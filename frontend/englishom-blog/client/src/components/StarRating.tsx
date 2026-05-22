import React, { useState } from "react";
import { Star } from "lucide-react";
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
              <div key={rating.id} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= rating.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rating.createdAt).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US"
                    )}
                  </span>
                </div>
                {rating.review && (
                  <p className="text-sm text-foreground">{rating.review}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
