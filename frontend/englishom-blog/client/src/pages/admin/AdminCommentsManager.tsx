import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCommentsManager() {
  const { language } = useLocalization();
  
  const { data: comments, isLoading, refetch } = trpc.blog.comments.listPending.useQuery({ limit: 50 });
  const approveMutation = trpc.blog.comments.approve.useMutation({
    onSuccess: () => {
      toast.success("Comment approved");
      refetch();
    }
  });
  const rejectMutation = trpc.blog.comments.reject.useMutation({
    onSuccess: () => {
      toast.success("Comment rejected");
      refetch();
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (!comments || comments.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-6">{t("admin.pendingComments", language)}</h2>
        <p className="text-muted-foreground">No pending comments.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">{t("admin.pendingComments", language)}</h2>
      
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-4 border border-border rounded-lg flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{comment.user?.name || "Anonymous"}</span>
                {comment.user?.role === "admin" && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] uppercase font-bold rounded">
                    Admin
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  | Post ID: {comment.postId} | {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => approveMutation.mutate({ id: comment.id })}
                disabled={approveMutation.isPending}
              >
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => rejectMutation.mutate({ id: comment.id })}
                disabled={rejectMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
