import { Mail, MapPin, MessageCircle, Youtube, Instagram, Send, Music2, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * Footer - The A1 Code
 * Design Philosophy: Professional with geometric accents
 * - Full language support
 * - Dark Mode compatible
 * - WhatsApp integration
 */

export default function Footer({ courseData }: { courseData?: any }) {
  const { language } = useLanguage();
  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <footer className="bg-[#222222] dark:bg-[#0a0a0a] text-white py-16 transition-colors duration-300">
      <div className="container">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 ${isRTL ? "text-right" : ""}`}>
          {/* Brand */}
          <div className="space-y-4">
            <a href="https://englishom.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/logo.jpeg" 
                alt="Englishom" 
                className="w-10 h-10 rounded-lg"
              />
              <h3 className="text-xl font-bold">Englishom</h3>
            </a>
            <p className="text-[#CCCCCC] text-sm leading-relaxed">
              {t.footer.brand.replace('60', courseData?.daysCount?.toString() || '60')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-[#CCCCCC]">
              {t.footer.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="hover:text-[#F5BB41] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">{t.footer.resources}</h4>
            <ul className="space-y-2 text-[#CCCCCC]">
              {t.footer.resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="hover:text-[#F5BB41] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">{t.footer.contact}</h4>
            <div className="space-y-3 text-[#CCCCCC]">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F5BB41] flex-shrink-0" />
                <a
                  href={`mailto:${t.footer.email}`}
                  className="hover:text-[#F5BB41] transition-colors"
                >
                  {t.footer.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#F5BB41] flex-shrink-0" />
                <a
                  href={`https://wa.me/${t.footer.whatsapp}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+%D8%A8%D9%83+%D9%81%D9%8A+Englishom+-+%D9%87%D9%84+%D9%84%D8%AF%D9%8A%D9%83+%D8%A3%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA%D8%9F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5BB41] transition-colors"
                >
                  {language === "ar" ? "واتساب" : "WhatsApp"}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F5BB41] mt-1 flex-shrink-0" />
                <span>{t.footer.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#444444] my-8"></div>

        {/* Payment & Trust Badges Section */}
        <div className="flex flex-col items-center justify-center gap-6 mb-8">
          <div className="bg-white/5 dark:bg-white/10 rounded-xl py-2 px-3 sm:px-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 border border-white/10 max-w-full">
            <img
              src="/images/svgs/saudi-business-center.svg"
              alt="Saudi Business Center"
              className="h-5 md:h-6 object-contain dark:brightness-0 dark:invert"
            />
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/90 dark:bg-zinc-100 rounded-lg px-2.5 py-1.5 max-w-full">
              <img
                src="/images/svgs/mada.svg"
                alt="Mada"
                className="h-4 md:h-6 object-contain"
              />
              <img
                src="/images/svgs/apple-pay.svg"
                alt="Apple Pay"
                className="h-4 md:h-6 object-contain"
              />
              <img
                src="/images/svgs/visa.svg"
                alt="Visa"
                className="h-5 md:h-7 object-contain"
              />
              <img
                src="/images/svgs/mastercard.svg"
                alt="Mastercard"
                className="h-4 md:h-6 object-contain"
              />
              <img
                src="/tamara.svg"
                alt="Tamara"
                className="h-5 md:h-8 aspect-[710/280] object-contain"
              />
            </div>
            <img
              src="/images/maroof_new.jpg"
              alt="Maroof"
              className="h-5 md:h-6 object-contain rounded-full border border-white/20"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-12 ${isRTL ? "text-right" : ""}`}>
          {/* Copyright */}
          <div className="text-[#CCCCCC] text-sm">
            <p>
              {t.footer.copyright} | {t.footer.poweredBy}{" "}
              <a
                href="https://englishom.com"
                className="text-[#F5BB41] hover:underline font-bold"
              >
                {t.footer.englishom}
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className={`flex gap-3 sm:gap-4 flex-wrap justify-center md:justify-end ${isRTL ? "pr-0 md:pr-24" : "pr-0 md:pr-24"} pb-16 md:pb-0`}>
            <a href="https://www.youtube.com/@EglishHOM" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#FF0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]" title="YouTube">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://x.com/englishom28264" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]" title="X">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.829 6.694h-3.328l7.691-8.794-8.182-10.706h6.564l4.853 6.361 5.286-6.361zM16.17 18.933h1.829L5.896 5.009H4.013l12.157 13.924z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@englishom1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-black hover:bg-[#25F4EE] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(37,244,238,0.4)]" title="TikTok">
              <Music2 className="w-5 h-5" />
            </a>
            <a href={`https://wa.me/${t.footer.whatsapp}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+%D8%A8%D9%83+%D9%81%D9%8A+Englishom+-+%D9%87%D9%84+%D9%84%D8%AF%D9%8A%D9%83+%D8%A3%D9%8A+%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA%D8%9F`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]" title="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="https://t.me/+xlzna51reL1hNzc0" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#0088cc] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,136,204,0.4)]" title="Telegram">
              <Send className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/englishom1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-gradient-to-r hover:from-[#f09433] hover:to-[#e6683c] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(230,104,60,0.4)]" title="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.snapchat.com/add/englishom25" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-black hover:bg-[#FFFC00] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,252,0,0.4)]" title="Snapchat">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.917-.236.14-.065.27-.1.399-.1.243 0 .442.09.573.262.168.225.176.522.028.822a1.547 1.547 0 0 1-.06.107c-.219.37-.737.597-1.464.67a3.414 3.414 0 0 0-.18.018c-.064.006-.148.015-.21.02a.612.612 0 0 0-.367.17c-.094.118-.13.283-.106.49.184 1.455.975 2.86 2.357 4.187a.85.85 0 0 1 .19.285c.072.213-.038.425-.28.567-1.074.634-2.235.77-3.3.88a32.7 32.7 0 0 0-.205.024c-.118.015-.177.045-.21.09-.066.087-.049.245-.032.378.011.09.024.18.024.27 0 .37-.225.638-.636.638a3.43 3.43 0 0 1-.637-.076 5.307 5.307 0 0 0-1.098-.137c-.416 0-.816.064-1.155.195a4.338 4.338 0 0 0-.774.448c-.564.39-1.201.832-2.2.832-.026 0-.053 0-.077-.002h-.06c-1-.002-1.637-.444-2.2-.833a4.357 4.357 0 0 0-.775-.45 3.496 3.496 0 0 0-1.154-.193c-.39 0-.772.043-1.098.137a3.426 3.426 0 0 1-.638.076c-.412 0-.636-.268-.636-.638 0-.09.012-.18.024-.27.017-.134.034-.29-.032-.378-.034-.046-.093-.076-.21-.09a34.12 34.12 0 0 0-.206-.025c-1.064-.11-2.225-.245-3.3-.88-.24-.14-.35-.353-.277-.566a.85.85 0 0 1 .19-.286c1.381-1.326 2.173-2.732 2.357-4.187.024-.207-.012-.372-.106-.49a.614.614 0 0 0-.366-.17 1.766 1.766 0 0 0-.21-.02 3.592 3.592 0 0 1-.18-.018c-.727-.073-1.245-.3-1.465-.67a1.508 1.508 0 0 1-.059-.107c-.148-.3-.14-.597.028-.822.13-.172.33-.262.573-.262.13 0 .26.035.398.1.258.116.618.22.917.236.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.3-4.847C7.648 1.069 11.004.793 11.994.793h.212z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/19wWacNacT/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]" title="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
