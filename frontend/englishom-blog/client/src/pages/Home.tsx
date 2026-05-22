import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/contexts/LocalizationContext";
import { t } from "@/i18n/translations";
import { ENGLISHOM_COLORS } from "@/constants/colors";
import { ArrowRight, Calendar, MessageCircle, Award } from "lucide-react";

export default function Home() {
  const { language } = useLocalization();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 md:py-32 md:px-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {language === "ar" ? "تعلم الإنجليزية بطريقة حقيقية" : "Learn English the Real Way"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {language === "ar"
                ? "من خلال الاستماع والتحدث والممارسة اليومية"
                : "Through listening, speaking, and daily practice"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
                onClick={() => (window.location.href = "/blog")}
                className="text-white"
              >
                {t("nav.blog", language)}
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "/blog")}
              >
                {t("nav.startLearning", language)}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 md:py-24 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {language === "ar" ? "لماذا EnglishOM؟" : "Why EnglishOM?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  titleEn: "Daily Practice",
                  titleAr: "ممارسة يومية",
                  descEn: "Build consistent English habits through daily lessons and exercises",
                  descAr: "بناء عادات إنجليزية ثابتة من خلال دروس وتمارين يومية",
                  color: ENGLISHOM_COLORS.primary,
                  icon: Calendar,
                },
                {
                  titleEn: "Real Conversations",
                  titleAr: "محادثات حقيقية",
                  descEn: "Learn English used in real-world situations and conversations",
                  descAr: "تعلم الإنجليزية المستخدمة في المواقف والمحادثات الحقيقية",
                  color: ENGLISHOM_COLORS.success,
                  icon: MessageCircle,
                },
                {
                  titleEn: "Expert Guidance",
                  titleAr: "توجيه خبراء",
                  descEn: "Get guidance from experienced English learning professionals",
                  descAr: "احصل على توجيه من متخصصي تعليم اللغة الإنجليزية ذوي الخبرة",
                  color: ENGLISHOM_COLORS.accent,
                  icon: Award,
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {language === "ar" ? feature.titleAr : feature.titleEn}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "ar" ? feature.descAr : feature.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:py-24 md:px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === "ar" ? "ابدأ رحلتك اليوم" : "Start Your Journey Today"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === "ar"
                ? "انضم إلى آلاف الطلاب الذين يتعلمون الإنجليزية مع EnglishOM"
                : "Join thousands of students learning English with EnglishOM"}
            </p>
            <Button
              size="lg"
              style={{ backgroundColor: ENGLISHOM_COLORS.primary }}
              onClick={() => (window.location.href = "/blog")}
              className="text-white"
            >
              {t("nav.startLearning", language)}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            © 2026 EnglishOM. {language === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </p>
        </div>
      </footer>
    </div>
  );
}
