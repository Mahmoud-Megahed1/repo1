import LanguageSwitcher from '@components/language-switcher';
import ThemeSwitcher from '@components/theme-switcher';
import { Button } from '@components/ui/button';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@components/contexts/theme-context';

export function LandingHeader() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const { dynamicTheme } = useTheme();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpeg"
              alt="Englishom"
              className="h-10 w-auto rounded-md"
            />
            {dynamicTheme?.assets?.logo && (
              <img
                src={dynamicTheme.assets.logo}
                alt={dynamicTheme.name}
                className="h-12 w-auto animate-pulse"
              />
            )}
            <div className="text-primary text-lg font-bold md:text-2xl">
              {t('Global.englishom')}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              to={'/#features' as never}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.features')}
            </Link>
            <Link
              to={'/#levels' as never}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.levels')}
            </Link>
            <Link
              to={'/#testimonials' as never}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.reviews')}
            </Link>
            <Link
              to={'/#faq' as never}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.faq')}
            </Link>
            <Link
              to="/our-vision"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.ourVision')}
            </Link>
            <Link
              to={'/#about' as never}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.about')}
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {t('Landing.header.navigation.contact')}
            </Link>
          </nav>

          {/* Always visible Toggles (Mobile + Desktop) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <LanguageSwitcher className="flex size-10 items-center justify-center rounded-full bg-accent font-bold transition-colors hover:bg-accent/80">
              {locale === 'ar' ? (
                <span className="text-lg">En</span>
              ) : (
                <span className="font-arabic text-lg">ع</span>
              )}
            </LanguageSwitcher>
            
            <div className="scale-90 md:scale-100">
              <ThemeSwitcher />
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden items-center md:flex">
              <Button asChild>
                <Link to="/signup">{t('Landing.header.cta.signup')}</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-background absolute left-0 w-full border-t md:hidden">
            <div className="container space-y-4 py-4">
              {/* Mobile Menu Links */}
              <Link
                to={'/#features' as never}
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.features')}
              </Link>
              <Link
                to={'/#levels' as never}
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.levels')}
              </Link>
              <Link
                to={'/#testimonials' as never}
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.reviews')}
              </Link>
              <Link
                to={'/#faq' as never}
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.faq')}
              </Link>
              <Link
                to="/our-vision"
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.ourVision')}
              </Link>
              <Link
                to={'/#about' as never}
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.about')}
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary block text-sm font-medium transition-colors"
              >
                {t('Landing.header.navigation.contact')}
              </Link>

              {/* Mobile CTA */}
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/login">{t('Landing.header.cta.login')}</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/signup">{t('Landing.header.cta.signup')}</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
