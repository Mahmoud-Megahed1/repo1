import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * Hero Section - The A1 Code
 * Design Philosophy: Geometric Modernism with dynamic visuals
 * - Large hero image with geometric overlay
 * - Key features highlighted with checkmarks
 * - Full language support with Dark Mode
 */

export default function HeroSection({ courseData }: { courseData?: any }) {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <section className="py-20 bg-white dark:bg-[#0f0f0f] overflow-hidden transition-colors duration-300">
      <div className="container">
        <div className={`flex flex-col items-center justify-center text-center ${isRTL ? "" : ""}`}>
          {/* Center Content */}
          <div className={`space-y-8 max-w-3xl ${isRTL ? "" : ""}`}>
            {/* Badge */}
            <div className="inline-block">
              <span className="bg-[#F5BB41]/20 dark:bg-[#F5BB41]/10 text-[#F5BB41] px-4 py-2 rounded-full text-sm font-semibold">
                ● {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-[#1F6BF6] dark:text-[#F5BB41]">
                {t.hero.title}
              </h1>
              <h2 className="text-4xl font-bold text-[#222222] dark:text-white">
                {t.hero.subtitle}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-[#666666] dark:text-[#CCCCCC] leading-relaxed">
              {t.hero.description.replace('60', courseData?.daysCount?.toString() || '60')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mx-auto max-w-2xl">
              {t.hero.features.map((feature, index) => {
                let value = feature.value;
                if (feature.label === "يوم" || feature.label === "Days") {
                  value = courseData?.daysCount?.toString() || feature.value;
                }
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-[#1a1a1a] p-4 rounded-lg transition-colors duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F5BB41] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#222222] stroke-[3]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#222222] dark:text-white">
                        {value}
                      </p>
                      <p className="text-xs text-[#666666] dark:text-[#CCCCCC]">
                        {feature.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://englishom.com/ar/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1F6BF6] dark:bg-[#F5BB41] text-white dark:text-[#222222] font-bold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t.hero.cta1}
                {isRTL ? (
                  <ArrowLeft className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </a>
              <a
                href="#pricing"
                className="border-2 border-[#F5BB41] text-[#F5BB41] dark:border-[#F5BB41] dark:text-[#F5BB41] font-bold py-3 px-8 rounded-lg hover:bg-[#F5BB41]/10 dark:hover:bg-[#F5BB41]/20 transition-all duration-300 flex items-center justify-center"
              >
                {t.hero.cta2}
              </a>
            </div>

            {/* Success Count */}
            <p className="text-sm text-[#666666] dark:text-[#CCCCCC] font-medium">
              <Sparkles className="w-4 h-4 inline-block mr-1" /> {t.hero.successCount}
            </p>
          </div>


        </div>
      </div>
    </section>
  );
}
