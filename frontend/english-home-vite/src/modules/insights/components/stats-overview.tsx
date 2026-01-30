import useInsights from '@hooks/use-insights';
import useLocale from '@hooks/use-locale';
import { localizeNumber } from '@lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Progress } from '@ui/progress';
import { Award, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatsOverview = () => {
  const { t } = useTranslation();
  const {
    completedLevels,
    overallProgress,
    totalDaysCompleted,
    totalLevels,
    unlockedLevels,
  } = useInsights();
  const locale = useLocale();
  const locNum = localizeNumber(locale);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('App.dashboard.stats.totalProgress')}
          </CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {locNum(Math.round(overallProgress))}%
          </div>
          <p className="text-muted-foreground text-xs">
            {t('App.dashboard.stats.levelsCompleted', {
              completed: locNum(completedLevels.length),
              total: locNum(totalLevels),
            })}
          </p>
          <Progress value={overallProgress} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('App.dashboard.stats.daysCompleted')}
          </CardTitle>
          <Calendar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locNum(totalDaysCompleted)}</div>
          <p className="text-muted-foreground text-xs">
            {t('App.dashboard.stats.daysSubtitle')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('App.dashboard.stats.unlockedLevels')}
          </CardTitle>
          <BookOpen className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{locNum(unlockedLevels)}</div>
          <p className="text-muted-foreground text-xs">
            {t('App.dashboard.stats.levelsSubtitle')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('App.dashboard.stats.certificates')}
          </CardTitle>
          <Award className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {locNum(completedLevels.length)}
          </div>
          <p className="text-muted-foreground text-xs">
            {t('App.dashboard.stats.certificatesSubtitle')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
