import { useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, User, Calendar, Eye } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import ArticleContentRenderer from "@/components/ArticleContentRenderer";
import RelatedArticles from "@/components/RelatedArticles";
import ShareAndFavorite from "@/components/ShareAndFavorite";
import StarRating from "@/components/StarRating";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLocalization();
  const isAr = language === "ar";

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

  const title = isAr ? post.titleAr : post.titleEn;
  const content = isAr ? post.contentAr : post.contentEn;
  const excerpt = isAr ? post.excerptAr : post.excerptEn;

  // Author display name logic
  const authorName = isAr
    ? (post.customAuthorNameAr || post.author?.name || "فريق EnglishOM")
    : (post.customAuthorNameEn || post.author?.name || "EnglishOM Team");

  // Date display logic
  const dateDisplay = () => {
    if (post.dateDisplayType === "hidden" || post.showDate === false) return null;
    
    const dateObj = new Date(
      post.dateDisplayType === "updated" ? (post.updatedAt || post.createdAt) : (post.publishedAt || post.createdAt)
    );
    const dateStr = dateObj.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (post.dateDisplayType === "updated") {
      return `${isAr ? "آخر تحديث:" : "Last updated:"} ${dateStr}`;
    }
    return dateStr;
  };

  const formattedDate = dateDisplay();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
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

      {/* Main Article Section */}
      <article className="py-8 px-4 md:py-12 md:px-6 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden h-auto md:h-96 shadow-lg bg-black/5 dark:bg-black/25 flex items-center justify-center">
              <img
                src={post.featuredImageUrl}
                alt={title}
                className="w-full h-auto max-h-[300px] md:max-h-none md:h-full object-contain md:object-cover"
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
                  {isAr ? post.category.nameAr : post.category.nameEn}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {post.readingTimeMinutes} {t("blog.readingTime", language)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>

            {excerpt && (
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{excerpt}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-y border-border py-3">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <User size={16} className="text-primary" />
                {authorName}
              </span>

              {formattedDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {formattedDate}
                  </span>
                </>
              )}

              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Eye size={15} />
                {post.viewsCount} {isAr ? "مشاهدة" : "views"}
              </span>
            </div>
          </div>

          {/* Article Body */}
          <ArticleContentRenderer content={content} className="mb-6" />

          {/* Blog Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-500 mb-8 leading-relaxed">
            {isAr ? (
              <p>
                <strong>إخلاء مسؤولية:</strong> المحتوى المنشور في هذه المدونة مخصص لأغراض تعليمية وتثقيفية عامة، ويعتمد على أبحاث ومعلومات موثوقة. المسميات التحريرية لا تشكل استشارات رسمية أو مرخصة.
              </p>
            ) : (
              <p>
                <strong>Disclaimer:</strong> The content on this blog is for general educational and informational purposes only. Editorial titles do not constitute formal or licensed professional advice.
              </p>
            )}
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
