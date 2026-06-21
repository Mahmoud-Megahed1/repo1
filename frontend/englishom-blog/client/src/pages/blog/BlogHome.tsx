import { useState } from "react";
import Header from "@/components/Header";
import { trpc } from "@/lib/trpc";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function BlogHome() {
  const { language } = useLocalization();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTag, setSelectedTag] = useState<number | undefined>();
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // Fetch categories
  const { data: categories } = trpc.blog.categories.list.useQuery();

  // Fetch tags
  const { data: tags } = trpc.blog.tags.list.useQuery();

  // Fetch posts
  const { data: postsData, isLoading } = trpc.blog.posts.list.useQuery({
    limit,
    offset,
    categoryId: selectedCategory,
    search: search || undefined,
  });

  // Fetch posts by tag if selected
  const { data: tagPostsData } = trpc.blog.tags.getPostsByTag.useQuery(
    { tagId: selectedTag!, limit: 100, offset: 0 },
    { enabled: !!selectedTag }
  );

  // Fetch featured posts
  const { data: featuredPosts } = trpc.blog.posts.featured.useQuery({ limit: 6 });

  const posts = selectedTag ? (tagPostsData || []) : (postsData?.posts || []);
  const total = selectedTag ? (tagPostsData?.length || 0) : (postsData?.total || 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId);
    setSelectedTag(undefined);
    setOffset(0);
  };

  const handleTagChange = (tagId: number | undefined) => {
    setSelectedTag(tagId);
    setSelectedCategory(undefined);
    setOffset(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="py-16 px-4 md:py-24 md:px-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("blog.title", language)}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            {t("blog.subtitle", language)}
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t("blog.description", language)}
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-12 px-4 md:py-16 md:px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              {t("blog.featured", language)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    window.location.href = `/blog/${post.slug}`;
                  }}
                >
                  {post.featuredImageUrl && (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                      <img
                        src={post.featuredImageUrl}
                        alt={language === "ar" ? post.titleAr : post.titleEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                      >
                        {t("blog.featured", language)}
                      </span>
                    </div>
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
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8 px-4 md:py-12 md:px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder={t("nav.search", language)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-10 py-2 ${language === "ar" ? "text-right" : ""}`}
              />
            </div>
          </form>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === undefined && selectedTag === undefined ? "default" : "outline"}
                onClick={() => handleCategoryChange(undefined)}
                size="sm"
              >
                {t("blog.viewAll", language)}
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.id)}
                  size="sm"
                  style={
                    selectedCategory === category.id
                      ? { backgroundColor: category.colorHex || ENGLISHOM_COLORS.primary }
                      : {}
                  }
                >
                  {language === "ar" ? category.nameAr : category.nameEn}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTag === tag.id ? "default" : "outline"}
                    onClick={() => handleTagChange(tag.id)}
                    size="sm"
                    style={
                      selectedTag === tag.id
                        ? { backgroundColor: ENGLISHOM_COLORS.success }
                        : {}
                    }
                  >
                    #{language === "ar" ? tag.nameAr : tag.nameEn}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
                      <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
                        <img
                          src={post.featuredImageUrl}
                          alt={language === "ar" ? post.titleAr : post.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                        >
                          {language === "ar" ? "هندسة العادات اللغوية" : "Linguistic Habits Engineering"}
                        </span>
                      </div>
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

              {/* Pagination */}
              {total > limit && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setOffset(offset + limit)}
                    disabled={offset + limit >= total}
                  >
                    Next
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
