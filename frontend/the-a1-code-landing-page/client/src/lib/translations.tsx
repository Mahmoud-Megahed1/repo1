import { GraduationCap, Mic, BarChart, Lock, Star, Trophy, Headphones, Map, RefreshCw, Edit3, MessageCircle, Shield, Brain, Key, BookOpen, Dumbbell } from "lucide-react";

/**
 * Translations - The A1 Code
 * محتوى متعدد اللغات (العربية والإنجليزية)
 * فصل كامل بين اللغتين - بدون خلط
 */

export const translations = {
  ar: {
    // Navigation
    nav: {
      features: "المزايا",
      engine: "المحرك",
      outcomes: "النتائج",
      pricing: "التسعير",
      start: "ابدأ الآن",
    },

    // Hero Section
    hero: {
      badge: "منظومة تقنية متطورة",
      title: "شفرة الذكاء",
      subtitle: "شفرتك الخاصة",
      description: "اختراق حاجز اللغة في 50 يوماً فقط. نظام لغوي مصمم لبناء لغتك من الصفر وحتى الإتقان.",
      features: [
        { label: "كلمة", value: "1000" },
        { label: "يوم", value: "50" },
        { label: "تحدث يومياً", value: "مع نظام ذكي" },
        { label: "أساس فولاذي", value: "للمسارات المتقدمة" },
      ],
      cta1: "ابدأ رحلتك الآن",
      cta2: "تعرف على المزيد",
      successCount: "انضم إلى آلاف الممارسين الناجحين",
    },

    // Why Choose Section
    whyChoose: {
      title: "لماذا تختار",
      titleHighlight: "شفرة الذكاء؟",
      subtitle: "كل شيء تحتاجه لإتقان اللغة الإنجليزية",
      features: [
        {
          icon: <GraduationCap className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "نظام متقدم",
          description: "مصمم بناءً على أحدث الأبحاث اللغوية العالمية",
        },
        {
          icon: <Mic className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "تحدث يومياً",
          description: "نظام ذكي يحلل نطقك ولا يسمح بالتقدم إلا بدقة 75% فأعلى",
        },
        {
          icon: <BarChart className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "تتبع تقدمك",
          description: "رؤية واضحة لتطورك مع تحليلات مفصلة لكل مرحلة",
        },
        {
          icon: <Lock className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "انضباط ذاتي",
          description: "النظام لا يسمح بالتراخي أو القفز فوق الأساسيات",
        },
        {
          icon: <Star className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" fill="currentColor" />,
          title: "لمسة أصلية",
          description: "تعلم التعابير الأصلية والجمل الطبيعية لتبدو كمتحدث أصلي",
        },
        {
          icon: <Trophy className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "أساس فولاذي",
          description: "استعداد كامل للمسارات المتقدمة مع أساس قوي جداً",
        },
      ],
    },

    // 10-Step Engine
    engine: {
      title: "المحرك التشغيلي",
      titleEn: "عشر خطوات متقدمة",
      subtitle: "كل يوم هو عبارة عن دورة حياة لغوية كاملة تمر بـ 10 مراحل تقنية محترفة",
      note: "كل مرحلة مصممة بدقة لضمان تقدمك المستمر",
      noteWarning: "لا يمكنك تخطي أي مرحلة أو الانتقال للأمام إلا بإتقانك الكامل",
      steps: [
        {
          number: 1,
          icon: <Headphones className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "المشهد الصوتي",
          titleAr: "المشهد الصوتي",
          description: "الانغماس في قصة يومية واقعية لاستخراج 20 كلمة مفتاحية.",
        },
        {
          number: 2,
          icon: <Map className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "خارطة المفاهيم",
          titleAr: "خارطة المفاهيم",
          description: "شرح الكلمات بالصوت والصورة (فهم المعنى لا الترجمة).",
        },
        {
          number: 3,
          icon: <RefreshCw className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "حلقة التثبيت",
          titleAr: "حلقة التثبيت",
          description: "سماع الكلمات داخل جمل سياقية لضبط الأذن.",
        },
        {
          number: 4,
          icon: <Edit3 className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "بناء الهيكل",
          titleAr: "بناء الهيكل",
          description: "ممارسة الكتابة الدقيقة لسد الفراغات وترسيخ الإملاء.",
        },
        {
          number: 5,
          icon: <Mic className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "مختبر الصوت الذكي",
          titleAr: "مختبر الصوت الذكي",
          description: "نظام ذكي يحلل نطقك، ولن تفتح البوابة التالية إلا بدقة 75% فأعلى.",
        },
        {
          number: 6,
          icon: <MessageCircle className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "التدفق اليومي",
          titleAr: "التدفق اليومي",
          description: "6 جمل تعبيرية تجعلك تتحدث عن يومك فوراً وببساطة.",
        },
        {
          number: 7,
          icon: <Shield className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "أسئلة الدرع",
          titleAr: "أسئلة الدرع",
          description: "تزويدك بـ 7 نماذج (سؤال وجواب) جاهزة للاستخدام في المواقف الحقيقية.",
        },
        {
          number: 8,
          icon: <Brain className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "مركز المنطق",
          titleAr: "مركز المنطق",
          description: "شرح نحوي ذكي يوضح \"لماذا\" تُبنى الجملة بهذا الشكل.",
        },
        {
          number: 9,
          icon: <Star className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" fill="currentColor" />,
          title: "اللمسة الأصلية",
          titleAr: "اللمسة الأصلية",
          description: "ممارسة التعابير والجمل الطبيعية واحداً يومياً لتبدو كمتحدث أصلي.",
        },
        {
          number: 10,
          icon: <Key className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "نقطة العبور",
          titleAr: "نقطة العبور",
          description: "تقييم نهائي يقيس مدى استيعابك، وهو المفتاح الوحيد لفتح محتوى اليوم التالي.",
        },
      ],
    },

    // Outcomes
    outcomes: {
      title: "مخرجات النظام",
      titleEn: "النتائج المضمونة",
      subtitle: "عند إتمامك لهذه التجربة الرقمية، ستخرج بالنتائج التالية:",
      items: [
        {
          title: "بناء مخزون 1000 كلمة",
          description: "1000 كلمة من الأكثر استخداماً عالمياً، موزعة على 50 يوم ممارسة مكثفة.",
          icon: <BookOpen className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#F5BB41] to-[#FFC857]",
          guarantee: "مضمون 100%",
        },
        {
          title: "كسر حاجز الخوف",
          description: "من خلال التحدث اليومي الإلزامي مع النظام الذكي.",
          icon: <Dumbbell className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#1F6BF6] to-[#3D84F3]",
          guarantee: "مضمون 100%",
        },
        {
          title: "المرونة اللغوية",
          description: "10 أيام إضافية مخصصة للطوارئ والانقطاع لضمان المرونة والاستمرارية دون فقد النتائج.",
          icon: <RefreshCw className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#4CA853] to-[#66E066]",
          guarantee: "مضمون 100%",
        },
        {
          title: "الجاهزية التامة",
          description: "ستكون مؤهلاً تماماً للانتقال إلى المسار التالي وأنت تمتلك أساساً فولاذياً.",
          icon: <Trophy className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#FF9933] to-[#FFB366]",
          guarantee: "مضمون 100%",
        },
      ],
      whyChooseTitle: "لماذا هذه المنظومة تحديداً؟",
      whyChooseDesc: "لأن النجاح يبدأ من انضباطك الذاتي، نحن نوفر لك البيئة والأدوات التفاعلية المتكاملة في مكان واحد، والنظام يتكفل بتوجيه محاولاتك اليومية لضمان الثبات والارتقاء دون قفز على الأساسيات.",
      whyChoosePoints: [
        "أساس فولاذي للمسارات المتقدمة",
      ],
      cta: "هل أنت مستعد لفك الشفرة؟",
      button: "ابدأ رحلتك الآن",
    },

    // Testimonials
    testimonials: {
      title: "أصداء التجربة",
      titleEn: "قصص التحول",
      subtitle: "من الالتزام الذاتي إلى النتائج الاستثنائية",
      items: [
        {
          name: "أحمد محمد",
          role: "مهندس برمجيات",
          feedback: "تحسنت مهاراتي بشكل كبير جداً في فترة قصيرة. النظام فعال جداً!",
          rating: 5,
        },
        {
          name: "فاطمة علي",
          role: "طالبة جامعية",
          feedback: "لأول مرة أشعر بثقة عند التحدث باللغة الإنجليزية. شكراً!",
          rating: 5,
        },
        {
          name: "محمود حسن",
          role: "رجل أعمال",
          feedback: "استثمار رائع. ساعدني على التواصل بكفاءة مع عملائي الدوليين.",
          rating: 5,
        },
      ],
    },

    // Tamara Section
    tamara: {
      title: "ادفع على دفعات مريحة",
      subtitle: "خدمة التقسيط بـ تمارا",
      description: "لا حاجة للقلق بشأن الدفع الكامل مقدماً. استمتع بخدمة التقسيط المرنة من تمارا وادفع على دفعات مريحة بدون فوائد.",
      features: [
        "تقسيط بدون فوائد",
        "دفعات مرنة وسهلة",
        "معالجة فورية",
        "آمن وموثوق",
      ],
      button: "ادفع عبر تمارا",
      note: "اختر تمارا عند الدفع واستمتع بالتقسيط المرن",
    },

    // CTA Section
    cta: {
      title: "هل أنت مستعد لفك الشفرة؟",
      description: "ابدأ رحلتك نحو إتقان اللغة الإنجليزية اليوم. 60 يوماً فقط تفصلك عن نتيجة مذهلة.",
      button: "ابدأ الآن",
      price: "السعر: 999 ريال",
      note: "لا توجد فترة تجريبية مجانية. ابدأ الآن.",
    },

    // Footer
    footer: {
      brand: "نظام هندسي لغوي مصمم لبناء لغتك من الصفر وحتى الإتقان في 60 يوماً.",
      quickLinks: "الروابط السريعة",
      resources: "الموارد",
      contact: "تواصل معنا",
      links: [
        { label: "الصفحة الرئيسية", href: "https://englishom.com" },
        { label: "المزايا", href: "#features" },
        { label: "التسعير", href: "#pricing" },
        { label: "المدونة", href: "https://englishom.com/blog/" },
      ],
      resourceLinks: [
        { label: "اختبار تحديد المستوى", href: "https://englishom.com/ques/" },
        { label: "تتبع مسارك", href: "https://englishom.com/progress/" },
        { label: "لوحة التحكم", href: "https://englishom.com/dashboard/" },
        { label: "شفرة الذكاء", href: "https://englishom.com/Landingpage/" },
      ],
      email: "info@englishom.com",
      whatsapp: "966542577250",
      location: "المملكة العربية السعودية",
      copyright: "© 2026 شفرة الذكاء الأول. جميع الحقوق محفوظة.",
      poweredBy: "بدعم من",
      englishom: "إنجليشوم",
    },
  },

  en: {
    // Navigation
    nav: {
      features: "Features",
      engine: "Engine",
      outcomes: "Outcomes",
      pricing: "Pricing",
      start: "Start Now",
    },

    // Hero Section
    hero: {
      badge: "Advanced Technical System",
      title: "The A1 Code",
      subtitle: "Your Code to Break Language Barriers",
      description: "Break the language barrier in just 50 days. A linguistic system designed to build your language from zero to mastery.",
      features: [
        { label: "Words", value: "1000" },
        { label: "Days", value: "50" },
        { label: "Speak Daily", value: "With AI System" },
        { label: "Steel Foundation", value: "For Advanced Tracks" },
      ],
      cta1: "Start Your Journey",
      cta2: "Learn More",
      successCount: "Join Thousands of Successful Practitioners",
    },

    // Why Choose Section
    whyChoose: {
      title: "Why Choose",
      titleHighlight: "The A1 Code?",
      subtitle: "Everything You Need to Master English",
      features: [
        {
          icon: <GraduationCap className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Advanced System",
          description: "Designed based on the latest global linguistic research",
        },
        {
          icon: <Mic className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Speak Daily",
          description: "Smart system analyzes your pronunciation and only allows progress at 75% accuracy or higher",
        },
        {
          icon: <BarChart className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Track Your Progress",
          description: "Clear visibility of your development with detailed analytics for each stage",
        },
        {
          icon: <Lock className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Self-Discipline",
          description: "The system doesn't allow laziness or skipping the fundamentals",
        },
        {
          icon: <Star className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" fill="currentColor" />,
          title: "Native Touch",
          description: "Learn authentic expressions and natural sentences to sound like a native speaker",
        },
        {
          icon: <Trophy className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Steel Foundation",
          description: "Complete readiness for advanced tracks with a very strong foundation",
        },
      ],
    },

    // 10-Step Engine
    engine: {
      title: "The Operating Engine",
      titleEn: "Ten Advanced Steps",
      subtitle: "Every day is a complete linguistic lifecycle passing through 10 professional technical stages",
      note: "Each stage is carefully designed to ensure your continuous progress",
      noteWarning: "You cannot skip any stage or move forward without complete mastery",
      steps: [
        {
          number: 1,
          icon: <Headphones className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Soundscape",
          titleAr: "The Soundscape",
          description: "Immerse yourself in a realistic daily story to extract 20 key words.",
        },
        {
          number: 2,
          icon: <Map className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Concept Map",
          titleAr: "The Concept Map",
          description: "Explain words with sound and images (understand meaning, not translation).",
        },
        {
          number: 3,
          icon: <RefreshCw className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Audio Loop",
          titleAr: "The Audio Loop",
          description: "Hear words within contextual sentences to train your ear.",
        },
        {
          number: 4,
          icon: <Edit3 className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Structure Fill",
          titleAr: "The Structure Fill",
          description: "Precise writing practice to fill gaps and reinforce spelling.",
        },
        {
          number: 5,
          icon: <Mic className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Voice Lab",
          titleAr: "The Voice Lab",
          description: "AI voice simulator analyzes your pronunciation, and the next gate opens only at 75% accuracy or higher.",
        },
        {
          number: 6,
          icon: <MessageCircle className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "Daily Flow",
          titleAr: "Daily Flow",
          description: "6 expressive sentences that let you talk about your day immediately and simply.",
        },
        {
          number: 7,
          icon: <Shield className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Shield Questions",
          titleAr: "The Shield Questions",
          description: "Provide you with 7 ready-to-use Q&A models for real-life situations.",
        },
        {
          number: 8,
          icon: <Brain className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Logic Hub",
          titleAr: "The Logic Hub",
          description: "Smart grammatical insight that explains \"why\" sentences are built this way.",
        },
        {
          number: 9,
          icon: <Star className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" fill="currentColor" />,
          title: "The Native Edge",
          titleAr: "The Native Edge",
          description: "Practice authentic expressions and natural sentences daily to sound like a native speaker.",
        },
        {
          number: 10,
          icon: <Key className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          title: "The Checkpoint",
          titleAr: "The Checkpoint",
          description: "Final assessment measuring your comprehension, the only key to unlock tomorrow's content.",
        },
      ],
    },

    // Outcomes
    outcomes: {
      title: "System Outcomes",
      titleEn: "Guaranteed Results",
      subtitle: "Upon completing this digital experience, you will achieve the following results:",
      items: [
        {
          title: "Build 1000-Word Vocabulary",
          description: "1000 of the most commonly used words globally, distributed over 50 intensive practice days.",
          icon: <BookOpen className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#F5BB41] to-[#FFC857]",
          guarantee: "100% Guaranteed",
        },
        {
          title: "Break the Fear Barrier",
          description: "Through daily mandatory speaking with the intelligent system.",
          icon: <Dumbbell className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#1F6BF6] to-[#3D84F3]",
          guarantee: "100% Guaranteed",
        },
        {
          title: "Linguistic Flexibility",
          description: "10 additional days dedicated for emergencies and gaps to ensure flexibility and continuity without losing results.",
          icon: <RefreshCw className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#4CA853] to-[#66E066]",
          guarantee: "100% Guaranteed",
        },
        {
          title: "Complete Readiness",
          description: "You will be fully qualified to move to the next track with a solid foundation.",
          icon: <Trophy className="w-10 h-10 mx-auto text-primary dark:text-[#F5BB41]" />,
          color: "from-[#FF9933] to-[#FFB366]",
          guarantee: "100% Guaranteed",
        },
      ],
      whyChooseTitle: "Why This Specific System?",
      whyChooseDesc: "Because success starts with self-discipline. We provide an integrated environment and interactive tools all in one place, and the system guides your daily attempts to ensure stability and progress without skipping fundamentals.",
      whyChoosePoints: [
        "Steel foundation for advanced tracks",
      ],
      cta: "Ready to Crack the Code?",
      button: "Start Your Journey",
    },

    // Testimonials
    testimonials: {
      title: "Experience Echoes",
      titleEn: "Transformation Stories",
      subtitle: "From Self-Discipline to Extraordinary Results",
      items: [
        {
          name: "Ahmed Mohammed",
          role: "Software Engineer",
          feedback: "My skills improved significantly in a short period. The system is very effective!",
          rating: 5,
        },
        {
          name: "Fatima Ali",
          role: "University Student",
          feedback: "For the first time, I feel confident speaking English. Thank you!",
          rating: 5,
        },
        {
          name: "Mahmoud Hassan",
          role: "Business Owner",
          feedback: "Great investment. It helped me communicate efficiently with my international clients.",
          rating: 5,
        },
      ],
    },

    // Tamara Section
    tamara: {
      title: "Pay in Comfortable Installments",
      subtitle: "Installment Service with Tamara",
      description: "No need to worry about paying the full amount upfront. Enjoy flexible installment service from Tamara and pay in comfortable installments without interest.",
      features: [
        "Interest-free installments",
        "Flexible and easy payments",
        "Instant processing",
        "Safe and trusted",
      ],
      button: "Pay with Tamara",
      note: "Choose Tamara at checkout and enjoy flexible installments",
    },

    // CTA Section
    cta: {
      title: "Ready to Crack the Code?",
      description: "Start your journey to mastering English today. Just 60 days separate you from amazing results.",
      button: "Start Now",
      price: "Price: 999 SAR",
      note: "No free trial period. Start now.",
    },

    // Footer
    footer: {
      brand: "An engineered linguistic system designed to build your language from zero to mastery in 60 days.",
      quickLinks: "Quick Links",
      resources: "Resources",
      contact: "Contact Us",
      links: [
        { label: "Home", href: "https://englishom.com" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Blog", href: "https://englishom.com/blog/" },
      ],
      resourceLinks: [
        { label: "Level Test", href: "https://englishom.com/ques/" },
        { label: "Track Progress", href: "https://englishom.com/progress/" },
        { label: "Dashboard", href: "https://englishom.com/dashboard/" },
        { label: "The A1 Code", href: "https://englishom.com/Landingpage/" },
      ],
      email: "info@englishom.com",
      whatsapp: "966542577250",
      location: "Saudi Arabia",
      copyright: "© 2026 The A1 Code. All rights reserved.",
      poweredBy: "Powered by",
      englishom: "Englishom",
    },
  },
};

export type Language = "ar" | "en";
