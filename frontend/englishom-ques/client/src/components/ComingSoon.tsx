import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "./Header";
import Footer from "./Footer";
import { AlertCircle, Clock, Sparkles } from "lucide-react";

export default function ComingSoon() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-[#120F0D] text-[#FCDFC2] font-sans ${isAr ? "rtl" : "ltr"}`} dir={isAr ? "rtl" : "ltr"}>
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center w-full relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4A3B32]/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative w-full max-w-4xl mx-auto text-center space-y-12 z-10">
          
          <div className="inline-flex items-center justify-center space-x-2 space-x-reverse bg-[#1E1916]/80 backdrop-blur-md border border-[#4A3B32]/60 px-6 py-2.5 rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-lg font-semibold text-[#D4AF37] tracking-wide">
              {isAr ? "تحديث جديد" : "New Update"}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#FCDFC2] via-white to-[#D4AF37] leading-tight tracking-tight drop-shadow-sm">
            {isAr ? "قريباً جداً" : "Coming Very Soon"}
          </h1>

          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-xl md:text-3xl text-slate-300 font-medium leading-relaxed drop-shadow-sm">
              {isAr 
                ? "نحن نعمل بشغف على تجهيز تجربة تقييم دقيقة وشاملة تليق بك." 
                : "We are passionately preparing a precise and comprehensive assessment experience worthy of you."}
            </p>
            <p className="text-base md:text-lg text-slate-400 font-normal">
              {isAr
                ? "سيتم إطلاق الاختبار قريباً، شكراً لصبركم وثقتكم بنا."
                : "The test will be launched shortly, thank you for your patience and trust."}
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center bg-[#1E1916]/60 backdrop-blur-xl border border-[#4A3B32]/40 rounded-2xl p-6 min-w-[140px] shadow-2xl transform transition-transform hover:scale-105">
              <Clock className="w-10 h-10 text-[#D4AF37] mb-3 opacity-90" />
              <span className="text-sm text-slate-400 font-medium mb-1">{isAr ? "الوضع الحالي" : "Current Status"}</span>
              <span className="text-lg font-bold text-white">{isAr ? "قيد التجهيز" : "In Progress"}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-[#1E1916]/60 backdrop-blur-xl border border-[#4A3B32]/40 rounded-2xl p-6 min-w-[140px] shadow-2xl transform transition-transform hover:scale-105">
              <AlertCircle className="w-10 h-10 text-[#D4AF37] mb-3 opacity-90" />
              <span className="text-sm text-slate-400 font-medium mb-1">{isAr ? "مستوى الاختبار" : "Test Level"}</span>
              <span className="text-lg font-bold text-white">{isAr ? "متقدم وذكي" : "Advanced & Smart"}</span>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
