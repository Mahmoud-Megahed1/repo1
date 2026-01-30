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
    <div className="from-background to-background/50 min-h-screen bg-gradient-to-b px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 space-y-8 text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <img
              src="/logo.jpeg"
              alt="Englishom"
              className="h-10 w-auto rounded-md"
            />
            <div className="text-primary text-lg font-bold md:text-2xl">
              {t('Global.englishom')}
            </div>
          </Link>
          <h2 className="text-primary text-4xl font-bold sm:text-5xl rtl:mb-6">
            {t('ShareProgress.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t('ShareProgress.subtitle')}
          </p>

          {/* Student Profile Card */}
          {studentName && (
            <div className="bg-card mx-auto max-w-md rounded-2xl p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary rounded-full p-3">
                    <User className="text-secondary-foreground h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      {t('ShareProgress.student')}
                    </p>
                    <p lang="en" className="text-foreground text-lg font-bold">
                      {studentName}
                    </p>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="border-border flex items-center gap-3 border-t pt-4">
                  <div className="bg-accent rounded-full p-3">
                    <Award className="text-accent-foreground h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      {t('ShareProgress.currentLevel')}
                    </p>
                    <p className="text-foreground text-lg font-bold">
                      {t('Global.level', {
                        level: levelParam.split('_')[1],
                        defaultValue: `Level ${levelParam.split('_')[1]}`,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="mb-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Stats Cards */}
          <div className="space-y-6">
            {/* Current Progress Card */}
            <div className="rbg-card dark:bg-muted rounded-2xl p-6 shadow-md sm:p-8">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                    {t('ShareProgress.currentProgress', {
                      defaultValue: 'التقدم الحالي',
                    })}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-primary text-3xl font-bold sm:text-4xl">
                      {Math.round(progressPercentage)}%
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t('ShareProgress.completed', {
                        defaultValue: 'مكتمل',
                      })}
                    </span>
                  </div>
                </div>
                <div className="bg-primary/10 flex-shrink-0 rounded-xl p-3">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Remaining Days Card */}
            <div className="bg-card dark:bg-muted rounded-2xl p-6 shadow-md sm:p-8">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                    {t('ShareProgress.remainingDuration', {
                      defaultValue: 'المدة المتبقية',
                    })}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-orange-500 sm:text-4xl">
                      {remainingDays}
                    </span>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t('ShareProgress.daysToComplete', {
                        defaultValue: 'يوم لإكمال الدورة',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 rounded-xl bg-orange-500/10 p-3">
                  <Bookmark className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Circular Progress */}
          <div className="flex justify-center lg:justify-end">
            <ProgressCircle
              value={progressPercentage}
              size={200}
              strokeWidth={12}
              label={`${day}`}
              subLabel={t('ShareProgress.ofDays', {
                totalDays: 50,
              })}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            {t('ShareProgress.cta', {
              defaultValue:
                'انضم إليّ إلى عالم واسع وتعلم الإنجليزية الخاصة بك مع EnglishHome',
            })}
          </p>
          <a
            href={`${window.location.origin}/`}
            className="bg-primary text-primary-foreground inline-block rounded-full px-8 py-3 font-semibold transition-all hover:scale-105 hover:shadow-lg active:scale-95 sm:px-12 sm:py-4"
          >
            {t('ShareProgress.startLearning', {
              defaultValue: 'ابدأ التعلم',
            })}
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
