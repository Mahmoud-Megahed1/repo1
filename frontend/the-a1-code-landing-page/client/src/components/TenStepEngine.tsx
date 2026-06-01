import { Check, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * 10-Step Engine Section
 * Design Philosophy: Grid-based layout with numbered steps
 * - 2x5 grid layout with compact cards
 * - Clear numbering and minimal spacing
 * - Full language support
 */

export default function TenStepEngine() {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <section id="engine" className="py-20 bg-[#F8F9FA] dark:bg-[#1a1a1a] transition-colors duration-300">
      <div className="container">
        {/* Section Header */}
        <div className={`text-center mb-16 space-y-4`}>
          <h2 className="text-5xl font-bold text-[#222222] dark:text-white">
            {t.engine.title}
            <br />
            <span className="text-[#1F6BF6] dark:text-[#F5BB41]">{t.engine.titleEn}</span>
          </h2>
          <p className="text-xl text-[#666666] dark:text-[#CCCCCC] max-w-2xl mx-auto">
            {t.engine.subtitle}
          </p>
        </div>

        {/* Grid Layout - 2x5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 mx-auto">
          {t.engine.steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#0f0f0f] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-[#F5BB41] flex flex-col h-full"
            >
              {/* Number Circle */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1F6BF6] to-[#3D84F3] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3">{step.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1F6BF6] dark:text-[#F5BB41] mb-2 line-clamp-2 text-center">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#666666] dark:text-[#CCCCCC] leading-snug flex-grow text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className={`mt-12 space-y-4 ${isRTL ? "text-right" : ""}`}>
          <div className="bg-[#E8F4F8] dark:bg-[#1F3A4A] rounded-lg p-6 border-l-4 border-[#1F6BF6]">
            <p className="text-[#1F6BF6] dark:text-[#F5BB41] font-bold">
              <Check className="w-5 h-5 inline-block mr-1" /> {t.engine.note}
            </p>
          </div>
          <div className="bg-[#FFF4E6] dark:bg-[#3A2F1F] rounded-lg p-6 border-l-4 border-[#F5BB41]">
            <p className="text-[#F5BB41] font-bold">
              <AlertTriangle className="w-5 h-5 inline-block mr-1" /> {t.engine.noteWarning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
