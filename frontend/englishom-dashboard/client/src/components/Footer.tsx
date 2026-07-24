import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Youtube, MessageCircle, Home, Link, Smartphone, MessageSquare, Send } from 'lucide-react';

interface FooterProps {
  language?: 'ar' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language = 'ar' }) => {
  const isArabic = language === 'ar';

  const translations = {
    ar: {
      about: 'من نحن',
      aboutText: 'منصة متخصصة في تعليم اللغة الإنجليزية بطرق حديثة وفعّالة للمتعلمين من جميع أنحاء العالم.',
      quickLinks: 'روابط سريعة',
      home: 'الرئيسية',
      dashboard: 'لوحة البيانات',
      blog: 'المدونة',
      tests: 'الاختبارات',
      contact: 'اتصل بنا',
      contactInfo: 'معلومات التواصل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      followUs: 'تابعنا',
      legal: 'قانوني',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      copyright: 'جميع الحقوق محفوظة © 2026',
    },
    en: {
      about: 'About Us',
      aboutText: 'Platform specializes in teaching English with modern and effective methods for learners from around the world.',
      quickLinks: 'Quick Links',
      home: 'Home',
      dashboard: 'Dashboard',
      blog: 'Blog',
      tests: 'Tests',
      contact: 'Contact Us',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      followUs: 'Follow Us',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: 'All rights reserved © 2026',
    },
  };

  const t = translations[language];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-500/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12" dir={isArabic ? 'rtl' : 'ltr'}>
        {/* Main Footer Content */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12`}>
          {/* About Section */}
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-cyan-400" />
              {t.about}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{t.aboutText}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Link className="w-6 h-6 text-cyan-400" />
              {t.quickLinks}
            </h3>
            <ul className="space-y-2">
              {[
                { label: t.home, href: '/' },
                { label: t.dashboard, href: '/dashboard' },
                { label: t.blog, href: '#' },
                { label: t.tests, href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-cyan-400" />
              {t.contactInfo}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} className="text-cyan-400" />
                <span>info@englishom.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} className="text-cyan-400" />
                <span>{isArabic ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-cyan-400" />
              {t.followUs}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/share/1JunPviNMg/', label: 'Facebook', color: 'bg-blue-600' },
                { icon: Twitter, href: 'https://x.com/Englishom_sa', label: 'Twitter', color: 'bg-black' },
                { icon: Instagram, href: 'https://www.instagram.com/englishom_sa', label: 'Instagram', color: 'bg-pink-600' },
                { icon: Youtube, href: 'https://www.youtube.com/@Englishom_sa', label: 'YouTube', color: 'bg-red-600' },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all"
                    title={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            
            {/* Additional Social Media Platforms with SVG Icons */}
            <div className="mt-4 flex gap-3 flex-wrap">
              {[
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
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-all"
                  title={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/20 my-8"></div>

        {/* Bottom Footer */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isArabic ? 'rtl' : 'ltr'}`}>
          <p className="text-gray-400 text-sm">{t.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              {t.privacy}
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              {t.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
