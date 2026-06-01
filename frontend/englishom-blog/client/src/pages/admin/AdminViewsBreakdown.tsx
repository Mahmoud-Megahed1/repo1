import { useState } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminViewsBreakdown({ children }: { children: React.ReactNode }) {
  const { language } = useLocalization();
  const [open, setOpen] = useState(false);
  
  const { data: views, isLoading, refetch } = trpc.blog.analytics.getViewsBreakdown.useQuery(undefined, {
    enabled: open,
  });

  const utils = trpc.useUtils();

  const resetAllMutation = trpc.blog.analytics.resetAllViews.useMutation({
    onSuccess: () => {
      toast.success("All views have been reset.");
      refetch();
      utils.blog.analytics.getDashboardStats.invalidate();
    }
  });

  const resetPostMutation = trpc.blog.analytics.resetPostViews.useMutation({
    onSuccess: () => {
      toast.success("Post views have been reset.");
      refetch();
      utils.blog.analytics.getDashboardStats.invalidate();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center text-2xl font-bold">
            {language === "ar" ? "تفاصيل المشاهدات" : "Views Breakdown"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {language === "ar" ? "إجمالي المشاهدات مقسمة لكل مقال." : "Total views broken down per article."}
            </p>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm(language === "ar" ? "هل أنت متأكد من تصفير كل المشاهدات؟" : "Are you sure you want to reset all views?")) {
                  resetAllMutation.mutate();
                }
              }}
              disabled={resetAllMutation.isPending}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === "ar" ? "تصفير كل المشاهدات" : "Reset All Views"}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
          ) : !views || views.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No data available.</p>
          ) : (
            <div className="space-y-4">
              {views.map((post) => (
                <div key={post.id} className="p-4 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{language === "ar" ? post.titleAr || post.titleEn : post.titleEn || post.titleAr}</h3>
                    <p className="text-sm text-muted-foreground">Post ID: {post.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary bg-primary/10 px-4 py-1 rounded-full">
                      {post.viewsCount}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm(language === "ar" ? "تصفير المشاهدات لهذا المقال؟" : "Reset views for this post?")) {
                          resetPostMutation.mutate({ postId: post.id });
                        }
                      }}
                      disabled={resetPostMutation.isPending}
                      title={language === "ar" ? "تصفير المشاهدات" : "Reset Views"}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
