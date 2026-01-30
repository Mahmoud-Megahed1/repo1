import useInsights from '@hooks/use-insights';
import { getLevelLabel } from '@lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Achievements = () => {
  const { t } = useTranslation();
  const { completedLevels } = useInsights();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {t('App.dashboard.achievements.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {completedLevels.length > 0 ? (
          completedLevels.map((level) => (
            <div
              key={level.levelName}
              className="flex items-center gap-3 rounded-lg border-green-200 bg-green-100 p-2 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
            >
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-700 p-3 shadow-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {t('Global.level', { level: getLevelLabel(level.levelName) })}
                </p>
                <p className="text-xs text-green-600">
                  {t('App.dashboard.achievements.completed')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <Trophy className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              {t('App.dashboard.achievements.empty')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Achievements;
