import { useAuth } from './contexts/auth-context';
import { useTranslation } from 'react-i18next';
import { Link } from '@shared/i18n/routing';
import { LEVEL_IDS } from '@shared/constants';
import { CheckCircle2, Lock, Zap } from 'lucide-react';
import useLocale from '@hooks/use-locale';

const LEVEL_LABELS: Record<string, string> = {
  LEVEL_A1: 'A1',
  LEVEL_A2: 'A2',
  LEVEL_B1: 'B1',
  LEVEL_B2: 'B2',
  LEVEL_C1: 'C1',
  LEVEL_C2: 'C2',
};

const TOTAL_DAYS_PER_LEVEL = 30;

export default function LearningPathTracker() {
  const { levelsDetails } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Find the current active level (not completed, not expired)
  const activeLevel = levelsDetails.find((l) => !l.isCompleted && !l.isExpired);
  const completedCount = levelsDetails.filter((l) => l.isCompleted).length;
  const totalLevels = LEVEL_IDS.length;

  // Calculate overall progress percentage
  const overallProgress = Math.round((completedCount / totalLevels) * 100);

  // Current level progress
  const currentDay = activeLevel?.currentDay || 0;
  const currentLevelProgress = Math.round((currentDay / TOTAL_DAYS_PER_LEVEL) * 100);
  const currentLevelLabel = activeLevel ? LEVEL_LABELS[activeLevel.levelName] || activeLevel.levelName : null;

  return (
    <Link
      to="/app/levels"
      className="flex w-full cursor-pointer flex-col rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 p-4 text-start shadow-sm transition-all hover:shadow-md hover:border-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group"
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-foreground">
            {isAr ? 'تتبع المسار' : 'Learning Path'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
          {completedCount}/{totalLevels}
        </span>
      </div>

      {/* Level dots */}
      <div className="flex items-center gap-1 mb-3 w-full justify-between">
        {LEVEL_IDS.map((levelId) => {
          const levelDetail = levelsDetails.find((l) => l.levelName === levelId);
          const isCompleted = levelDetail?.isCompleted;
          const isActive = activeLevel?.levelName === levelId;
          const label = LEVEL_LABELS[levelId];

          return (
            <div key={levelId} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white shadow-sm shadow-green-500/30'
                    : isActive
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/30 ring-2 ring-indigo-400/50 ring-offset-1 ring-offset-background animate-pulse'
                      : 'bg-muted text-muted-foreground/60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isActive ? (
                  label
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </div>
              <span
                className={`text-[8px] font-semibold ${
                  isCompleted
                    ? 'text-green-500'
                    : isActive
                      ? 'text-indigo-500'
                      : 'text-muted-foreground/50'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current level progress */}
      {activeLevel && (
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-medium">
              {isAr ? `المستوى ${currentLevelLabel}` : `Level ${currentLevelLabel}`}
            </span>
            <span className="text-[10px] font-bold text-indigo-500">
              {isAr ? `يوم ${currentDay}/${TOTAL_DAYS_PER_LEVEL}` : `Day ${currentDay}/${TOTAL_DAYS_PER_LEVEL}`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(currentLevelProgress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Overall progress */}
      {!activeLevel && completedCount > 0 && (
        <div className="w-full text-center">
          <span className="text-[10px] font-bold text-green-500">
            {isAr ? `تم إكمال ${completedCount} مستويات! 🎉` : `${completedCount} levels completed! 🎉`}
          </span>
        </div>
      )}

      {/* No levels yet */}
      {!activeLevel && completedCount === 0 && (
        <div className="w-full text-center">
          <span className="text-[10px] font-medium text-muted-foreground">
            {isAr ? 'ابدأ رحلتك الآن!' : 'Start your journey now!'}
          </span>
        </div>
      )}
    </Link>
  );
}
