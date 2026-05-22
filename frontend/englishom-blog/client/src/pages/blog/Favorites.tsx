import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function Favorites() {
  const { language } = useLocalization();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("englishom-favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const handleRemove = (postId: number) => {
    const updated = favorites.filter((fav) => fav.postId !== postId);
    setFavorites(updated);
    localStorage.setItem("englishom-favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">
          {language === "ar" ? "مفضلاتي" : "My Favorites"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === "ar"
            ? `لديك ${favorites.length} مقالة مفضلة`
            : `You have ${favorites.length} favorite articles`}
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">
              {language === "ar"
                ? "لم تضف أي مقالات إلى المفضلة بعد"
                : "You haven't added any articles to favorites yet"}
            </p>
            <Button
              onClick={() => (window.location.href = "/blog")}
              style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
            >
              {language === "ar" ? "استكشف المقالات" : "Explore Articles"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <Card
                key={fav.postId}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4 line-clamp-2">
                    {fav.title}
                  </h3>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => (window.location.href = `/blog/${fav.slug}`)}
                      style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                      className="flex-1"
                    >
                      {language === "ar" ? "اقرأ المقالة" : "Read Article"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(fav.postId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
