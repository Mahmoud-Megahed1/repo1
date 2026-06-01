import { Check, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * Outcomes Section - مخرجات النظام
 * Design Philosophy: Geometric Modernism with emphasis on achievements
 * - Card-based layout with geometric accents
 * - Cream gold highlights with blue text
 * - Full language support
 */

export default function OutcomesSection() {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <section id="outcomes" className="py-20 bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="container">
        {/* Section Header */}
        <div className={`text-center mb-16 space-y-4`}>
          <h2 className="text-5xl font-bold text-[#222222] dark:text-white">
            {t.outcomes.title}
            <br />
            <span className="text-[#1F6BF6] dark:text-[#F5BB41]">{t.outcomes.titleEn}</span>
          </h2>
          <p className="text-xl text-[#666666] dark:text-[#CCCCCC] max-w-2xl mx-auto">
            {t.outcomes.subtitle}
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {t.outcomes.items.map((outcome, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${outcome.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative p-8 space-y-4 text-center">
                {/* Icon */}
                <div className="text-5xl">{outcome.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#222222] dark:text-white">
                  {outcome.title}
                </h3>

                {/* Description */}
                <p className="text-[#666666] dark:text-[#CCCCCC] leading-relaxed">
                  {outcome.description}
                </p>

                {/* Check mark */}
                <div className="flex items-center gap-2 pt-4">
                  <CheckCircle2 className="w-5 h-5 text-[#F5BB41]" />
                  <span className="text-sm font-semibold text-[#1F6BF6] dark:text-[#F5BB41]">
                    {outcome.guarantee}
                  </span>
                </div>
              </div>

              {/* Border accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${outcome.color}`}
              ></div>
            </div>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="mt-20 bg-gradient-to-r from-[#1F6BF6]/5 dark:from-[#1F6BF6]/10 to-[#F5BB41]/5 dark:to-[#F5BB41]/10 rounded-2xl p-12 border border-[#1F6BF6]/20 dark:border-[#F5BB41]/20 transition-colors duration-300 max-w-4xl mx-auto">
          <div className={`grid grid-cols-1 gap-12 text-center`}>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[#222222] dark:text-white">
                {t.outcomes.whyChooseTitle}
              </h3>
              <p className="text-lg text-[#666666] dark:text-[#CCCCCC] leading-relaxed">
                {t.outcomes.whyChooseDesc}
              </p>
            </div>

            <div className="space-y-4">
              {t.outcomes.whyChoosePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F5BB41] flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5 text-[#222222] stroke-[3]" />
                  </div>
                  <p className="text-[#666666] dark:text-[#CCCCCC] font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-6">
          <p className="text-2xl font-bold text-[#222222] dark:text-white">
            {t.outcomes.cta}
          </p>
          <div className="space-y-4">
            <a
              href="https://englishom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-[#1F6BF6] to-[#3D84F3] text-white font-bold py-4 px-12 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {t.outcomes.button}
            </a>
            <p className="text-3xl font-bold animate-pulse-glow text-[#F5BB41] dark:text-[#F5BB41]">
              {t.cta.price}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
