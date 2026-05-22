import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function BlogCategory() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLocalization();
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // Fetch category
  const { data: category } = trpc.blog.categories.getBySlug.useQuery({
    slug: slug || "",
  });

  // Fetch posts in category
  const { data: postsData, isLoading } = trpc.blog.posts.list.useQuery(
    {
      limit,
      offset,
      categoryId: category?.id,
    },
    { enabled: !!category?.id }
  );

  const posts = postsData?.posts || [];
  const total = postsData?.total || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border py-4 px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/blog"}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={18} />
            {t("blog.backToBlog", language)}
          </Button>
        </div>
      </div>

      {/* Category Header */}
      {category && (
        <section className="py-12 px-4 md:py-16 md:px-6 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              {category.iconUrl && (
                <img src={category.iconUrl} alt={language === "ar" ? category.nameAr : category.nameEn} className="w-12 h-12" />
              )}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: category.colorHex || ENGLISHOM_COLORS.primary }}
              >
                {(language === "ar" ? category.nameAr : category.nameEn).charAt(0)}
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {language === "ar" ? category.nameAr : category.nameEn}
            </h1>
            {category.descriptionEn && (
              <p className="text-lg text-muted-foreground">
                {language === "ar" ? category.descriptionAr : category.descriptionEn}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12 px-4 md:py-16 md:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">{t("blog.noArticles", language)}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      window.location.href = `/blog/${post.slug}`;
                    }}
                  >
                    {post.featuredImageUrl && (
                      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                        <img
                          src={post.featuredImageUrl}
                          alt={language === "ar" ? post.titleAr : post.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        {language === "ar" ? post.titleAr : post.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {language === "ar" ? post.excerptAr : post.excerptEn}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.readingTimeMinutes} {t("blog.readingTime", language)}</span>
                        <span>{new Date(post.publishedAt!).toLocaleDateString(language)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {offset + limit < total && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setOffset(offset + limit)}
                    variant="outline"
                    size="lg"
                  >
                    {t("blog.loadMore", language)}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
