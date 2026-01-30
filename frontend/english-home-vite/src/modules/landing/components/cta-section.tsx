import { Button } from '@components/ui/button';
import { Link } from '@shared/i18n/routing';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-20 lg:py-32">
      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          {/* Rating */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              {t('Landing.stats.success.number')}{' '}
              {t('Landing.stats.success.label')}
            </span>
          </div>

          {/* Main Content */}
          <h2 className="mb-6 text-3xl font-bold lg:text-5xl">
            {t('Landing.cta.title')}
          </h2>

          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl md:text-xl">
            {t('Landing.cta.subtitle')}
          </p>

          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl md:text-lg">
            {t('Landing.cta.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group px-8 py-6 text-lg">
              <Link to="/signup">
                {t('Landing.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg"
              asChild
            >
              <Link to={`/#levels` as never}>{t('Landing.cta.secondary')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
