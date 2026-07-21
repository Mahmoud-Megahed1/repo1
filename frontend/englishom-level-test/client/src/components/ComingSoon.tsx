import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function ComingSoon() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-[#120F0D] text-[#FCDFC2] ${isAr ? "rtl" : "ltr"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <Header />

      {/* Main Hero Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center w-full">
        <div className="w-full bg-[#1E1916] border border-[#4A3B32] rounded-3xl p-6 md:p-12 shadow-2xl overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Banner Image / Illustration */}
            <div className="order-2 lg:order-1 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#4A3B32]/60 shadow-xl max-w-lg w-full">
                <img
                  src="/coming-soon-banner.png"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = "true";
                      e.currentTarget.src = "https://englishom.com/coming-soon-banner.png";
                    }
                  }}
                  alt="اختبارات إنجلشوم الذكية"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2 text-center lg:text-start space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FCDFC2] leading-tight tracking-tight">
                {isAr ? "اختبارات إنجلشوم الذكية" : "Smart EnglishOM Tests"}
              </h1>

              <p className="text-lg md:text-2xl text-slate-300 font-medium leading-relaxed">
                {isAr
                  ? "نحن نجهز تجربة تقييم دقيقة وشاملة لك."
                  : "We are preparing a precise and comprehensive assessment experience for you."}
              </p>

              <div className="pt-2">
                <span className="inline-block text-2xl md:text-3xl font-extrabold text-[#D4AF37] bg-[#4A3B32]/40 border border-[#D4AF37]/40 px-6 py-3 rounded-2xl shadow-lg">
                  {isAr ? "قريباً سيكون الاختبار متاحاً" : "Soon the test will be available"}
                </span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
