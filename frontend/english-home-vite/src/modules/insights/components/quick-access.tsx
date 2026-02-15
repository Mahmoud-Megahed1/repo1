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
import { BookOpen, Clock, Ear, PencilLine, Speech, Snowflake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import FreezeSubscriptionModal from '@/modules/auth/components/FreezeSubscriptionModal';
import { useAuth } from '@components/contexts/auth-context';

const QuickAccess = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { currentLevel } = useInsights();
  const { user } = useAuth();
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
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

          {/* Freeze Subscription Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFreezeModalOpen(true)}
            className={cn(
              "h-auto flex-col gap-2 p-4 border-dashed border-2",
              user?.isVoluntaryPaused ? "border-blue-500 bg-blue-50" : "border-indigo-200"
            )}
          >
            <div className={cn(
              "rounded-full p-2 text-white transition-all transform group-hover:scale-110",
              user?.isVoluntaryPaused ? "bg-blue-600 animate-pulse" : "bg-indigo-600"
            )}>
              <Snowflake className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-tighter">
                {user?.isVoluntaryPaused
                  ? (isAr ? 'الاشتراك مُجمد' : 'Frozen')
                  : (isAr ? 'تجميد الاشتراك' : 'Freeze')}
              </span>
              {user?.isVoluntaryPaused && user?.pauseScheduledEndDate && (
                <span className="text-[10px] text-blue-600 font-medium whitespace-nowrap">
                  {isAr ? 'ينتهي في' : 'Ends'} {new Date(user.pauseScheduledEndDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          </Button>

          <FreezeSubscriptionModal
            isOpen={isFreezeModalOpen}
            onClose={() => setIsFreezeModalOpen(false)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
