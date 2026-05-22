import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Share2, Heart, Facebook, Twitter, Linkedin, MessageCircle, Copy } from "lucide-react";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { toast } from "sonner";

interface ShareAndFavoriteProps {
  postId: number;
  title: string;
  slug: string;
}

export default function ShareAndFavorite({ postId, title, slug }: ShareAndFavoriteProps) {
  const { language } = useLocalization();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const postUrl = `${window.location.origin}/blog/${slug}`;

  // Initialize favorite state from localStorage on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("englishom-favorites") || "[]");
    const isFav = favorites.some((fav: any) => fav.postId === postId);
    setIsFavorited(isFav);
  }, [postId]);

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
      setShowShareMenu(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success(language === "ar" ? "تم نسخ الرابط" : "Link copied to clipboard");
    setShowShareMenu(false);
  };

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("englishom-favorites") || "[]");
    
    if (isFavorited) {
      // Remove from favorites
      const updated = favorites.filter((fav: any) => fav.postId !== postId);
      localStorage.setItem("englishom-favorites", JSON.stringify(updated));
      setIsFavorited(false);
      toast.success(language === "ar" ? "تم الحذف من المفضلة" : "Removed from favorites");
    } else {
      // Add to favorites
      favorites.push({ postId, title, slug, addedAt: new Date().toISOString() });
      localStorage.setItem("englishom-favorites", JSON.stringify(favorites));
      setIsFavorited(true);
      toast.success(language === "ar" ? "تم الإضافة إلى المفضلة" : "Added to favorites");
    }
  };

  return (
    <div className="flex gap-3 items-center relative">
      {/* Share Button with Menu */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2"
          style={{ borderColor: ENGLISHOM_COLORS.primary, color: ENGLISHOM_COLORS.primary }}
        >
          <Share2 size={18} />
          <span className="hidden sm:inline">
            {language === "ar" ? "مشاركة" : "Share"}
          </span>
        </Button>

        {/* Share Menu */}
        {showShareMenu && (
          <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-lg shadow-lg p-2 z-50 min-w-max">
            <button
              onClick={() => shareToSocial("facebook")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <Facebook size={16} className="text-blue-600" />
              Facebook
            </button>
            <button
              onClick={() => shareToSocial("twitter")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <Twitter size={16} className="text-blue-400" />
              Twitter
            </button>
            <button
              onClick={() => shareToSocial("linkedin")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <Linkedin size={16} className="text-blue-700" />
              LinkedIn
            </button>
            <button
              onClick={() => shareToSocial("whatsapp")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <MessageCircle size={16} className="text-green-600" />
              WhatsApp
            </button>
            <button
              onClick={() => shareToSocial("telegram")}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <MessageCircle size={16} className="text-blue-500" />
              Telegram
            </button>
            <div className="border-t border-border my-1" />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted rounded text-sm"
            >
              <Copy size={16} />
              {language === "ar" ? "نسخ الرابط" : "Copy Link"}
            </button>
          </div>
        )}
      </div>

      {/* Favorite Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFavorite}
        className="flex items-center gap-2"
        style={{
          borderColor: isFavorited ? ENGLISHOM_COLORS.success : ENGLISHOM_COLORS.primary,
          color: isFavorited ? ENGLISHOM_COLORS.success : ENGLISHOM_COLORS.primary,
          backgroundColor: isFavorited ? `${ENGLISHOM_COLORS.success}15` : "transparent",
        }}
      >
        <Heart size={18} fill={isFavorited ? ENGLISHOM_COLORS.success : "none"} />
        <span className="hidden sm:inline">
          {language === "ar" ? (isFavorited ? "مفضل" : "إضافة") : isFavorited ? "Favorited" : "Favorite"}
        </span>
      </Button>
    </div>
  );
}
