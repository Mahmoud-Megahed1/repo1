import LanguageSwitcher from '@components/language-switcher';
import ThemeSwitcher from '@components/theme-switcher';
import { Button } from '@components/ui/button';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LandingHeader() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
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

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button asChild>
              <Link to="/signup">{t('Landing.hero.cta')}</Link>
            </Button>
            <ThemeSwitcher />
            <Button variant="ghost" asChild>
              <LanguageSwitcher>
                <Globe className="text-muted-foreground size-4" />{' '}
                {locale === 'ar' ? 'الانجليزية' : 'Arabic'}
              </LanguageSwitcher>
            </Button>
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
              <div className="space-y-3 border-t pt-4">
                <Button variant="ghost" asChild>
                  <LanguageSwitcher>
                    <Globe className="text-muted-foreground" />{' '}
                    {locale === 'ar' ? 'الانجليزية' : 'Arabic'}
                  </LanguageSwitcher>
                </Button>
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/login">{t('Landing.header.cta.login')}</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/signup">{t('Landing.hero.cta')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
