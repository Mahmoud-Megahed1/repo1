import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Star, Trash2, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminRatingsManager() {
  const { language } = useLocalization();
  
  const { data: ratings, isLoading, refetch } = trpc.blog.ratings.listAdmin.useQuery({ limit: 100 });
  const approveMutation = trpc.blog.ratings.approve.useMutation({
    onSuccess: () => {
      toast.success("Rating approved");
      refetch();
    }
  });
  const rejectMutation = trpc.blog.ratings.reject.useMutation({
    onSuccess: () => {
      toast.success("Rating hidden/rejected");
      refetch();
    }
  });
  const deleteMutation = trpc.blog.ratings.delete.useMutation({
    onSuccess: () => {
      toast.success("Rating deleted");
      refetch();
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التقييمات" : "Ratings"}</h2>
        <p className="text-muted-foreground">{language === "ar" ? "لا توجد تقييمات." : "No ratings found."}</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التقييمات" : "Ratings"}</h2>
      
      <div className="space-y-4">
        {ratings.map((rating: any) => (
          <div key={rating.id} className="p-4 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
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
                <span className={`text-xs px-2 py-0.5 rounded ${
                  rating.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  rating.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {rating.status}
                </span>
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
              {rating.review && <p className="whitespace-pre-wrap text-sm">{rating.review}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              {rating.status !== 'approved' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => approveMutation.mutate({ id: rating.id })}
                  disabled={approveMutation.isPending}
                  title={language === "ar" ? "موافقة" : "Approve"}
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              {rating.status !== 'rejected' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => rejectMutation.mutate({ id: rating.id })}
                  disabled={rejectMutation.isPending}
                  title={language === "ar" ? "إخفاء" : "Hide/Reject"}
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this rating?")) {
                    deleteMutation.mutate({ id: rating.id });
                  }
                }}
                disabled={deleteMutation.isPending}
                title={language === "ar" ? "حذف" : "Delete"}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
