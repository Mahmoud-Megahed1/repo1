import { useState } from 'react';
import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  TelegramIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from '@components/icons';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { useTranslation } from 'react-i18next';

export function LandingFooter() {
  const { t } = useTranslation();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const keys = [
    {
      key: 'features',
      href: '/#features',
    },
    {
      key: 'levels',
      href: '/#levels',
    },
    {
      key: 'reviews',
      href: '/#testimonials',
    },
    {
      key: 'about',
      href: '/#about',
    },
    {
      key: 'ourVision',
      href: '/our-vision',
    },
    {
      key: 'contact',
      href: '/contact',
    },
  ] as const;
  const socialLinks = [
    {
      href: 'https://www.facebook.com/share/19wWacNacT/',
      icon: FacebookIcon,
    },
    {
      href: 'https://www.snapchat.com/add/englishom25',
      icon: SnapchatIcon,
    },
    {
      href: 'https://www.instagram.com/englishom1',
      icon: InstagramIcon,
    },
    { href: 'https://t.me/+xlzna51reL1hNzc0', icon: TelegramIcon },
    { href: 'https://wa.me/966542577250', icon: WhatsappIcon },
    {
      href: 'https://www.tiktok.com/@englishom1?_t=ZS-8zrqZgIC37K&_r=1',
      icon: TiktokIcon,
    },
    { href: 'https://x.com/englishom28264', icon: XIcon },
    { href: 'https://www.youtube.com/@EglishHOM', icon: YoutubeIcon },
  ] as const;
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  let currentYear: number | string = new Date().getFullYear();
  currentYear = new Intl.NumberFormat(locale, {
    useGrouping: false,
  }).format(currentYear);
  return (
    <>
      <footer className="bg-muted/30 border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-full space-y-4 lg:col-span-1">
            <div className="text-primary text-2xl font-bold">
              {t('Global.englishom')}
            </div>
            <p className="text-muted-foreground text-sm">
              {t('Landing.footer.brand.description')}
            </p>
            <ul className="flex flex-wrap items-center gap-2">
              {socialLinks.map(({ href, icon: Icon }, index) => (
                <li key={index}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Temporarily hidden until certification is issued
          <div>
            <h3 className="mb-4 font-semibold">
              {t('Landing.footer.quickLinks.title')}
            </h3>
            <ul className="space-y-2 text-sm">
              {keys.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    to={href as never}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`Landing.footer.quickLinks.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          */}

          {/* Learning */}
          <div>
            <h3 className="mb-4 font-semibold">
              {t('Landing.footer.learning.title')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/signup"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.learning.startLearning')}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.learning.login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">
              {t('Landing.footer.support.title')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/user-guide"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.support.userGuide')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.support.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">
              {t('Landing.footer.legal.title')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.legal.termsAndConditions')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.legal.privacyPolicy')}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowDisclaimer(true)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left rtl:text-right w-full bg-transparent border-0 p-0 cursor-pointer"
                >
                  {useLocale() === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
      <div className="container mx-auto mt-8 border-t pt-8 pb-16 md:pb-0">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <div className="bg-white/5 dark:bg-white/10 rounded-xl py-2 px-3 sm:px-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 border border-border/10 max-w-full">
            <img
              src="/images/svgs/saudi-business-center.svg"
              alt="Saudi Business Center"
              className="h-5 md:h-6 object-contain dark:brightness-0 dark:invert"
            />
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/50 dark:bg-zinc-100 rounded-lg px-2.5 py-1.5 max-w-full">
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
                src="/tamara.svg?v=2"
                alt="Tamara"
                className="h-5 md:h-8 aspect-[710/280] object-contain"
              />
            </div>
            <img
              src="/images/maroof_new.jpg"
              alt="Maroof"
              className="h-5 md:h-6 object-contain rounded-full border border-border/20"
            />
          </div>
        </div>
        <div className="text-muted-foreground mt-8 text-center text-sm">
          <p>
            © {currentYear} {t('Global.englishom')}.{' '}
            {t('Landing.footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
      
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-card text-foreground border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-right"
            dir={useLocale() === 'ar' ? "rtl" : "ltr"}
          >
            <button
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-xl font-bold mb-4 mt-2 text-center md:text-start">
              {useLocale() === 'ar' ? "إخلاء المسؤولية" : "Disclaimer"}
            </h3>
            
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-justify mb-2 whitespace-pre-line">
              {useLocale() === 'ar' ? (
                "جميع المقالات والمحتويات المنشورة في هذه المدونة هي لأغراض تثقيفية وتعليمية عامة، وتُمثل وجهات نظر كتابها بناءً على الأبحاث والمصادر المتاحة. المسميات الوظيفية والتحريرية المذكورة (مثل: خبير، مستشار، أخصائي) تُستخدم في سياقها التحريري لإبراز زاوية الطرح وتخصص المقال، ولا تُعد بديلة عن الاستشارات المهنية والرسمية المباشرة. لا تتحمل المنصة أي مسؤولية قانونية عن قرارات يُتخذ بناءً على المعلومات الواردة في الموقع."
              ) : (
                "All articles and content published on this blog are provided for general educational and informational purposes only, based on available research and resources. Editorial titles (such as Expert, Consultant, or Specialist) are used in a stylistic context to define the topic's scope and do not constitute legal, medical, or formal professional advice. The platform assumes no liability for actions taken based on the information provided herein."
              )}
            </p>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                {useLocale() === 'ar' ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
