import {
  FacebookIcon,
  InstagramIcon,
  SnapchatIcon,
  TelegramIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
  BlogIcon,
} from '@components/icons';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { useTranslation } from 'react-i18next';

export function LandingFooter() {
  const { t } = useTranslation();
  const currentLocale = useLocale();
  const isAr = currentLocale === 'ar';
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
      href: 'https://www.facebook.com/share/1JunPviNMg/',
      icon: FacebookIcon,
    },
    {
      href: 'https://www.snapchat.com/add/englishom_sa',
      icon: SnapchatIcon,
    },
    {
      href: 'https://www.instagram.com/englishom_sa?igsh=cTB6czYwYXR2Zmty',
      icon: InstagramIcon,
    },
    { href: 'https://t.me/Englishom_sa', icon: TelegramIcon },
    { href: 'https://wa.me/966542577250', icon: WhatsappIcon },
    {
      href: 'https://www.tiktok.com/@englishom_sa',
      icon: TiktokIcon,
    },
    { href: 'https://x.com/Englishom_sa', icon: XIcon },
    { href: 'https://www.youtube.com/@Englishom_sa', icon: YoutubeIcon },
    { href: 'https://englishom.com/blog', icon: BlogIcon },
  ] as const;
  const locale = isAr ? 'ar-EG' : 'en-US';
  let currentYear: number | string = new Date().getFullYear();
  currentYear = new Intl.NumberFormat(locale, {
    useGrouping: false,
  }).format(currentYear);
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
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

          {/* Test Your Language */}
          <div>
            <h3 className="mb-4 font-semibold">
              {isAr ? 'اختبر لغتك' : 'Test Your Language'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/ques"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {isAr ? 'مستوى الكفاءة' : 'Proficiency Level'}
                </a>
              </li>
              <li>
                <a
                  href="/test"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {isAr ? 'اكتشف مستواك' : 'Discover Your Level'}
                </a>
              </li>
              <li>
                <a
                  href="/test1"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {isAr ? 'مؤشر الإنجاز' : 'Achievement Index'}
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {isAr ? 'المدونة' : 'Blog'}
                </a>
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h3 className="mb-4 font-semibold">
              {t('Landing.footer.learning.title')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/Landingpage/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('Landing.footer.learning.startLearning')}
                </a>
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
  );
}
