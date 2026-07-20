export type Language = "en" | "ar";

export const translations = {
  en: {
    // Navigation
    nav: {
      englishom: "Englishom",
      logout: "Logout",
      login: "Login",
    },
    // Home Page
    home: {
      title: "Achievement Indicator",
      subtitle: "Take the exclusive test challenge from EnglishOM | Discover your position on the Achievement Indicator instantly, and get your real-time results with precise guidance to build your next step with confidence.",
      quickAssessment: "Quick Assessment - 30-40 minutes",
      fiveStages: "5 Comprehensive Stages",
      instantResults: "Instant Results & Feedback",
      startNow: "Start Test Now",
      testStages: "Achievement Indicator from EnglishOM",
      stages: "Building & Foundations Stages",
      levels: "Mastery Scale",
      proficiencyLevels: "Mastery Scale",
      getStarted: "Get your personalized assessment and start your learning journey today",
      readyToTest: "Ready to Test Your English?",
      getAssessment: "Get your personalized assessment and start your learning journey today",
      startTestNow: "Start Test Now",
      addQuestions: "Add Questions",
    },
    // Stages
    stages: {
      visualRecognition: "Visual Recognition",
      matchImagesWithWords: "Match images with words",
      auditoryProcessing: "Auditory Processing",
      identifySoundsAndWords: "Identify sounds and words",
      spellingStructure: "Spelling & Structure",
      completeWordsAndSentences: "Complete words and sentences",
      readingSprint: "Reading Sprint",
      comprehensionAndFluency: "Comprehension & fluency",
      vocalChallenge: "Vocal Challenge",
      vocal: "Speak and be evaluated",
      visual: "Match images with words",
      auditory: "Identify sounds and words",
      spelling: "Complete words and sentences",
      reading: "Comprehension & fluency",
      speakAndBeEvaluated: "Speak and be evaluated",
    },
    // Levels
    levels: {
      beginner: "Foundations",
      elementary: "Builder",
      intermediate: "Rising Star",
      upperIntermediate: "Proficient",
      advanced: "Elite",
      beginnerConcept: "You laid the cornerstone and started trying, you need to reinforce building to pass this ratio.",
      elementaryConcept: "You started assembling pieces and understanding the core structure of the language.",
      intermediateConcept: "Your language is starting to show more clearly, and you have good comprehension ability.",
      upperIntermediateConcept: "You have mastered most A1 skills with high proficiency.",
      advancedConcept: "You passed the A1 stage with stellar success and zero gaps.",
    },
    // Test Page
    test: {
      placementTest: "Achievement Indicator Test",
      fullName: "Full Name",
      enterFullName: "Enter your full name",
      emailAddress: "Email Address",
      enterEmail: "Enter your email",
      testOverview: "Test Overview:",
      noGoingBack: "No going back between stages",
      startTest: "Start Test",
      student: "Student",
      question: "Question",
      timeRemaining: "Time Remaining",
      nextQuestion: "Next Question",
      nextStage: "Next Stage",
      playAudio: "Play Audio",
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      submitAnswer: "Submit Answer",
      completeTest: "Complete Test",
      testCompleted: "Test Completed!",
      processingResults: "Processing your results...",
    },
    // Results Page
    results: {
      yourResults: "Your Achievement Indicator Results",
      overallScore: "Your Overall Score",
      recommendation: "Recommendation:",
      takeTestAgain: "Take Test Again",
      printResults: "Print Results",
      testCompletedOn: "Test completed on",
      resultId: "Result ID",
    },
    // Admin Dashboard
    admin: {
      adminDashboard: "Admin Dashboard",
      backToHome: "Back to Home",
      accessDenied: "Access Denied",
      mustBeAdmin: "You must be an admin to access this page",
      questionBank: "Question Bank",
      studentResults: "Student Results",
      feedbackMessages: "Feedback Messages",
      questionBankManagement: "Question Bank Management",
      addNewQuestion: "Add New Question",
      studentTestResults: "Student Test Results",
      studentName: "Student Name",
      email: "Email",
      level: "Level",
      score: "Score",
      date: "Date",
      noResults: "No test results yet",
      feedbackMessageManagement: "Feedback Messages",
      addNewMessage: "Add New Message",
      anonymous: "Anonymous",
    },
    // Messages
    messages: {
      pleaseEnterName: "Please enter your name and email",
      errorSubmitting: "Error submitting test. Please try again.",
      unableToAccessMicrophone: "Unable to access microphone. Please check permissions.",
      recordingSaved: "✓ Recording saved",
      readyToRecord: "Ready to record",
      recording: "Recording...",
    },
  },
  ar: {
    // Navigation
    nav: {
      englishom: "إنجليشوم",
      logout: "تسجيل الخروج",
      login: "تسجيل الدخول",
    },
    // Home Page
    home: {
      title: "مؤشر الإنجاز",
      subtitle: "خُض تحدي الاختبار الحصري من إنجلشوم| اكتشف موقعك على مؤشر الإنجاز فوراً، واحصل على نتائجك اللحظية مع توجيهات دقيقة تبني عليها خطوتك القادمة بثقة",
      quickAssessment: "تقييم سريع - 30-40 دقيقة",
      fiveStages: "5 مراحل شاملة",
      instantResults: "نتائج فورية وتعليقات",
      startNow: "ابدأ الاختبار الآن",
      testStages: "مؤشر الإنجاز من إنجليشوم",
      stages: "مراحل البناء والتأسيس",
      levels: "مقياس التمكن",
      proficiencyLevels: "مقياس التمكن",
      getStarted: "احصل على تقييم شخصي وابدأ رحلة التعلم الخاصة بك اليوم",
      readyToTest: "هل أنت مستعد لاختبار اللغة الإنجليزية؟",
      getAssessment: "احصل على تقييم شخصي وابدأ رحلة التعلم الخاصة بك اليوم",
      startTestNow: "ابدأ الاختبار الآن",
      addQuestions: "إضافة أسئلة",
    },
    // Stages
    stages: {
      visualRecognition: "التعرف البصري",
      matchImagesWithWords: "طابق الصور مع الكلمات",
      auditoryProcessing: "معالجة الصوت",
      identifySoundsAndWords: "تحديد الأصوات والكلمات",
      spellingStructure: "الإملاء والتركيب",
      completeWordsAndSentences: "أكمل الكلمات والجمل",
      readingSprint: "سباق القراءة",
      comprehensionAndFluency: "الفهم والطلاقة",
      vocalChallenge: "تحدي النطق",
      vocal: "تحدث وتم تقييمك",
      visual: "طابق الصور مع الكلمات",
      auditory: "تحديد الأصوات والكلمات",
      spelling: "أكمل الكلمات والجمل",
      reading: "الفهم والطلاقة",
      speakAndBeEvaluated: "تحدث وتم تقييمك",
    },
    // Levels
    levels: {
      beginner: "وضع التأسيس",
      elementary: "بناء المفردات",
      intermediate: "المتحدث الواعد",
      upperIntermediate: "مستوى الإتقان",
      advanced: "الامتياز الكامل",
      beginnerConcept: "وضعت حجر الأساس وبدأت المحاولة، تحتاج لتعزيز البناء لتجاوز هذه النسبة.",
      elementaryConcept: "بدأت تركيب القطع وفهم الهيكل الأساسي للغة.",
      intermediateConcept: "لغتك بدأت تظهر بشكل أوضح ولديك قدرة جيدة على الفهم.",
      upperIntermediateConcept: "تمكنت من معظم مهارات الـ A1 ببراعة عالية.",
      advancedConcept: "تجاوزت مرحلة الـ A1 بنجاح باهر وبدون أي ثغرات.",
    },
    // Test Page
    test: {
      placementTest: "اختبار مؤشر الإنجاز",
      fullName: "الاسم الكامل",
      enterFullName: "أدخل اسمك الكامل",
      emailAddress: "عنوان البريد الإلكتروني",
      enterEmail: "أدخل بريدك الإلكتروني",
      testOverview: "نظرة عامة على الاختبار:",
      noGoingBack: "لا يمكن العودة بين المراحل",
      startTest: "ابدأ الاختبار",
      student: "الطالب",
      question: "السؤال",
      timeRemaining: "الوقت المتبقي",
      nextQuestion: "السؤال التالي",
      nextStage: "المرحلة التالية",
      playAudio: "تشغيل الصوت",
      startRecording: "ابدأ التسجيل",
      stopRecording: "إيقاف التسجيل",
      submitAnswer: "إرسال الإجابة",
      completeTest: "إكمال الاختبار",
      testCompleted: "تم إكمال الاختبار!",
      processingResults: "جاري معالجة النتائج...",
    },
    // Results Page
    results: {
      yourResults: "نتائج مؤشر الإنجاز الخاصة بك",
      overallScore: "درجتك الإجمالية",
      recommendation: "التوصية:",
      takeTestAgain: "خذ الاختبار مرة أخرى",
      printResults: "طباعة النتائج",
      testCompletedOn: "تم إكمال الاختبار في",
      resultId: "معرف النتيجة",
    },
    // Admin Dashboard
    admin: {
      adminDashboard: "لوحة التحكم الإدارية",
      backToHome: "العودة إلى الصفحة الرئيسية",
      accessDenied: "تم رفض الوصول",
      mustBeAdmin: "يجب أن تكون مسؤولاً للوصول إلى هذه الصفحة",
      questionBank: "بنك الأسئلة",
      studentResults: "نتائج الطلاب",
      feedbackMessages: "رسائل التعليقات",
      questionBankManagement: "إدارة بنك الأسئلة",
      addNewQuestion: "إضافة سؤال جديد",
      studentTestResults: "نتائج اختبار الطلاب",
      studentName: "اسم الطالب",
      email: "البريد الإلكتروني",
      level: "المستوى",
      score: "الدرجة",
      date: "التاريخ",
      noResults: "لا توجد نتائج اختبار حتى الآن",
      feedbackMessageManagement: "إدارة رسائل التعليقات",
      addNewMessage: "إضافة رسالة جديدة",
      anonymous: "مجهول",
    },
    // Messages
    messages: {
      pleaseEnterName: "يرجى إدخال اسمك وبريدك الإلكتروني",
      errorSubmitting: "خطأ في إرسال الاختبار. يرجى المحاولة مرة أخرى.",
      unableToAccessMicrophone: "غير قادر على الوصول إلى الميكروفون. يرجى التحقق من الأذونات.",
      recordingSaved: "✓ تم حفظ التسجيل",
      readyToRecord: "جاهز للتسجيل",
      recording: "جاري التسجيل...",
    },
  },
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export type Language = "en" | "ar";
