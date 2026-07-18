import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { CreditCard } from "lucide-react";

/**
 * TamaraSection Component
 * Design Philosophy: Modern, Clean, Professional
 * - Highlights the flexible payment option with Tamara
 * - Simple, clean design without features list
 */

export default function TamaraSection() {
  const { language } = useLanguage();
  const t = translations[language].tamara;
  const isArabic = language === "ar";

  return (
    <section className={`py-20 px-4 ${isArabic ? "text-right" : "text-left"}`} id="tamara">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 dark:bg-white/5 p-4 px-6 rounded-2xl border border-blue-500/20 shadow-xl backdrop-blur-sm flex items-center justify-center">
              <img src="/tamara.svg" alt="Tamara" className="h-10 md:h-12 w-auto object-contain" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-blue-600">{t.title}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Note */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          {t.note}
        </p>
      </div>
    </section>
  );
}
