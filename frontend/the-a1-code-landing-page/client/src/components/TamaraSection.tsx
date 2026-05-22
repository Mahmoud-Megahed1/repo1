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
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4">
              <CreditCard className="w-8 h-8 text-white" />
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
