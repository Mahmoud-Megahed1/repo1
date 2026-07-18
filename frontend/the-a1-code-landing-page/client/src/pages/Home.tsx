import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TenStepEngine from "@/components/TenStepEngine";
import OutcomesSection from "@/components/OutcomesSection";
import TamaraSection from "@/components/TamaraSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Home Page - The A1 Code Landing Page
 * Design Philosophy: Geometric Modernism
 * - Clean, professional layout with dynamic sections
 * - Cream gold (#F5BB41) and blue (#1F6BF6) color scheme
 * - Responsive design with smooth transitions
 * - Full language support (Arabic/English)
 * - Dark Mode support
 */

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.englishom.com/api/courses')
      .then(res => res.json())
      .then(data => {
        let courses = [];
        if (Array.isArray(data)) courses = data;
        else if (data && data.data) courses = data.data;
        const a1Course = courses.find((c: any) => c.level_name === 'LEVEL_A1');
        if (a1Course) setCourseData(a1Course);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors duration-300 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection courseData={courseData} />

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F8F9FA] dark:bg-[#1a1a1a] transition-colors duration-300">
        <div className="container">
          <div className={`text-center mb-16 space-y-4`}>
            <h2 className="text-5xl font-bold text-[#222222] dark:text-white">
              {t.whyChoose.title}
              <br />
              <span className="text-[#1F6BF6] dark:text-[#F5BB41]">{t.whyChoose.titleHighlight}</span>
            </h2>
            <p className="text-xl text-[#666666] dark:text-[#CCCCCC] max-w-2xl mx-auto">
              {t.whyChoose.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {t.whyChoose.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0f0f0f] rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-[#F5BB41]"
              >
                <div className="text-5xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#222222] dark:text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-[#666666] dark:text-[#CCCCCC] leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10-Step Engine Section */}
      <TenStepEngine />

      {/* Outcomes Section */}
      <OutcomesSection courseData={courseData} />

      {/* Tamara Section */}
      <TamaraSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-[#1F6BF6]/5 dark:from-[#1F6BF6]/10 to-[#F5BB41]/5 dark:to-[#F5BB41]/10 transition-colors duration-300">
        <div className="container">
          <div className={`text-center mb-16 space-y-4 ${isRTL ? "text-right" : ""}`}>
            <h2 className="text-5xl font-bold text-[#222222] dark:text-white">
              {t.testimonials.title}
              <br />
              <span className="text-[#1F6BF6] dark:text-[#F5BB41]">{t.testimonials.titleEn}</span>
            </h2>
            <p className="text-xl text-[#666666] dark:text-[#CCCCCC] max-w-2xl mx-auto">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#F5BB41]">
                      <Star className="w-5 h-5 fill-current" />
                    </span>
                  ))}
                </div>
                <p className="text-[#666666] dark:text-[#CCCCCC] mb-6 leading-relaxed italic">
                  "{testimonial.feedback}"
                </p>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-bold text-[#222222] dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-[#1F6BF6] dark:text-[#F5BB41]">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-[#1F6BF6] to-[#3D84F3] dark:from-[#1F6BF6]/90 dark:to-[#3D84F3]/90 transition-colors duration-300">
        <div className={`container text-center space-y-8 ${isRTL ? "text-right" : ""}`}>
          <h2 className="text-5xl font-bold text-white">
            {t.cta.title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t.cta.description.replace('60', courseData?.daysCount?.toString() || '60')}
          </p>
          <div className="space-y-4">
            <a
              href="https://englishom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#F5BB41] text-[#222222] font-bold py-4 px-12 rounded-lg hover:bg-[#F5BB41]/90 transition-all duration-300 transform hover:scale-105 text-lg shadow-lg"
            >
              {t.cta.button}
            </a>
            <p className="text-[#F5BB41] text-2xl md:text-3xl font-bold tracking-wide drop-shadow-[0_0_15px_rgba(245,187,65,0.8)] animate-pulse my-4">
              {language === 'ar' ? 'جرب الآن ليوم واحد' : 'Try now for 1 day'}
            </p>
            <p className="text-white/70 text-sm">
              {t.cta.note}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer courseData={courseData} />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </div>
  );
}
