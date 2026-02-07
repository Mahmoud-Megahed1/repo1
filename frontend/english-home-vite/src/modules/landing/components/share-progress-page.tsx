import usePageTitle from '@hooks/use-page-title';
import { LEVEL_IDS } from '@shared/constants';
import { Link } from '@shared/i18n/routing';
import { Award, Bookmark, TrendingUp, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ShareProgressPage() {
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const day = Math.max(
    0,
    Math.min(50, parseInt(searchParams.get('day') || '0', 10) || 0)
  );
  const studentName =
    searchParams.get('name') || t('ShareProgress.englishomStudent');
  let levelParam = searchParams.get('level') || 'LEVEL_A1';
  if (!LEVEL_IDS.includes(levelParam as never)) {
    levelParam = 'LEVEL_A1';
  }
  const totalDays = 50;

  usePageTitle(t('ShareProgress.title', { defaultValue: 'Share Progress' }));

  const progressPercentage = Math.min(
    Math.max((day / totalDays) * 100, 0),
    100
  );

  const remainingDays = Math.max(totalDays - day, 0);

  return (
    <div className="from-background to-background/50 min-h-screen bg-gradient-to-b px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header - Compact */}
        <div className="mb-4 text-center">
          <Link to="/" className="mb-2 flex items-center justify-center space-x-2">
            <img
              src="/logo.jpeg"
              alt="Englishom"
              className="h-8 w-auto rounded-md"
            />
            <div className="text-primary text-lg font-bold">
              {t('Global.englishom')}
            </div>
          </Link>
          <h2 className="text-primary mb-1 text-2xl font-bold sm:text-3xl rtl:mb-2">
            {t('ShareProgress.title')}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t('ShareProgress.subtitle')}
          </p>
        </div>

        {/* Main Content - All in one row */}
        <div className="mb-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {/* Student Profile Card - Compact */}
          {studentName && (
            <div className="bg-card rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-secondary rounded-full p-2">
                  <User className="text-secondary-foreground h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    {t('ShareProgress.student')}
                  </p>
                  <p lang="en" className="text-foreground text-sm font-bold">
                    {studentName}
                  </p>
                </div>
              </div>
              <div className="border-border flex items-center gap-3 border-t pt-3">
                <div className="bg-accent rounded-full p-2">
                  <Award className="text-accent-foreground h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    {t('ShareProgress.currentLevel')}
                  </p>
                  <p className="text-foreground text-sm font-bold">
                    {t('Global.level', {
                      level: levelParam.split('_')[1],
                      defaultValue: `Level ${levelParam.split('_')[1]}`,
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards - Combined */}
          <div className="space-y-3">
            {/* Current Progress Card */}
            <div className="bg-card dark:bg-muted rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">
                    {t('ShareProgress.currentProgress', { defaultValue: 'التقدم الحالي' })}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary text-2xl font-bold">
                      {Math.round(progressPercentage)}%
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t('ShareProgress.completed', { defaultValue: 'مكتمل' })}
                    </span>
                  </div>
                </div>
                <div className="bg-primary/10 rounded-lg p-2">
                  <TrendingUp className="text-primary h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Remaining Days Card */}
            <div className="bg-card dark:bg-muted rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">
                    {t('ShareProgress.remainingDuration', { defaultValue: 'المدة المتبقية' })}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-orange-500">
                      {remainingDays}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t('ShareProgress.daysToComplete', { defaultValue: 'يوم' })}
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-orange-500/10 p-2">
                  <Bookmark className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Circular Progress - Smaller */}
          <div className="flex items-center justify-center">
            <ProgressCircle
              value={progressPercentage}
              size={150}
              strokeWidth={10}
              label={`${day}`}
              subLabel={t('ShareProgress.ofDays', { totalDays: 50 })}
            />
          </div>
        </div>

        {/* CTA Section - Compact */}
        <div className="mx-auto max-w-xl text-center">
          <p className="text-muted-foreground mb-3 text-sm">
            {t('ShareProgress.cta', {
              defaultValue: 'انضم إليّ إلى عالم واسع وتعلم الإنجليزية الخاصة بك مع EnglishHome',
            })}
          </p>
          <a
            href={`${window.location.origin}/`}
            className="bg-primary text-primary-foreground inline-block rounded-full px-6 py-2 text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95 sm:px-8 sm:py-3"
          >
            {t('ShareProgress.startLearning', { defaultValue: 'ابدأ التعلم' })}
          </a>
        </div>
      </div>
    </div>
  );
}

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  className?: string;
}

export function ProgressCircle({
  value,
  size = 208,
  strokeWidth = 12,
  label,
  subLabel,
  className = '',
}: ProgressCircleProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedValue / 100) * circumference;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        className="size-full -rotate-90 transform"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span
            className="text-primary font-bold"
            style={{ fontSize: `${size * 0.2}px` }}
          >
            {label}
          </span>
        )}
        {subLabel && (
          <span className="text-muted-foreground text-sm">{subLabel}</span>
        )}
      </div>
    </div>
  );
}
