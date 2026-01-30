import useInsights from '@hooks/use-insights';
import { cn } from '@lib/utils';
import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { BookOpen, Clock, Ear, PencilLine, Speech } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const QuickAccess = () => {
  const { t } = useTranslation();
  const { currentLevel } = useInsights();
  const quickAccessLessons = [
    { id: 'READ' as const, icon: BookOpen, colorClass: 'bg-blue-500' },
    { id: 'LISTEN' as const, icon: Ear, colorClass: 'bg-green-500' },
    { id: 'WRITE' as const, icon: PencilLine, colorClass: 'bg-purple-500' },
    { id: 'SPEAK' as const, icon: Speech, colorClass: 'bg-orange-500' },
  ];
  if (!currentLevel) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t('App.dashboard.quickAccess.title')}
        </CardTitle>
        <CardDescription>
          {t('App.dashboard.quickAccess.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickAccessLessons.map((lesson) => (
            <Button
              key={lesson.id}
              variant="outline"
              size="sm"
              asChild
              className="h-auto flex-col gap-2 p-4"
            >
              <Link
                to="/app/levels/$id/$day/$lessonName"
                params={{
                  id: currentLevel.levelName,
                  day: currentLevel.currentDay.toString(),
                  lessonName: lesson.id,
                }}
              >
                <div
                  className={cn(
                    'rounded-full p-2 text-white',
                    lesson.colorClass
                  )}
                >
                  <lesson.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">
                  {t(`Global.sidebarItems.${lesson.id}`)}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
