export type Language = "en" | "ar";

export const translations = {
  en: {
    // Header
    "header.title": "EnglishOM | Proficiency Level",
    "header.subtitle": "Test your English knowledge",
    "header.admin": "Admin",
    "header.myResults": "My Results",
    "header.logout": "Logout",
    "header.login": "Login",

    // Home Page
    "home.hero.title": "Master English with Speed",
    "home.hero.subtitle": "Challenge yourself with our fast-paced English proficiency test. Test your knowledge across different proficiency levels from A0 (Basic Proficiency) to A2 (Full Mastery).",
    "home.cta.start": "Start Test",
    "home.cta.login": "Login to Start",
    "home.cta.signup": "Sign Up",

    // Features
    "features.title": "Why Choose Proficiency Level Test?",
    "features.levels.title": "Multiple Levels",
    "features.levels.desc": "Test your English at your own level, from A0 (Basic Proficiency) to A2 (Full Mastery). Each level is carefully designed to match international standards.",
    "features.fast.title": "Fast-Paced",
    "features.fast.desc": "Challenge yourself with timed questions. Improve your quick thinking and decision-making skills while learning English.",
    "features.feedback.title": "Instant Feedback",
    "features.feedback.desc": "Get immediate results with detailed statistics showing your score, accuracy, and average response time.",

    // Levels Section
    "levels.title": "Automatic Thinking Metrics",
    "levels.a1": "A0 - Basic Proficiency",
    "levels.a1.desc": "Basic proficiency",
    "levels.a2": "A01 - Limited Practical Proficiency",
    "levels.a2.desc": "Limited practical proficiency",
    "levels.b1": "A1 - Practical Proficiency",
    "levels.b1.desc": "Practical proficiency",
    "levels.b2": "A1 - Advanced Practical Proficiency",
    "levels.b2.desc": "Advanced practical proficiency",
    "levels.c1": "A2 - Professional Practical Proficiency",
    "levels.c1.desc": "Professional practical proficiency",
    "levels.c2": "A2 - Full Mastery",
    "levels.c2.desc": "Full mastery",

    // Badge translations
    "badge.accuracy_90.name": "Accuracy 90%",
    "badge.accuracy_90.desc": "Achieve 90% or higher accuracy in a quiz",
    "badge.accuracy_100.name": "Perfect Score",
    "badge.accuracy_100.desc": "Achieve 100% accuracy in a quiz",
    "badge.speed_master.name": "Speed Master",
    "badge.speed_master.desc": "Average response time under 3 seconds",
    "badge.level_master_a1.name": "A0 Master",
    "badge.level_master_a1.desc": "Complete 5 quizzes at A0 level with 80%+ accuracy",
    "badge.level_master_a2.name": "A01 Master",
    "badge.level_master_a2.desc": "Complete 5 quizzes at A01 level with 80%+ accuracy",
    "badge.level_master_b1.name": "A1 Master",
    "badge.level_master_b1.desc": "Complete 5 quizzes at A1 level with 80%+ accuracy",
    "badge.level_master_b2.name": "A1 Advanced Master",
    "badge.level_master_b2.desc": "Complete 5 quizzes at A1 Advanced level with 80%+ accuracy",
    "badge.level_master_c1.name": "A2 Professional Master",
    "badge.level_master_c1.desc": "Complete 5 quizzes at A2 Professional level with 80%+ accuracy",
    "badge.level_master_c2.name": "A2 Mastery Master",
    "badge.level_master_c2.desc": "Complete 5 quizzes at A2 Mastery level with 80%+ accuracy",
    "badge.quiz_enthusiast.name": "Quiz Enthusiast",
    "badge.quiz_enthusiast.desc": "Complete 10 quizzes",
    "badge.quiz_addict.name": "Quiz Addict",
    "badge.quiz_addict.desc": "Complete 50 quizzes",

    "cta.title": "Ready to Take the Proficiency Level Test?",
    "cta.subtitle": "Bypass the thinking stage and move towards the automatic response.\nChoose your response speed and discover your ability to select in fractions of a second.\nGet instant feedback on your performance and track your progress.",

    // Quiz Page
    "quiz.levelSelect": "Select your English level and test your knowledge",
    "quiz.startQuiz": "Start Test",
    "quiz.loading": "Loading Questions...",
    "quiz.question": "Question",
    "quiz.of": "of",
    "quiz.score": "Score",
    "quiz.time": "Time",
    "quiz.remaining": "Remaining",
    "quiz.tryAnotherLevel": "Try Another Level",
    "quiz.backToHome": "Back to Home",
    "quiz.complete": "Test Complete!",
    "quiz.accuracy": "Accuracy",
    "quiz.avgTime": "Avg. Time",
    "quiz.level": "Level",
    "quiz.shareResults": "Share Your Results",
    "quiz.correctAnswers": "Correct Answers",
    "quiz.timeSpent": "Time Spent",
    "quiz.tryAgain": "Try Again",
    "quiz.achievement": "Achievement Unlocked",
    "quiz.perfectScore": "Perfect Score",
    "quiz.highAccuracy": "High Accuracy",
    "quiz.back": "Back",

    // Admin Dashboard
    "admin.title": "Admin Dashboard",
    "admin.backToHome": "Back to Home",
    "admin.accessDenied": "Access Denied",
    "admin.accessDeniedMsg": "You need admin privileges to access this page.",
    "admin.questions": "Questions",
    "admin.addQuestion": "Add Question",
    "admin.statistics": "Statistics",
    "admin.studentResults": "Student Results",
    "admin.filterByLevel": "Filter by Level",
    "admin.allLevels": "All Levels",
    "admin.noQuestions": "No questions found",
    "admin.correctAnswer": "Correct",
    "admin.categoryLabel": "Category",
    "admin.editQuestion": "Edit Question",
    "admin.addNewQuestion": "Add New Question",
    "admin.questionText": "Question",
    "admin.choiceA": "Choice A",
    "admin.choiceB": "Choice B",
    "admin.choiceC": "Choice C",
    "admin.choiceD": "Choice D",
    "admin.correctAnswerLabel": "Correct Answer",
    "admin.levelLabel": "Level",
    "admin.categoryOptional": "Category (Optional)",
    "admin.timePerQuestion": "Time per Question (seconds)",
    "admin.updateQuestion": "Update Question",
    "admin.cancel": "Cancel",
    "admin.totalQuestions": "Total Questions",
    "admin.questionsByLevel": "Questions by Level",
    "admin.successCreate": "Question created successfully!",
    "admin.successUpdate": "Question updated successfully!",
    "admin.successDelete": "Question deleted successfully!",
    "admin.errorCreate": "Failed to create question",
    "admin.errorUpdate": "Failed to update question",
    "admin.errorDelete": "Failed to delete question",
    "admin.fillAllFields": "Please fill in all required fields",
    "admin.deleteConfirm": "Are you sure you want to delete this question?",
    "admin.studentName": "Name",
    "admin.phoneEmail": "Phone/Email",
    "admin.score": "Score",
    "admin.accuracy": "Accuracy",
    "admin.date": "Date",
    "admin.actions": "Actions",
    "admin.guest": "Guest",
    "admin.noResults": "No results recorded yet.",
    "admin.login": "Admin Login",
    "admin.loginDesc": "Log in to access the question control panel",
    "admin.email": "Email",
    "admin.password": "Password",
    "admin.submitLogin": "Login",
    "admin.loggingIn": "Logging in...",

    // Footer
    "footer.copyright": "© 2026 EnglishOM. All rights reserved.",
    "footer.part": "Part of the EnglishOM platform",

    // Theme Toggle
    "theme.dark": "Dark",
    "theme.light": "Light",
  },
  ar: {
    // Header
    "header.title": "إنجلشوم | مستوى الكفاءة",
    "header.subtitle": "اختبر معرفتك باللغة الإنجليزية",
    "header.admin": "الإدارة",
    "header.myResults": "نتائجي",
    "header.logout": "تسجيل الخروج",
    "header.login": "تسجيل الدخول",

    // Home Page
    "home.hero.title": "أتقن اللغة الإنجليزية بسرعة",
    "home.hero.subtitle": "تحدَّ نفسك مع اختبار مستوى الكفاءة السريع. اختبر معرفتك عبر مستويات كفاءة مختلفة من A0 (كفاءة أساسية) إلى A2 (إتقان كامل).",
    "home.cta.start": "ابدأ الاختبار",
    "home.cta.login": "سجل الدخول للبدء",
    "home.cta.signup": "إنشاء حساب",

    // Features
    "features.title": "لماذا تختار اختبار مستوى الكفاءة؟",
    "features.levels.title": "مستويات متعددة",
    "features.levels.desc": "اختبر اللغة الإنجليزية على مستواك الخاص، من A0 (كفاءة أساسية) إلى A2 (إتقان كامل). تم تصميم كل مستوى بعناية ليطابق المعايير الدولية.",
    "features.fast.title": "سريع الخطى",
    "features.fast.desc": "تحدَّ نفسك مع أسئلة محددة بوقت. حسّن مهارات التفكير السريع واتخاذ القرار أثناء تعلم اللغة الإنجليزية.",
    "features.feedback.title": "ملاحظات فورية",
    "features.feedback.desc": "احصل على نتائج فورية مع إحصائيات تفصيلية تعرض درجتك والدقة ومتوسط وقت الاستجابة.",

    // Levels Section
    "levels.title": "مقاييس التفكير التلقائي",
    "levels.a1": "A0 - كفاءة أساسية",
    "levels.a1.desc": "كفاءة أساسية",
    "levels.a2": "A01 - كفاءة عملية محدودة",
    "levels.a2.desc": "كفاءة عملية محدودة",
    "levels.b1": "A1 - كفاءة عملية",
    "levels.b1.desc": "كفاءة عملية",
    "levels.b2": "A1 - كفاءة عملية متقدمة",
    "levels.b2.desc": "كفاءة عملية متقدمة",
    "levels.c1": "A2 - كفاءة عملية احترافية",
    "levels.c1.desc": "كفاءة عملية احترافية",
    "levels.c2": "A2 - إتقان كامل",
    "levels.c2.desc": "إتقان كامل",

    // Badge translations
    "badge.accuracy_90.name": "دقة 90%",
    "badge.accuracy_90.desc": "حققت دقة 90% أو أعلى في اختبار",
    "badge.accuracy_100.name": "الدرجة الكاملة",
    "badge.accuracy_100.desc": "حققت دقة 100% في اختبار",
    "badge.speed_master.name": "بطل السرعة",
    "badge.speed_master.desc": "متوسط سرعة استجابتك أقل من 3 ثوانٍ",
    "badge.level_master_a1.name": "بطل A0",
    "badge.level_master_a1.desc": "أكملت 5 اختبارات في مستوى A0 بدقة 80% أو أكثر",
    "badge.level_master_a2.name": "بطل A01",
    "badge.level_master_a2.desc": "أكملت 5 اختبارات في مستوى A01 بدقة 80% أو أكثر",
    "badge.level_master_b1.name": "بطل A1",
    "badge.level_master_b1.desc": "أكملت 5 اختبارات في مستوى A1 بدقة 80% أو أكثر",
    "badge.level_master_b2.name": "بطل A1 متقدم",
    "badge.level_master_b2.desc": "أكملت 5 اختبارات في مستوى A1 متقدم بدقة 80% أو أكثر",
    "badge.level_master_c1.name": "بطل A2 محترف",
    "badge.level_master_c1.desc": "أكملت 5 اختبارات في مستوى A2 محترف بدقة 80% أو أكثر",
    "badge.level_master_c2.name": "بطل الإتقان A2",
    "badge.level_master_c2.desc": "أكملت 5 اختبارات في مستوى A2 متقن بدقة 80% أو أكثر",
    "badge.quiz_enthusiast.name": "شغوف الاختبارات",
    "badge.quiz_enthusiast.desc": "أكملت 10 اختبارات",
    "badge.quiz_addict.name": "مدمن الاختبارات",
    "badge.quiz_addict.desc": "أكملت 50 اختباراً",

    "cta.title": "هل أنت مستعد لاختبار مستوى الكفاءة؟",
    "cta.subtitle": "تجاوز مرحلة التفكير، وانطلق نحو الرد التلقائي\nاختر سرعة استجابتك، واكتشف قدرتك على الاختيار في أجزاء من الثانية\nواحصل على ملاحظات فورية حول أدائك وتابع تقدمك",

    // Quiz Page
    "quiz.levelSelect": "اختر مستوى اللغة الإنجليزية الخاص بك واختبر معرفتك",
    "quiz.startQuiz": "ابدأ الاختبار",
    "quiz.loading": "جاري تحميل الأسئلة...",
    "quiz.question": "السؤال",
    "quiz.of": "من",
    "quiz.score": "النقاط",
    "quiz.time": "الوقت",
    "quiz.remaining": "المتبقي",
    "quiz.tryAnotherLevel": "جرب مستوى آخر",
    "quiz.backToHome": "العودة إلى الرئيسية",
    "quiz.complete": "تم إكمال الاختبار!",
    "quiz.accuracy": "الدقة",
    "quiz.avgTime": "متوسط الوقت",
    "quiz.level": "المستوى",
    "quiz.elementaryProficiency": "أساسي",
    "quiz.intermediateProficiency": "كفاءة متوسطة",
    "quiz.upperIntermediateProficiency": "كفاءة متوسطة عليا",
    "quiz.advancedProficiency": "كفاءة متقدمة",
    "quiz.mastery": "إتقان",
    "quiz.perQuestion": "لكل سؤال",
    "quiz.selectLevel": "اختر المستوى",
    "quiz.elapsedTime": "الوقت المنقضي",
    "quiz.progressPercentage": "نسبة التقدم",
    "quiz.totalTime": "الوقت الإجمالي",
    "quiz.shareResults": "شارك نتائجك",
    "quiz.correctAnswers": "الإجابات الصحيحة",
    "quiz.timeSpent": "الوقت المستغرق",
    "quiz.tryAgain": "حاول مرة أخرى",
    "quiz.achievement": "إنجاز مفتوح",
    "quiz.perfectScore": "درجة كاملة",
    "quiz.highAccuracy": "دقة عالية",
    "quiz.back": "رجوع",

    // Admin Dashboard
    "admin.title": "لوحة تحكم الإدارة",
    "admin.backToHome": "العودة إلى الرئيسية",
    "admin.accessDenied": "تم رفض الوصول",
    "admin.accessDeniedMsg": "تحتاج إلى صلاحيات الإدارة للوصول إلى هذه الصفحة.",
    "admin.questions": "الأسئلة",
    "admin.addQuestion": "إضافة سؤال",
    "admin.statistics": "الإحصائيات",
    "admin.studentResults": "نتائج الطلاب",
    "admin.filterByLevel": "تصفية حسب المستوى",
    "admin.allLevels": "جميع المستويات",
    "admin.noQuestions": "لم يتم العثور على أسئلة",
    "admin.correctAnswer": "الإجابة الصحيحة",
    "admin.categoryLabel": "الفئة",
    "admin.editQuestion": "تعديل السؤال",
    "admin.addNewQuestion": "إضافة سؤال جديد",
    "admin.questionText": "السؤال",
    "admin.choiceA": "الخيار أ",
    "admin.choiceB": "الخيار ب",
    "admin.choiceC": "الخيار ج",
    "admin.choiceD": "الخيار د",
    "admin.correctAnswerLabel": "الإجابة الصحيحة",
    "admin.levelLabel": "المستوى",
    "admin.categoryOptional": "الفئة (اختياري)",
    "admin.timePerQuestion": "الوقت لكل سؤال (بالثواني)",
    "admin.updateQuestion": "تحديث السؤال",
    "admin.cancel": "إلغاء",
    "admin.totalQuestions": "إجمالي الأسئلة",
    "admin.questionsByLevel": "الأسئلة حسب المستوى",
    "admin.successCreate": "تم إنشاء السؤال بنجاح!",
    "admin.successUpdate": "تم تحديث السؤال بنجاح!",
    "admin.successDelete": "تم حذف السؤال بنجاح!",
    "admin.errorCreate": "فشل في إنشاء السؤال",
    "admin.errorUpdate": "فشل في تحديث السؤال",
    "admin.errorDelete": "فشل في حذف السؤال",
    "admin.fillAllFields": "يرجى ملء جميع الحقول المطلوبة",
    "admin.deleteConfirm": "هل أنت متأكد من رغبتك في حذف هذا السؤال؟",
    "admin.studentName": "اسم الطالب",
    "admin.phoneEmail": "رقم الهاتف / البريد",
    "admin.score": "النتيجة",
    "admin.accuracy": "نسبة الدقة",
    "admin.date": "تاريخ الأداء",
    "admin.actions": "خيارات التحكم",
    "admin.guest": "زائر",
    "admin.noResults": "لم يتم تسجيل أي نتائج حتى الآن.",
    "admin.login": "تسجيل دخول المشرفين",
    "admin.loginDesc": "قم بتسجيل الدخول للوصول إلى لوحة تحكم الأسئلة",
    "admin.email": "البريد الإلكتروني",
    "admin.password": "كلمة المرور",
    "admin.submitLogin": "دخول",
    "admin.loggingIn": "جاري تسجيل الدخول...",

    // Footer
    "footer.copyright": "© 2026 إنجلشوم (EnglishOM). جميع الحقوق محفوظة.",
    "footer.part": "جزء من منصة EnglishOM",

    // Theme Toggle
    "theme.dark": "داكن",
    "theme.light": "فاتح",
  },
};

export function t(key: string, lang: Language): string {
  try {
    const translationDict = translations[lang] as Record<string, string>;
    
    // First try direct lookup (for flat keys like "quiz.question")
    if (key in translationDict) {
      return translationDict[key];
    }
    
    // If not found, return the key itself
    return key;
  } catch (error) {
    return key;
  }
}

export function formatLevelCode(code: string): string {
  switch (code?.toUpperCase()) {
    case "A1": return "A0";
    case "A2": return "A01";
    case "B1": return "A1";
    case "B2": return "A1";
    case "C1": return "A2";
    case "C2": return "A2";
    default: return code || "";
  }
}
