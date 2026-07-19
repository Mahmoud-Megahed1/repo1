import { useLocalization } from "@/contexts/LocalizationContext";
import { ENGLISHOM_COLORS } from "@/constants/colors";

export default function Footer() {
  const { language } = useLocalization();
  const isAr = language === "ar";

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 py-12 px-4 md:px-8" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Blog Dedicated Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur text-center md:text-start flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ENGLISHOM_COLORS.primary }} />
              {isAr ? "إنجلشوم | المدونة" : "EnglishOM | Blog"}
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {isAr
                ? "دليلك الذكي في رحلة التعلم. نضع بين يديك أحدث الاستراتيجيات، النصائح، والحلول التقنية التي صُممت خصيصاً لتعزيز ممارستك اليومية وقيادتك نحو الطلاقة"
                : "Your smart guide in the learning journey. We bring you the latest strategies, tips, and tech solutions tailored to boost your daily practice and lead you to fluency."}
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: "Facebook", href: "https://facebook.com", icon: "facebook", bg: "bg-blue-600 hover:bg-blue-700" },
              { name: "Snapchat", href: "https://snapchat.com", icon: "snapchat", bg: "bg-yellow-500 hover:bg-yellow-600" },
              { name: "Instagram", href: "https://instagram.com", icon: "instagram", bg: "bg-pink-600 hover:bg-pink-700" },
              { name: "WhatsApp", href: "https://whatsapp.com", icon: "whatsapp", bg: "bg-green-600 hover:bg-green-700" },
              { name: "TikTok", href: "https://tiktok.com", icon: "tiktok", bg: "bg-slate-800 hover:bg-slate-700" },
              { name: "X", href: "https://x.com", icon: "x", bg: "bg-slate-800 hover:bg-slate-700" },
              { name: "YouTube", href: "https://youtube.com", icon: "youtube", bg: "bg-red-600 hover:bg-red-700" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className={`w-9 h-9 rounded-full ${social.bg} text-white flex items-center justify-center transition-all shadow-md hover:scale-105 text-xs font-semibold`}
              >
                {social.name.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          
          {/* Column 1: Test Your Language (اختبر لغتك) */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b-2 pb-2 inline-block" style={{ borderBottomColor: ENGLISHOM_COLORS.primary }}>
              {isAr ? "اختبر لغتك" : "Test Your Language"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="https://englishom.com/ques"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-primary">●</span>
                  {isAr ? "مستوى الكفاءة" : "Efficiency Level"}
                </a>
              </li>
              <li>
                <a
                  href="https://englishom.com/test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-primary">●</span>
                  {isAr ? "اكتشف مستواك" : "Discover Your Level"}
                </a>
              </li>
              <li>
                <a
                  href="https://englishom.com/test1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="text-xs text-primary">●</span>
                  {isAr ? "مؤشر الإنجاز" : "Achievement Indicator"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Training & Practice */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b-2 pb-2 inline-block" style={{ borderBottomColor: ENGLISHOM_COLORS.primary }}>
              {isAr ? "التدريب والممارسة" : "Training & Practice"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  {isAr ? "أبدأ الممارسة الذكية" : "Start Smart Practice"}
                </a>
              </li>
              <li>
                <a href="/blog/admin/login" className="hover:text-white transition-colors">
                  {isAr ? "تسجيل الدخول" : "Login"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b-2 pb-2 inline-block" style={{ borderBottomColor: ENGLISHOM_COLORS.primary }}>
              {isAr ? "الدعم" : "Support"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  {isAr ? "دليل المستخدم" : "User Guide"}
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  {isAr ? "اتصل بنا" : "Contact Us"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white border-b-2 pb-2 inline-block" style={{ borderBottomColor: ENGLISHOM_COLORS.primary }}>
              {isAr ? "قانوني" : "Legal"}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {isAr ? "إنجلشوم (EnglishOM). جميع الحقوق محفوظة." : "EnglishOM. All rights reserved."}</p>
          <div className="flex gap-4">
            <a href="/blog" className="hover:text-slate-300 transition-colors">
              {isAr ? "المدونة" : "Blog"}
            </a>
            <a href="https://englishom.com" className="hover:text-slate-300 transition-colors">
              EnglishOM.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
