import { RiyalSymbol } from '@components/icons';
import { Badge, type BadgeVariant } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import useLocale from '@hooks/use-locale';
import { localizedNumber } from '@lib/utils';
import { useLocalizedLevels } from '@modules/levels/queries';
import { Link } from '@shared/i18n/routing';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LevelsSection() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { localizedLevels } = useLocalizedLevels(locale);
  const badgeVariants: BadgeVariant[] = [
    'success',
    'secondary',
    'default',
    'info-pink',
    'info-blue',
    'info-purple',
  ];
  return (
    <section className="bg-accent/20 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            {t('Landing.levels.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.levels.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {localizedLevels.map(
            (
              { title, description, levelLabel, levelId, price, isAvailable },
              index
            ) => (
              <Card
                key={levelLabel}
                className="dark:bg-accent/30 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    {isAvailable ? (
                      <Badge
                        variant={badgeVariants[index % badgeVariants.length]}
                      >
                        {localizedNumber(50, locale)}{' '}
                        {locale === 'ar'
                          ? t('Global.suspendedAccount.day')
                          : t('Global.suspendedAccount.days')}
                      </Badge>
                    ) : (
                      <Badge variant={'info-yellow'}>
                        {t('Global.comingSoon')}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{title}</CardTitle>
                  <CardDescription className="text-base">
                    {description}
                  </CardDescription>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-primary flex items-center gap-1 text-3xl font-bold">
                      <RiyalSymbol className="size-4" />
                      {localizedNumber(price, locale)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex h-full flex-col">
                  <ul className="mb-6 space-y-3">
                    {t(`Landing.levels.${levelId}.features`, {
                      returnObjects: true,
                    }).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="text-primary h-5 w-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {isAvailable && (
                    <Button asChild className="mt-auto w-full">
                      <Link to="/app/levels/$id" params={{ id: levelId }}>
                        {t('Global.startLearning')}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
}
