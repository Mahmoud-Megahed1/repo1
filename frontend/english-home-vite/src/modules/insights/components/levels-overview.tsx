import useInsights from '@hooks/use-insights';
import { cn, getLevelLabel } from '@lib/utils';
import { LEVEL_IDS } from '@shared/constants';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { BookOpen, ChevronRight, Lock, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LevelsOverview = () => {
  const { t } = useTranslation();
  const { levelsDetails } = useInsights();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('App.dashboard.levels.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {LEVEL_IDS.map((levelId) => {
          const levelDetail = levelsDetails?.find(
            (l) => l.levelName === levelId
          );
          const isUnlocked = !!levelDetail;
          const isCompleted = levelDetail?.isCompleted || false;
          const dayProgress = levelDetail?.currentDay || 0;

          return (
            <div key={levelId} className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-full p-2',
                  isCompleted
                    ? 'bg-green-500'
                    : isUnlocked
                      ? 'bg-blue-500'
                      : 'bg-accent'
                )}
              >
                {isCompleted ? (
                  <Trophy className="h-4 w-4 text-white" />
                ) : isUnlocked ? (
                  <BookOpen className="h-4 w-4 text-white" />
                ) : (
                  <Lock className="text-accent-foreground/60 h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {t('Global.level', { level: getLevelLabel(levelId) })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {isCompleted
                    ? t('App.dashboard.levels.completed')
                    : isUnlocked
                      ? t('App.dashboard.levels.dayProgress', {
                          day: dayProgress,
                        })
                      : t('App.dashboard.levels.locked')}
                </p>
              </div>
            </div>
          );
        })}

        <Button variant="outline" size="sm" asChild className="mt-4 w-full">
          <Link to="/app/levels" className="flex items-center gap-2">
            {t('App.dashboard.levels.viewAll')}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LevelsOverview;
