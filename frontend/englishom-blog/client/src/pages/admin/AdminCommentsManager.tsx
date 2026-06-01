import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Trash2, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminCommentsManager() {
  const { language } = useLocalization();
  
  const { data: comments, isLoading, refetch } = trpc.blog.comments.listAdmin.useQuery({ limit: 100 });
  const approveMutation = trpc.blog.comments.approve.useMutation({
    onSuccess: () => {
      toast.success("Comment approved");
      refetch();
    }
  });
  const rejectMutation = trpc.blog.comments.reject.useMutation({
    onSuccess: () => {
      toast.success("Comment hidden/rejected");
      refetch();
    }
  });
  const deleteMutation = trpc.blog.comments.delete.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      refetch();
    }
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  if (!comments || comments.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التعليقات" : "Comments"}</h2>
        <p className="text-muted-foreground">No comments found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-2xl font-bold mb-6">{language === "ar" ? "التعليقات" : "Comments"}</h2>
      
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-4 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-semibold">{comment.user?.name || "Anonymous"}</span>
                {comment.user?.email && (
                  <a href={`mailto:${comment.user.email}`} className="text-xs text-blue-600 hover:underline">
                    {comment.user.email}
                  </a>
                )}
                {comment.user?.role === "admin" && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] uppercase font-bold rounded">
                    Admin
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded ${
                  comment.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  comment.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {comment.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  | Post ID: {comment.postId} | {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {comment.status !== 'approved' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => approveMutation.mutate({ id: comment.id })}
                  disabled={approveMutation.isPending}
                  title="Approve"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              {comment.status !== 'rejected' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => rejectMutation.mutate({ id: comment.id })}
                  disabled={rejectMutation.isPending}
                  title="Hide/Reject"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this comment?")) {
                    deleteMutation.mutate({ id: comment.id });
                  }
                }}
                disabled={deleteMutation.isPending}
                title="Delete"
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
