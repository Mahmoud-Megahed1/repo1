import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import useLocale from '@hooks/use-locale';
import { Link } from '@shared/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@components/contexts/theme-context';

export function HeroSection() {
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  const { dynamicTheme } = useTheme();

  let currentYear: number | string = new Date().getFullYear();
  currentYear = new Intl.NumberFormat(locale, {
    useGrouping: false,
  }).format(currentYear);

  const backgroundStyle = dynamicTheme?.assets?.backgroundImage
    ? {
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${dynamicTheme.assets.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
    : {};

  return (
    <section
      className="from-background via-background/80 to-accent/20 relative overflow-hidden bg-gradient-to-b py-20 lg:py-32"
      style={backgroundStyle}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="outline" className={`mb-6 px-4 py-2 text-sm ${dynamicTheme?.assets?.backgroundImage ? 'text-white border-white/50 bg-black/20 backdrop-blur-sm' : ''}`}>
            🚀 {t('Global.englishom')} {currentYear}
          </Badge>

          {/* Main Title */}
          <h1 className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md ${dynamicTheme?.assets?.backgroundImage ? 'text-white' : ''}`}>
            {t('Landing.hero.title')}{' '}
            <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent font-extrabold drop-shadow-sm">
              {t('Global.englishom')}
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className={`mb-6 text-xl font-semibold sm:text-2xl ${dynamicTheme?.assets?.backgroundImage ? 'text-zinc-200 drop-shadow-md' : 'text-muted-foreground'}`}>
            {t('Landing.hero.subtitle')}
          </h2>

          {/* Description */}
          <p className={`mx-auto mb-8 max-w-2xl text-lg ${dynamicTheme?.assets?.backgroundImage ? 'text-zinc-100 drop-shadow-md' : 'text-muted-foreground'}`}>
            {t('Landing.hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="group shadow-xl hover:shadow-2xl transition-all duration-300">
              <Link to="/signup">
                {t('Landing.hero.cta')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
        <div className="from-primary/30 to-primary/10 h-96 w-96 rounded-full bg-gradient-to-br blur-3xl" />
      </div>
    </section>
  );
}
