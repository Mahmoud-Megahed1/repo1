import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "./Header";
import Footer from "./Footer";

export default function ComingSoon() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-[#120F0D] text-[#FCDFC2] ${isAr ? "rtl" : "ltr"}`} dir={isAr ? "rtl" : "ltr"}>
      <Header />

      <main className="flex-1 flex items-center justify-center w-full relative overflow-hidden">
        {/* Full-width banner section */}
        <div className="w-full relative">
          {/* Dark gradient overlay on top half */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#120F0D] via-[#120F0D]/80 to-[#2A1F1A] pointer-events-none z-0"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Illustration Side */}
              <div className={`flex justify-center ${isAr ? "lg:order-2" : "lg:order-1"}`}>
                <div className="relative w-full max-w-md lg:max-w-lg">
                  <img
                    src="/ques/test-illustration.png"
                    alt={isAr ? "اختبارات إنجلشوم الذكية" : "Smart EnglishOM Tests"}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className={`text-center lg:text-start space-y-6 ${isAr ? "lg:order-1" : "lg:order-2"}`}>
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#FCDFC2] leading-tight tracking-tight">
                  {isAr ? "اختبارات إنجلشوم الذكية" : "Smart EnglishOM Tests"}
                </h1>

                <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed">
                  {isAr
                    ? "نحن نجهز تجربة تقييم دقيقة وشاملة لك."
                    : "We are preparing a precise and comprehensive assessment experience for you."}
                </p>

                <div className="pt-4">
                  <span className="inline-block text-xl md:text-2xl lg:text-3xl font-extrabold text-[#FCDFC2] leading-snug">
                    {isAr ? "قريباً سيكون الاختبار متاحاً" : "Soon the test will be available"}
                  </span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Bottom dark bar accent */}
          <div className="w-full h-16 bg-gradient-to-t from-[#120F0D] to-transparent"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
