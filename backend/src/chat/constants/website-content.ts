export const WEBSITE_CONTENT = {
  landing: {
    en: {
      hero: {
        title: "Master English with Englishom",
        description: "Transform your English skills with our comprehensive learning platform. Practice speaking, listening, reading, and writing through engaging daily lessons."
      },
      features: {
        interactive: "Engage with dynamic content including audio and interactive exercises.",
        speaking: "Improve your pronunciation with our advanced speech recognition technology.",
        progress: "Monitor your learning journey with detailed analytics.",
        levels: "Choose from beginner (A1) to advanced (C2) levels with structured 50-day learning programs.",
        daily: "Build consistent learning habits with daily lessons, tests, and speaking exercises.",
        certificate: "Earn certificates upon completing each level."
      },
      pricing: "The subscription price is final and fixed suitable for everyone. No family plans or student discounts. Payment via Visa/Mastercard.",
      contact: {
        email: "support@englishom.com (Technical Support), info@englishom.com (General Info)",
        social: "Facebook, Instagram, Snapchat, Telegram, WhatsApp, TikTok, Twitter, YouTube",
        response_time: "We commit to responding within 24 hours."
      },
      about: "We believe speaking English is a key to opportunity. Our methodology focuses on overcoming fear and daily practice (25 seconds recording daily, 20 new words daily).",
      vision: "To be the world's leading platform for teaching English speaking. Empowering individuals to break the barrier of fear and express themselves fluently.",
      methodology: "50-day levels. 1000 words per level. 20 words/day. Daily speaking practice. Daily grammar. Daily test."
    },
    ar: {
      hero: {
        title: "أتقن الإنجليزية مع إنجلش هوم",
        description: "طور مهاراتك في اللغة الإنجليزية مع منصتنا التعليمية الشاملة. تدرب على التحدث والاستماع والقراءة والكتابة من خلال دروس يومية تفاعلية."
      },
      features: {
        interactive: "تفاعل مع محتوى ديناميكي يشمل الصوت والتمارين التفاعلية.",
        speaking: "حسّن نطقك باستخدام تقنية التعرف على الكلام المتقدمة.",
        progress: "راقب رحلة تعلمك من خلال تحليلات مفصلة.",
        levels: "اختر من المستوى المبتدئ (A1) إلى المتقدم (C2) مع برامج تعليمية منظمة لمدة 50 يوماً.",
        daily: "اكتسب عادات تعلم ثابتة مع دروس يومية واختبارات وتمارين التحدث.",
        certificate: "احصل على شهادات عند إكمال كل مستوى."
      },
      pricing: "سعر الاشتراك محدد بشكل نهائي وثابت للجميع. لا توجد خطط عائلية أو خصومات طلابية. الدفع عبر فيزا وماستركارد.",
      contact: {
        email: "support@englishom.com (الدعم الفني), info@englishom.com (معلومات عامة)",
        social: "فيسبوك، انستجرام، سناب شات، تيليجرام، واتساب، تيك توك، تويتر، يوتيوب",
        response_time: "نلتزم بالرد خلال 24 ساعة."
      },
      about: "نؤمن بأن التحدث بالإنجليزية مفتاح للفرص. منهجيتنا تركز على كسر حاجز الخوف والممارسة اليومية (تسجيل 25 ثانية يومياً، 20 كلمة يومياً).",
      vision: "أن نكون المنصة الرائدة عالمياً في تعليم التحدث بالإنجليزية. تمكين الأفراد من التعبير عن أنفسهم بطلاقة وثقة.",
      methodology: "مستويات مدتها 50 يوماً. 1000 كلمة لكل مستوى. 20 كلمة يومياً. ممارسة تحدث يومية. قواعد يومية. اختبار يومي."
    }
  }
};

export const SYSTEM_PROMPT = `
You are the AI Assistant for "Englishom" (إنجلش هوم), an English learning platform.
Your Role: Answer visitor questions using ONLY the provided context.
Strict Rules:
1. You act as a polite, helpful assistant for the website.
2. SOURCE OF TRUTH: You must ONLY use the provided "Website Content" below.
3. RESTRICTION: Do NOT use your general knowledge to answer questions about specific English lessons, grammar rules not mentioned here, or world events.
4. OUT OF SCOPE: If asked about something not in the content (like "Explain Present Perfect" or "Who won the World Cup"), apologize politely and say you are an assistant for website inquiries only.
5. LINKS: If asked about support or pricing, refer to the contact info or pricing section provided.
6. LANGUAGE: Answer in the SAME language as the user's question (Arabic or English).
7. TONE: Professional, encouraging, and concise.

Website Content:
${JSON.stringify(WEBSITE_CONTENT)}
`;
