import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";

import { Loader2, ArrowLeft } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { useAuth } from "@/_core/hooks/useAuth";
import { Streamdown } from "streamdown";
import RelatedArticles from "@/components/RelatedArticles";
import ShareAndFavorite from "@/components/ShareAndFavorite";
import StarRating from "@/components/StarRating";
import CommentsSection from "@/components/CommentsSection";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLocalization();
  const { user, isAuthenticated } = useAuth();
  // Fetch post
  const { data: post, isLoading: postLoading } = trpc.blog.posts.getBySlug.useQuery({
    slug: slug || "",
  });

  const incrementViewMutation = trpc.blog.posts.incrementView.useMutation();

  useEffect(() => {
    if (post?.id) {
      const viewKey = `viewed_post_${post.id}`;
      if (!localStorage.getItem(viewKey)) {
        incrementViewMutation.mutate({ id: post.id });
        localStorage.setItem(viewKey, "true");
      }
    }
  }, [post?.id]);

  // Fetch related posts
  const { data: relatedPosts } = trpc.blog.posts.related.useQuery(
    {
      postId: post?.id || 0,
      categoryId: post?.categoryId || 0,
      limit: 3,
    },
    { enabled: !!post?.id }
  );

  if (postLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">{t("common.error", language)}</h1>
        <Button onClick={() => window.location.href = "/blog"}>
          {t("blog.backToBlog", language)}
        </Button>
      </div>
    );
  }

  const title = language === "ar" ? post.titleAr : post.titleEn;
  const content = language === "ar" ? post.contentAr : post.contentEn;
  const excerpt = language === "ar" ? post.excerptAr : post.excerptEn;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border py-4 px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/blog"}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            {t("blog.backToBlog", language)}
          </Button>
          <ShareAndFavorite postId={post.id} title={title} slug={post.slug} />
        </div>
      </div>

      {/* Article Content */}
      <article className="py-8 px-4 md:py-12 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-blue-500 to-purple-600">
              <img
                src={post.featuredImageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {post.category && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: post.category.colorHex || ENGLISHOM_COLORS.primary }}
                >
                  {language === "ar" ? post.category.nameAr : post.category.nameEn}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {post.readingTimeMinutes} {t("blog.readingTime", language)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            {excerpt && (
              <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <>
                  <span>{post.author.name || "Unknown Author"}</span>
                  <span>•</span>
                </>
              )}
              <span>{new Date(post.publishedAt!).toLocaleDateString(language)}</span>
              <span>•</span>
              <span>{post.viewsCount} {language === "ar" ? "مشاهدة" : "views"}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            <Streamdown>{content}</Streamdown>
          </div>

          {/* Star Rating Section */}
          <div className="border-t border-border pt-8 mb-8">
            <StarRating postId={post.id} />
          </div>

          {/* Comments Section */}
          <CommentsSection postId={post.id} />
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-12 px-4 md:py-16 md:px-6 bg-slate-50 dark:bg-slate-900/50 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <RelatedArticles postId={post.id} categoryId={post.categoryId} />
        </div>
      </section>
    </div>
  );
}
