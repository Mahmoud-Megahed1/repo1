import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

interface RelatedArticlesProps {
  postId: number;
  categoryId: number;
}

export default function RelatedArticles({ postId, categoryId }: RelatedArticlesProps) {
  const { language } = useLocalization();

  // Fetch related posts
  const { data: relatedPosts = [], isLoading } = trpc.blog.posts.related.useQuery({
    postId,
    categoryId,
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold mb-6">
        {language === "ar" ? "مقالات ذات صلة" : "Related Articles"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post: any) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = `/blog/${post.slug}`)}
          >
            {post.featuredImageUrl && (
              <div className="w-full h-40 bg-muted overflow-hidden">
                <img
                  src={post.featuredImageUrl}
                  alt={language === "ar" ? post.titleAr : post.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              {/* Category Badge */}
              <div className="mb-3">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                >
                  {post.category?.nameEn}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-semibold line-clamp-2 mb-2">
                {language === "ar" ? post.titleAr : post.titleEn}
              </h4>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {language === "ar" ? post.excerptAr : post.excerptEn}
              </p>

              {/* Meta Info */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  {Math.ceil((post.contentEn || post.contentAr || "").split(" ").length / 200)} min read
                </span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
