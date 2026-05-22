import { Menu, X, Moon, Sun, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

/**
 * Navigation Header - The A1 Code
 * Design Philosophy: Geometric Modernism with clean navigation
 * - Sticky header with cream gold accent
 * - Mobile-responsive with hamburger menu
 * - Language switcher and Dark Mode toggle
 */

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, isDark, setIsDark } = useLanguage();
  const t = translations[language];

  const navLinks = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.engine, href: "#engine" },
    { label: t.nav.outcomes, href: "#outcomes" },
    { label: t.nav.pricing, href: "#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#1a1a1a] shadow-md transition-colors duration-300">
      <nav className="container flex items-center justify-between py-4">
        {/* Logo with Englishom Brand */}
        <a href="https://englishom.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.jpeg" 
            alt="Englishom" 
            className="w-10 h-10 rounded-lg"
          />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-[#1F6BF6] dark:text-[#F5BB41]">
              Englishom
            </h1>
            <p className="text-xs text-[#666666] dark:text-[#CCCCCC]">
              {language === "ar" ? "شفرتك الخاصة" : "Your Code"}
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#666666] dark:text-[#CCCCCC] hover:text-[#1F6BF6] dark:hover:text-[#F5BB41] font-medium transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-[#F8F9FA] dark:bg-[#2a2a2a] rounded-lg p-1">
            <button
              onClick={() => setLanguage("ar")}
              className={`px-3 py-1.5 rounded transition-all duration-300 ${
                language === "ar"
                  ? "bg-[#F5BB41] text-[#222222] font-bold"
                  : "text-[#666666] dark:text-[#CCCCCC] hover:text-[#1F6BF6]"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded transition-all duration-300 ${
                language === "en"
                  ? "bg-[#1F6BF6] text-white font-bold"
                  : "text-[#666666] dark:text-[#CCCCCC] hover:text-[#1F6BF6]"
              }`}
            >
              EN
            </button>
          </div>

          {/* WhatsApp Support Button */}
          <a
            href={`https://wa.me/${t.footer.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#25D366] hover:bg-[#1FA855] rounded-lg transition-all duration-300 hover:scale-110"
            title={language === "ar" ? "الدعم عبر واتساب" : "WhatsApp Support"}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-[#F5BB41]" />
            ) : (
              <Moon className="w-5 h-5 text-[#1F6BF6]" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-[#F8F9FA] dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#1F6BF6]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1F6BF6]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#1a1a1a] border-t border-[#E0E0E0] dark:border-[#333333]">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-[#666666] dark:text-[#CCCCCC] hover:text-[#1F6BF6] dark:hover:text-[#F5BB41] font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
