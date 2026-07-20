import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle2, BookOpen, Headphones, PenTool, Eye, Keyboard } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [, navigate] = useLocation();
  const { language, t } = useLanguage();

  const features = [
    {
      icon: Eye,
      title: language === "ar" ? "المفردات" : "Vocabulary",
      description: language === "ar" ? "اختبر معرفتك بالكلمات والمفردات الأساسية" : "Test your vocabulary and word knowledge",
    },
    {
      icon: PenTool,
      title: language === "ar" ? "القواعد" : "Grammar",
      description: language === "ar" ? "اختبر فهمك لقواعد النحو والصيغ" : "Test your grammar and sentence structure",
    },
    {
      icon: BookOpen,
      title: language === "ar" ? "الفهم القرائي" : "Reading",
      description: language === "ar" ? "اختبر قدرتك على فهم النصوص المكتوبة" : "Test your reading comprehension skills",
    },
    {
      icon: Headphones,
      title: language === "ar" ? "الاستماع" : "Listening",
      description: language === "ar" ? "اختبر قدرتك على فهم النصوص المسموعة" : "Test your listening comprehension skills",
    },
    {
      icon: Keyboard,
      title: language === "ar" ? "الكتابة" : "Writing",
      description: language === "ar" ? "اختبر قدرتك على الكتابة والتعبير" : "Test your writing and expression skills",
    },
  ];

  const handleStartTest = () => {
    navigate("/test");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
              {language === "ar" ? "اكتشف مستواك" : "Discover Your Level"}
            </h1>
            <h2 className="text-xl md:text-3xl font-bold text-[#4A3B32] dark:text-[#FCDFC2]">
              {language === "ar" ? "اكتشف مستوى اللغة الإنجليزية لديك" : "Discover Your English Language Proficiency"}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "خذ اختبار تقييم شامل لتحديد مستوى كفاءتك في اللغة الإنجليزية وفقاً للإطار الأوروبي المرجعي (A1-C2). الاختبار مجاني تماماً بدون تسجيل."
                : "Take a comprehensive evaluation test to determine your English proficiency level according to the CEFR standard (A1-C2). The test is completely free without registration."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={handleStartTest}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-lg"
            >
              {t.home.startButton}
              <span className={language === "ar" ? "mr-2" : "ml-2"}>→</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-card"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.home.learnMore}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{t.home.free}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{t.home.noRegistration}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{t.home.instantResults}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "ar" ? "خمس مراحل شاملة" : "Five Comprehensive Stages"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "ar" ? "يغطي اختبارنا جميع مهارات اللغة الإنجليزية الأساسية بصعوبة متزايدة" : "Our test covers all essential English skills with progressive difficulty"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-card border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-h-64 h-full"
                >
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "ar" ? "كيفية العمل" : "How It Works"}
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-foreground">
                      {language === "ar" ? "أجب عن الأسئلة" : "Take the Test"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {language === "ar" 
                        ? "أكمل جميع 5 مراحل من التقييم. تختبر كل مرحلة مهارة مختلفة بصعوبة متزايدة. بدون ضغط وقت - أجب بسرعتك الخاصة."
                        : "Complete all 5 stages of the assessment. Each stage tests a different skill with increasing difficulty. No time pressure - answer at your own pace."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-foreground">
                      {language === "ar" ? "احصل على النتائج الفورية" : "Get Instant Results"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {language === "ar"
                        ? "احصل على مستوى CEFR الخاص بك (A1-C2) فوراً بعد إكمال الاختبار. شاهد تفصيل درجاتك حسب المهارة."
                        : "Receive your CEFR level (A1-C2) immediately after completing the test. See your detailed score breakdown by skill."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-foreground">
                      {language === "ar" ? "احصل على التوصيات الشخصية" : "Get Personalized Recommendations"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {language === "ar"
                        ? "احصل على اقتراحات مخصصة للتحسن بناءً على نقاط قوتك وضعفك. افهم بالضبط ما يجب التركيز عليه بعد ذلك."
                        : "Receive tailored suggestions for improvement based on your strengths and weaknesses. Understand exactly what to focus on next."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing / Packages Section CTA */}
      <section className="container py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "ar" ? "هل تبحث عن خطة تعلم متكاملة؟" : "Looking for a complete learning plan?"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {language === "ar"
                ? "بعد تحديد مستواك، يمكنك الانضمام إلى إحدى باقاتنا المميزة للبدء في رحلة إتقان اللغة الإنجليزية مع مدرسين خبراء."
                : "After finding your level, join one of our premium packages to start mastering English with expert tutors."}
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = `https://englishom.com/${language === "ar" ? "ar" : "en"}/#courses`}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg hover:shadow-green-500/25 transition-all"
            >
              {language === "ar" ? "استكشف الباقات والأسعار" : "Explore Pricing & Packages"}
              <span className={language === "ar" ? "mr-2" : "ml-2"}>🚀</span>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            {language === "ar" ? "هل أنت مستعد لاختبار اللغة الإنجليزية لديك؟" : "Ready to Test Your English?"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "ar"
              ? "انضم إلى آلاف المتعلمين الذين اكتشفوا مستوى اللغة الإنجليزية لديهم مع Englishom"
              : "Join thousands of learners who have discovered their English level with Englishom"}
          </p>
          <Button
            size="lg"
            onClick={handleStartTest}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-lg"
          >
            {language === "ar" ? "ابدأ التقييم المجاني" : "Start Free Assessment"}
            <span className={language === "ar" ? "mr-2" : "ml-2"}>→</span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
