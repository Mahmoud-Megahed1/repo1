import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  language?: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const translations = {
    ar: {
      brandDesc: 'نصمم، نبرمج، ونطور أنظمة تفاعلية وحلولاً تقنية متقدمة لمعالجة البيانات الصوتية والنصوص الذكية لتعزيز الممارسة اللغوية الذاتية.',
      testYourLanguage: 'اختبر لغتك',
      proficiencyLevel: 'مستوى الكفاءة',
      discoverLevel: 'اكتشف مستواك',
      achievementIndex: 'مؤشر الإنجاز',
      blog: 'المدونة',
      learning: 'التدريب والممارسة',
      startLearning: 'ابدأ الممارسة الذكية',
      login: 'تسجيل الدخول',
      support: 'الدعم',
      userGuide: 'دليل المستخدم',
      contactUs: 'اتصل بنا',
      legal: 'قانوني',
      terms: 'الشروط والأحكام',
      privacy: 'سياسة الخصوصية',
      copyright: '© 2026 إنجلشوم. جميع الحقوق محفوظة.',
    },
    en: {
      brandDesc: 'We design, code, and develop interactive systems and advanced technical solutions for voice and text processing to enhance language self-practice.',
      testYourLanguage: 'Test Your Language',
      proficiencyLevel: 'Proficiency Level',
      discoverLevel: 'Discover Your Level',
      achievementIndex: 'Achievement Index',
      blog: 'Blog',
      learning: 'Training & Practice',
      startLearning: 'Start Smart Practice',
      login: 'Login',
      support: 'Support',
      userGuide: 'User Guide',
      contactUs: 'Contact Us',
      legal: 'Legal',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      copyright: '© 2026 Englishom. All rights reserved.',
    }
  };

  const t = translations[language];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1JunPviNMg/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/Englishom_sa', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/englishom_sa?igsh=cTB6czYwYXR2Zmty', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@Englishom_sa', label: 'YouTube' },
  ];

  const svgSocials = [
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@englishom_sa',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 1 1-4.77-2.3A2.4 2.4 0 0 1 9.1 13.66V9.58a6.8 6.8 0 0 0-6.8 6.8 6.81 6.81 0 0 0 6.8 6.8 6.8 6.8 0 0 0 6.8-6.8V11.1a8.5 8.5 0 0 0 5.78 2.25z" />
        </svg>
      ),
    },
    {
      label: 'Snapchat',
      href: 'https://www.snapchat.com/add/englishom_sa',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-7 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.5 6c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4zm0-10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      ),
    },
    {
      label: 'Telegram',
      href: 'https://t.me/Englishom_sa',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 8.5c-.3 2.5-1.5 8.5-2.1 11-.3 1.5-.9 2-1.8 2.1-1.5.2-2.6-1-4-2-2.3-1.5-3.6-2.4-5.8-3.8-1.9-1.2-.7-1.8 1-3 .7-.7 3.5-3.2 3.6-3.5.1-.3.1-.8-.2-1.1-.3-.3-.8-.2-1.1-.1l-4.5 2.8c-1-.3-2.2-.6-3.2-.5-.9.1-1.5.5-1.7 1.3-.3 1.2.5 2.5 1.5 3.5.5.5 1.8 1.5 3 2.5-1.3 1.2-2.5 2.2-3.5 3-.5.4-.8 1-.5 1.6.3.6.9.8 1.5.8.8 0 1.5-.3 2.2-.8 1.5-1.1 3-2.2 4.5-3.3 1.5 1.1 3-2.2 4.5-3.3.7.5 1.4.8 2.2.8.6 0 1.2-.2 1.5-.8.3-.6 0-1.2-.5-1.6-1-1-2.2-2-3.5-3 1.2-1 2.5-2 3-2.5 1-1 1.8-2.3 1.5-3.5z" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/966542577250',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52.075-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171c-1.519.761-2.835 1.844-3.797 3.21C2.865 10.331 2.517 11.9 2.517 13.5c0 1.585.348 3.15 1.007 4.59l-1.07 3.899 3.993-1.068c1.429.779 3.031 1.188 4.782 1.188h.005c5.305 0 9.62-4.317 9.62-9.62 0-2.57-1.005-4.986-2.833-6.815-1.828-1.828-4.244-2.834-6.815-2.834" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-500/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-full space-y-4 lg:col-span-1">
            <div className="text-cyan-400 font-bold text-2xl">
              {isArabic ? 'إنجلشوم' : 'ENGLISHOM'}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.brandDesc}
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-cyan-500/10 hover:bg-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-500/20"
                    title={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
              {svgSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-cyan-500/10 hover:bg-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-500/20"
                  title={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Test Your Language */}
          <div>
            <h3 className="text-cyan-400 font-semibold mb-4 text-base">
              {t.testYourLanguage}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/ques" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.proficiencyLevel}
                </a>
              </li>
              <li>
                <a href="/test" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.discoverLevel}
                </a>
              </li>
              <li>
                <a href="/progress" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.achievementIndex}
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.blog}
                </a>
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-cyan-400 font-semibold mb-4 text-base">
              {t.learning}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/signup" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.startLearning}
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.login}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-cyan-400 font-semibold mb-4 text-base">
              {t.support}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/user-guide" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.userGuide}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.contactUs}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-cyan-400 font-semibold mb-4 text-base">
              {t.legal}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/terms-and-conditions" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.terms}
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {t.privacy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/20 my-8"></div>

        {/* Bottom Footer */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isArabic ? 'rtl' : 'ltr'}`}>
          <p className="text-gray-400 text-sm">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
