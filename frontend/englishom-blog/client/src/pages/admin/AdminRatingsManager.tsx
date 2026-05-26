import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminRatingsManager() {
  const { language } = useLocalization();
  
  const { data: ratings, isLoading, refetch } = trpc.blog.ratings.listPending.useQuery({ limit: 50 });
  const approveMutation = trpc.blog.ratings.approve.useMutation({
    onSuccess: () => {
      toast.success("Rating approved");
      refetch();
    }
  });
  const rejectMutation = trpc.blog.ratings.delete.useMutation({
    onSuccess: () => {
      toast.success("Rating rejected");
      refetch();
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التقييمات المعلقة" : "Pending Ratings"}</h2>
        <p className="text-muted-foreground">{language === "ar" ? "لا توجد تقييمات معلقة." : "No pending ratings."}</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التقييمات المعلقة" : "Pending Ratings"}</h2>
      
      <div className="space-y-4">
        {ratings.map((rating: any) => (
          <div key={rating.id} className="p-4 border border-border rounded-lg flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{rating.user?.name || "Anonymous"}</span>
                {rating.user?.email && (
                  <a href={`mailto:${rating.user.email}`} className="text-xs text-blue-600 hover:underline">
                    📧 {rating.user.email}
                  </a>
                )}
                {rating.user?.role === "admin" && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] uppercase font-bold rounded">
                    Admin
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  | Post ID: {rating.postId} | {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-1 mb-2">
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
              {rating.review && <p>{rating.review}</p>}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => approveMutation.mutate({ id: rating.id })}
                disabled={approveMutation.isPending}
              >
                <Check className="w-4 h-4 mr-1" /> {language === "ar" ? "موافقة" : "Approve"}
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => rejectMutation.mutate({ id: rating.id })}
                disabled={rejectMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" /> {language === "ar" ? "رفض" : "Reject"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
