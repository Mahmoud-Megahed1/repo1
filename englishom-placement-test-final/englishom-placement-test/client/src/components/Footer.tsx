import { useLanguage } from "@/contexts/LanguageContext";

const SocialIcons = [
  {
    name: "YouTube",
    href: "https://youtube.com",
    bg: "bg-[#FF0000]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    bg: "bg-[#0f1419] border border-slate-700",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    bg: "bg-[#111111] border border-slate-800",
    svg: (
      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.39.67-4.8 2.37-6.49 1.69-1.69 4.13-2.52 6.51-2.22v4.14c-1.16-.16-2.37.15-3.23.86-.88.7-1.38 1.78-1.35 2.9.01 1.05.51 2.05 1.34 2.7.83.66 1.94.94 2.99.76 1.05-.16 2.02-.79 2.56-1.7.53-.89.77-1.95.74-2.99V.02z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com",
    bg: "bg-[#25D366]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me",
    bg: "bg-[#229ED9]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.28-1.49 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.76-5.2c.25-.22-.05-.35-.39-.13l-7.12 4.48-3.07-.96c-.67-.21-.68-.67.14-.99l12.01-4.63c.56-.21 1.05.13.83.99z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    bg: "bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://snapchat.com",
    bg: "bg-[#FFFC00]",
    svg: (
      <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
        <path d="M12.007 0C8.031 0 5.617 2.738 5.617 5.688c0 1.09.289 2.05.612 2.879.167.433.208.571.127.81-.077.228-.35.393-.728.524-.766.265-1.761.642-2.207 1.472-.34.633-.186 1.417.379 1.906.592.512 1.341.65 2.083.786.195.035.39.07.574.11.393.084.58.261.54.549-.036.262-.259.626-.527 1.066-.372.609-.894 1.464-.894 2.502 0 1.996 2.016 3.197 4.908 3.197 1.025 0 2.029-.168 2.915-.499 1.037.331 2.04.499 3.065.499 2.893 0 4.909-1.201 4.909-3.197 0-1.038-.522-1.893-.895-2.502-.268-.44-.491-.804-.526-1.066-.041-.288.146-.465.539-.549.184-.04.379-.075.574-.11.742-.136 1.491-.274 2.083-.786.565-.489.719-1.273.379-1.906-.446-.83-.1.441-1.238-2.207-1.472-.378-.131-.651-.296-.728-.524-.081-.239-.04-.377.127-.81.323-.829.612-1.789.612-2.879C18.397 2.738 15.983 0 12.007 0z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    bg: "bg-[#1877F2]",
    svg: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <footer className="bg-card text-foreground border-t border-border py-12 px-4 md:px-8 transition-colors" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Banner Section */}
        <div className="bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/10 border border-[#4A3B32]/20 dark:border-[#FCDFC2]/20 rounded-2xl p-6 md:p-8 backdrop-blur text-center md:text-start flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#4A3B32] dark:bg-[#FCDFC2]" />
              {isAr ? "إنجلشوم | مؤشر الإنجاز" : "EnglishOM | Achievement Indicator"}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {isAr
                ? `"نوظف التقنية لقياس مدى تمكنك من مرحلتك الحالية. نحن هنا لنوفّق إنجازك، ونرسم لك ملامح خطوة البدء القادمة بثقة تعزز من لغتك."`
                : `"We employ technology to measure your mastery of your current stage. We are here to validate your achievement and chart your next starting step with confidence to boost your language."`}
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {SocialIcons.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className={`w-9 h-9 rounded-xl ${social.bg} flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110 hover:shadow-lg`}
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Column 1: Test Your Language (اختبر لغتك) */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
              {isAr ? "اختبر لغتك" : "Test Your Language"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://englishom.com/ques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                  {isAr ? "مستوى الكفاءة" : "Proficiency Level"}
                </a>
              </li>
              <li>
                <a
                  href="https://englishom.com/test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                  {isAr ? "اكتشف مستواك" : "Discover Your Level"}
                </a>
              </li>
              <li>
                <a
                  href="https://englishom.com/test1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-[#4A3B32] dark:text-[#FCDFC2]">●</span>
                  {isAr ? "مؤشر الإنجاز" : "Achievement Indicator"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Training & Practice */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
              {isAr ? "التدريب والممارسة" : "Training & Practice"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/signup" : "https://englishom.com/en/signup"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "أبدأ الممارسة الذكية" : "Start Smart Practice"}
                </a>
              </li>
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/app" : "https://englishom.com/en/app"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "تسجيل الدخول" : "Login"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
              {isAr ? "الدعم" : "Support"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/user-guide" : "https://englishom.com/en/user-guide"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "دليل المستخدم" : "User Guide"}
                </a>
              </li>
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/contact" : "https://englishom.com/en/contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "اتصل بنا" : "Contact Us"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-foreground border-b-2 border-[#4A3B32] dark:border-[#FCDFC2] pb-2 inline-block">
              {isAr ? "قانوني" : "Legal"}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/terms-and-conditions" : "https://englishom.com/en/terms-and-conditions"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
                </a>
              </li>
              <li>
                <a
                  href={isAr ? "https://englishom.com/ar/privacy-policy" : "https://englishom.com/en/privacy-policy"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 {isAr ? "إنجلشوم (EnglishOM). جميع الحقوق محفوظة." : "EnglishOM. All rights reserved."}</p>
          <div className="flex gap-4">
            <a href="https://englishom.com/blog" className="hover:text-foreground transition-colors">
              {isAr ? "المدونة" : "Blog"}
            </a>
            <a href="https://englishom.com" className="hover:text-foreground transition-colors">
              EnglishOM.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
