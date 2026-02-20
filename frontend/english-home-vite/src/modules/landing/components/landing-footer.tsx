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
    { href: 'https://wa.me/qr/NLKCDGU2XBMEE1', icon: WhatsappIcon },
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

          {/* Quick Links */}
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
            </ul>
          </div>
        </div>

      </div>
      <div className="container mx-auto mt-8 border-t pt-8">
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <div className="bg-white/5 dark:bg-white/10 rounded-xl p-4 flex flex-wrap items-center justify-center gap-4 border border-border/10">
            <img
              src="/images/svgs/saudi-business-center.svg"
              alt="Saudi Business Center"
              className="h-8 object-contain dark:brightness-0 dark:invert"
            />
            <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-100 rounded-lg px-3 py-1">
              <img
                src="/images/svgs/mada.svg"
                alt="Mada"
                className="h-5 object-contain"
              />
              <svg width="100" height="28" viewBox="0 0 472 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
                <path d="M53.1 106.3C82.4271 106.3 106.2 82.5271 106.2 53.2C106.2 23.8729 82.4271 0.100006 53.1 0.100006C23.7729 0.100006 0 23.8729 0 53.2C0 82.5271 23.7729 106.3 53.1 106.3Z" fill="black" />
                <path d="M53.1 82.7C69.3923 82.7 82.6 69.4923 82.6 53.2C82.6 36.9077 69.3923 23.7 53.1 23.7C36.8077 23.7 23.6 36.9077 23.6 53.2C23.6 69.4923 36.8077 82.7 53.1 82.7Z" fill="white" />
                <path d="M165.2 106.3C194.527 106.3 218.3 82.5271 218.3 53.2C218.3 23.8729 194.527 0.100006 165.2 0.100006C135.873 0.100006 112.1 23.8729 112.1 53.2C112.1 82.5271 135.873 106.3 165.2 106.3Z" fill="black" />
                <path d="M165.2 82.7C181.492 82.7 194.7 69.4923 194.7 53.2C194.7 36.9077 181.492 23.7 165.2 23.7C148.908 23.7 135.7 36.9077 135.7 53.2C135.7 69.4923 148.908 82.7 165.2 82.7Z" fill="white" />
                <path d="M266.1 23.7H250.7V34.5H266.1V82.5C266.1 94.6 273.8 101.9 285.4 101.9C290.4 101.9 294.7 100.8 298.3 98.9L294.6 88.6C291.9 89.8 289.4 90.4 287.4 90.4C282.8 90.4 280.4 87.8 280.4 82.9V34.5H298.2V23.7H280.4V8.5H266.1V23.7Z" fill="black" />
                <path d="M344.2 22.9C327.3 22.9 313.3 33.7 308.5 48.1V23.7H294.2V101.1H308.1V94.1C313 101.8 323.5 107.1 338.7 107.1C361.3 107.1 379.5 89.4 379.5 65.1C379.5 40.7 361.9 22.9 344.2 22.9ZM335.7 93.4C322.3 93.4 312.3 84.7 308.5 73V57C312.4 45.4 322.3 36.6 335.7 36.6C352.4 36.6 364.7 48.7 364.7 65.1C364.7 81.4 352.4 93.4 335.7 93.4Z" fill="black" />
                <path d="M439 22.9C422.1 22.9 408.1 33.7 403.4 48.1V23.7H389V101.1H402.9V94.1C407.8 101.8 418.3 107.1 433.5 107.1C456.1 107.1 474.3 89.4 474.3 65.1C474.3 40.7 456.7 22.9 439 22.9ZM430.5 93.4C417.1 93.4 407.1 84.7 403.3 73V57C407.2 45.4 417.1 36.6 430.5 36.6C447.2 36.6 459.5 48.7 459.5 65.1C459.5 81.4 447.2 93.4 430.5 93.4Z" fill="black" />
              </svg>
              <img
                src="/images/svgs/apple-pay.svg"
                alt="Apple Pay"
                className="h-5 object-contain"
              />
              <img
                src="/images/svgs/visa.svg"
                alt="Visa"
                className="h-5 object-contain"
              />
              <img
                src="/images/svgs/mastercard.svg"
                alt="Mastercard"
                className="h-5 object-contain"
              />
              <svg width="100" height="28" viewBox="0 0 472 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
                <path d="M53.1 106.3C82.4271 106.3 106.2 82.5271 106.2 53.2C106.2 23.8729 82.4271 0.100006 53.1 0.100006C23.7729 0.100006 0 23.8729 0 53.2C0 82.5271 23.7729 106.3 53.1 106.3Z" fill="black" />
                <path d="M53.1 82.7C69.3923 82.7 82.6 69.4923 82.6 53.2C82.6 36.9077 69.3923 23.7 53.1 23.7C36.8077 23.7 23.6 36.9077 23.6 53.2C23.6 69.4923 36.8077 82.7 53.1 82.7Z" fill="white" />
                <path d="M165.2 106.3C194.527 106.3 218.3 82.5271 218.3 53.2C218.3 23.8729 194.527 0.100006 165.2 0.100006C135.873 0.100006 112.1 23.8729 112.1 53.2C112.1 82.5271 135.873 106.3 165.2 106.3Z" fill="black" />
                <path d="M165.2 82.7C181.492 82.7 194.7 69.4923 194.7 53.2C194.7 36.9077 181.492 23.7 165.2 23.7C148.908 23.7 135.7 36.9077 135.7 53.2C135.7 69.4923 148.908 82.7 165.2 82.7Z" fill="white" />
                <path d="M266.1 23.7H250.7V34.5H266.1V82.5C266.1 94.6 273.8 101.9 285.4 101.9C290.4 101.9 294.7 100.8 298.3 98.9L294.6 88.6C291.9 89.8 289.4 90.4 287.4 90.4C282.8 90.4 280.4 87.8 280.4 82.9V34.5H298.2V23.7H280.4V8.5H266.1V23.7Z" fill="black" />
                <path d="M344.2 22.9C327.3 22.9 313.3 33.7 308.5 48.1V23.7H294.2V101.1H308.1V94.1C313 101.8 323.5 107.1 338.7 107.1C361.3 107.1 379.5 89.4 379.5 65.1C379.5 40.7 361.9 22.9 344.2 22.9ZM335.7 93.4C322.3 93.4 312.3 84.7 308.5 73V57C312.4 45.4 322.3 36.6 335.7 36.6C352.4 36.6 364.7 48.7 364.7 65.1C364.7 81.4 352.4 93.4 335.7 93.4Z" fill="black" />
                <path d="M439 22.9C422.1 22.9 408.1 33.7 403.4 48.1V23.7H389V101.1H402.9V94.1C407.8 101.8 418.3 107.1 433.5 107.1C456.1 107.1 474.3 89.4 474.3 65.1C474.3 40.7 456.7 22.9 439 22.9ZM430.5 93.4C417.1 93.4 407.1 84.7 403.3 73V57C407.2 45.4 417.1 36.6 430.5 36.6C447.2 36.6 459.5 48.7 459.5 65.1C459.5 81.4 447.2 93.4 430.5 93.4Z" fill="black" />
              </svg>
            </div>
            <img
              src="/images/maroof_new.jpg"
              alt="Maroof"
              className="h-8 object-contain rounded-full border border-border/20"
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
