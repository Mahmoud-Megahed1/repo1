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

export default function Footer() {
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
              {t.footer.brand}
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
                  href={`https://wa.me/${t.footer.whatsapp}`}
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

        {/* Bottom Section */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isRTL ? "text-right" : ""}`}>
          {/* Copyright */}
          <div className="text-[#CCCCCC] text-sm">
            <p>
              {t.footer.copyright} | {t.footer.poweredBy}{" "}
              <a
                href="https://englishom.com"
                className="text-[#F5BB41] hover:underline"
              >
                {t.footer.englishom}
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className={`flex gap-3 flex-wrap ${isRTL ? "justify-start" : "justify-end"}`}>
            <a href="https://www.youtube.com/@englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FF0000] hover:bg-[#CC0000] flex items-center justify-center transition-all duration-300 hover:scale-110" title="YouTube">
              <Youtube className="w-5 h-5 text-white" />
            </a>
            <a href="https://x.com/englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#000000] hover:bg-[#333333] flex items-center justify-center transition-all duration-300 hover:scale-110" title="X">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.694-5.829 6.694h-3.328l7.691-8.794-8.182-10.706h6.564l4.853 6.361 5.286-6.361zM16.17 18.933h1.829L5.896 5.009H4.013l12.157 13.924z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#25F4EE] hover:bg-[#00D9D4] flex items-center justify-center transition-all duration-300 hover:scale-110" title="TikTok">
              <Music2 className="w-5 h-5 text-black" />
            </a>
            <a href={`https://wa.me/${t.footer.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#25D366] hover:bg-[#1FA855] flex items-center justify-center transition-all duration-300 hover:scale-110" title="WhatsApp">
              <MessageCircle className="w-5 h-5 text-white" />
            </a>
            <a href="https://t.me/englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#0088cc] hover:bg-[#006699] flex items-center justify-center transition-all duration-300 hover:scale-110" title="Telegram">
              <Send className="w-5 h-5 text-white" />
            </a>
            <a href="https://www.instagram.com/englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#f09433] to-[#e6683c] hover:from-[#d66d2d] hover:to-[#d6573d] flex items-center justify-center transition-all duration-300 hover:scale-110" title="Instagram">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href="https://www.snapchat.com/add/englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#FFFC00] hover:bg-[#E6E600] flex items-center justify-center transition-all duration-300 hover:scale-110" title="Snapchat">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/></svg>
            </a>
            <a href="https://www.facebook.com/englishom" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[#1877F2] hover:bg-[#1565D8] flex items-center justify-center transition-all duration-300 hover:scale-110" title="Facebook">
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
