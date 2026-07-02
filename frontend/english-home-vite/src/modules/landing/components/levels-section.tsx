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

import { RiyalSymbol } from '@components/icons';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import useLocale from '@hooks/use-locale';
import { cn, localizedNumber } from '@lib/utils';
import { useLocalizedLevels } from '@modules/levels/queries';
import { Link } from '@shared/i18n/routing';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LevelsSection() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { localizedLevels } = useLocalizedLevels(locale);

  const getGradient = (id: string) => {
    switch (id) {
      case 'LEVEL_A1': return 'from-[#279B5A] via-[#279B5A]/20 to-transparent';
      case 'LEVEL_A2': return 'from-[#E27625] via-[#E27625]/20 to-transparent';
      case 'LEVEL_B1': return 'from-[#D4A346] via-[#D4A346]/20 to-transparent';
      case 'LEVEL_B2': return 'from-[#D94579] via-[#D94579]/20 to-transparent';
      case 'LEVEL_C1': return 'from-[#297BCE] via-[#297BCE]/20 to-transparent';
      case 'LEVEL_C2': return 'from-[#8A21C6] via-[#8A21C6]/20 to-transparent';
      default: return 'from-gray-600 via-gray-900/20 to-transparent';
    }
  };

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
              { title, description, levelLabel, levelId, price, originalPrice, isAvailable, showPrice = true, daysCount = 50 }
            ) => (
              <Card
                key={levelLabel}
                className="relative overflow-hidden border-none bg-[#1C1C1E] text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col min-h-[500px]"
              >
                {/* Top Gradient Overlay */}
                <div className={cn("absolute inset-0 h-2/3 bg-gradient-to-b opacity-80 pointer-events-none", getGradient(levelId))} />

                {/* Days Badge */}
                <div className="absolute top-4 rtl:left-4 ltr:right-4 z-10">
                  <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                    {isAvailable ? (
                      <>
                        {localizedNumber(daysCount, locale)}{' '}
                        {locale === 'ar'
                          ? t('Global.suspendedAccount.day')
                          : t('Global.suspendedAccount.days')}
                      </>
                    ) : (
                      t('Global.comingSoon')
                    )}
                  </span>
                </div>

                <CardHeader className="relative z-10 pt-10 text-center pb-2">
                  <div className="text-lg font-medium mb-1 drop-shadow-md">
                    ({locale === 'ar' ? 'مسار' : 'Track'} {levelLabel})
                  </div>
                  <CardTitle className="text-2xl font-bold drop-shadow-md">{title}</CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-col flex-grow space-y-6 pt-2">
                  {/* Price Area */}
                  {showPrice && isAvailable && (
                    <div className="flex flex-col items-center justify-center min-h-[70px]">
                      <span className="text-white flex items-center gap-1 text-4xl font-bold">
                        {localizedNumber(price, locale)}
                        <RiyalSymbol className="size-5 ml-1 text-gray-300" />
                      </span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-gray-400 flex items-center gap-1 text-lg line-through mt-0.5">
                          {localizedNumber(originalPrice, locale)}
                          <RiyalSymbol className="size-3 ml-0.5" />
                        </span>
                      )}
                    </div>
                  )}

                  {/* Features List */}
                  <div className="w-fit mx-auto flex-grow">
                    <ul className="space-y-2.5">
                      {(
                        t(`Landing.levels.${levelId}.features`, {
                          returnObjects: true,
                        }) as string[] || []
                      ).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-3 text-sm text-gray-200">
                          <Check className="text-white h-4 w-4 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Start Learning / Coming Soon Button */}
                  <div className="pt-4 mt-auto">
                    {isAvailable ? (
                      <Button asChild className="w-full bg-white text-black hover:bg-gray-100 font-bold py-5 rounded-lg">
                        <Link to="/app/levels/$id" params={{ id: levelId }}>
                          {t('Global.startLearning')}
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-5 rounded-lg border-none">
                        {t('Global.comingSoon')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
}
