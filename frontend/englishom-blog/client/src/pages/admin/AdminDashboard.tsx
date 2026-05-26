import { useState } from "react";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import AdminPostsManager from "./AdminPostsManager";
import AdminCategoriesManager from "./AdminCategoriesManager";
import AdminCommentsManager from "./AdminCommentsManager";
import AdminRatingsManager from "./AdminRatingsManager";

export default function AdminDashboard() {
  const { language } = useLocalization();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">{t("common.error", language)}</h1>
        <p className="text-muted-foreground mb-6">Access denied</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = "/blog"} variant="outline">
            {t("blog.backToBlog", language)}
          </Button>
          <Button onClick={() => window.location.href = "/blog/admin/login"} className="bg-accent text-accent-foreground">
            تسجيل دخول المشرفين
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.dashboard", language)}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{t("admin.dashboard", language)}</TabsTrigger>
            <TabsTrigger value="posts">{t("admin.posts", language)}</TabsTrigger>
            <TabsTrigger value="categories">{t("admin.categories", language)}</TabsTrigger>
            <TabsTrigger value="comments">{t("admin.comments", language)}</TabsTrigger>
            <TabsTrigger value="ratings">{language === "ar" ? "التقييمات" : "Ratings"}</TabsTrigger>
            <TabsTrigger value="analytics">{t("admin.analytics", language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Posts</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Comments</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Views</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Pending Comments</p>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-8">
            <AdminPostsManager />
          </TabsContent>

          <TabsContent value="categories" className="mt-8">
            <AdminCategoriesManager />
          </TabsContent>

          <TabsContent value="comments" className="mt-8">
            <AdminCommentsManager />
          </TabsContent>

          <TabsContent value="ratings" className="mt-8">
            <AdminRatingsManager />
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-bold mb-6">{t("admin.analytics", language)}</h2>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
