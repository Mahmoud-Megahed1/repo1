import useInsights from '@hooks/use-insights';
import useLocale from '@hooks/use-locale';
import { getLevelLabel, localizeNumber } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import { Badge } from '@ui/badge';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Progress } from '@ui/progress';
import { ChevronRight, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CurrentLevelProgress = () => {
  const { t } = useTranslation();
  const { currentLevel } = useInsights();
  const locale = useLocale();
  const locNum = localizeNumber(locale);
  if (!currentLevel) return null;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('App.dashboard.currentLevel.title')}
            </CardTitle>
            <CardDescription>
              {t('App.dashboard.currentLevel.description')}
            </CardDescription>
          </div>
          <Badge variant="info-yellow" className="font-semibold">
            {t('Global.level', {
              level: getLevelLabel(currentLevel.levelName),
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('App.dashboard.currentLevel.dayProgress')}
            </span>
            <span className="font-medium">
              {t('App.dashboard.currentLevel.dayCount', {
                current: locNum(currentLevel.currentDay),
                total: locNum(50),
              })}
            </span>
          </div>
          <Progress value={(currentLevel.currentDay / 50) * 100} />
        </div>

        <Button asChild className="w-full">
          <Link
            to="/app/levels/$id"
            params={{
              id: currentLevel.levelName,
            }}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            {t('App.dashboard.currentLevel.continue')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CurrentLevelProgress;
