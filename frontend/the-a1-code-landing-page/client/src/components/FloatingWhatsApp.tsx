import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * Floating WhatsApp Button
 * Design Philosophy: Animated floating button with screen movements
 * - Fixed position on screen
 * - Smooth animations and hover effects
 * - Full language support
 */

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <a
      href={`https://wa.me/${t.footer.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 group"
      title={language === "ar" ? "الدعم عبر واتساب" : "WhatsApp Support"}
    >
      {/* Animated Background Circles */}
      <div className="absolute inset-0 w-16 h-16 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 w-14 h-14 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-30 animate-pulse animation-delay-100"></div>

      {/* Main Button */}
      <div className="relative w-16 h-16 bg-[#25D366] hover:bg-[#1FA855] rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95">
        <MessageCircle className="w-8 h-8 text-white animate-bounce" />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-20 right-0 bg-[#222222] dark:bg-white text-white dark:text-[#222222] px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
        {language === "ar" ? "تحدث معنا" : "Chat with us"}
      </div>
    </a>
  );
}
