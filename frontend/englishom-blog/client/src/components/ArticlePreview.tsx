import { useLocalization } from "@/contexts/LocalizationContext";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { Streamdown } from "streamdown";

interface ArticlePreviewProps {
  titleEn?: string;
  titleAr?: string;
  contentEn?: string;
  contentAr?: string;
  excerptEn?: string;
  excerptAr?: string;
  featuredImageUrl?: string;
  categoryName?: string;
  authorName?: string;
  publishedAt?: Date;
}

export default function ArticlePreview({
  titleEn = "Article Title",
  titleAr = "عنوان المقالة",
  contentEn = "Article content will appear here...",
  contentAr = "محتوى المقالة سيظهر هنا...",
  excerptEn = "Article excerpt...",
  excerptAr = "ملخص المقالة...",
  featuredImageUrl,
  categoryName = "Category",
  authorName = "Author",
  publishedAt = new Date(),
}: ArticlePreviewProps) {
  const { language } = useLocalization();

  const title = language === "ar" ? titleAr : titleEn;
  const content = language === "ar" ? contentAr : contentEn;
  const excerpt = language === "ar" ? excerptAr : excerptEn;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card border border-border rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: ENGLISHOM_COLORS.primary }}>
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">
          {language === "ar" ? "معاينة حية" : "Live Preview"}
        </p>
      </div>

      {/* Featured Image */}
      {featuredImageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={featuredImageUrl}
            alt={title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-2" style={{ color: ENGLISHOM_COLORS.primary }}>
          {categoryName}
        </span>
        <span>•</span>
        <span>{publishedAt.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
      </div>

      {/* Excerpt */}
      {excerpt && (
        <div className="mb-6 p-4 bg-muted rounded-lg border-l-4" style={{ borderColor: ENGLISHOM_COLORS.primary }}>
          <p className="italic text-muted-foreground">{excerpt}</p>
        </div>
      )}

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none">
        <Streamdown>{content}</Streamdown>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        {language === "ar" ? "هذه معاينة حية للمقالة" : "This is a live preview of the article"}
      </div>
    </div>
  );
}
