import EarSound from '@components/ear-sound';
import { cn } from '@lib/utils';
import type { SpeakingResult } from '@modules/lessons/types';
import { Card } from '@ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  result: Omit<SpeakingResult, 'correctSentence'>;
  recordUrl?: string;
  onReset?: () => void;
} & React.ComponentProps<typeof Card>;

export const SpeakingFeedback = ({
  result,
  onReset,
  recordUrl,
  className,
  ...props
}: Props) => {
  const { similarityPercentage, userTranscript, isPassed } = result;
  const { t } = useTranslation();
  return (
    <Card
      className={cn(
        'animate-in dark:bg-accent/10 fade-in slide-in-from-bottom-4 p-4 duration-500 dark:border',
        className
      )}
      {...props}
    >
      {/* Single compact row: Score Circle | Results info + What you said */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Score Circle - compact */}
        <div className="relative shrink-0">
          <div className="relative h-20 w-20 md:h-24 md:w-24">
            <svg className="h-20 w-20 md:h-24 md:w-24 -rotate-90 transform" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - similarityPercentage / 100)}`}
                className={isPassed ? 'text-success' : 'text-destructive'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-foreground text-lg md:text-2xl font-bold">
                {similarityPercentage}%
              </span>
              <span className="text-muted-foreground text-[9px] md:text-[10px]">
                {t('Global.similarity')}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Title + Pass/Fail + What you said - all compact */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Results title + Pass/Fail in one row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-foreground text-base md:text-lg font-bold">
              {t('Global.yourResults')}
            </h2>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                isPassed
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-semibold">{t('Global.passed')}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  <span className="font-semibold">{t('Global.keepPracticing')}</span>
                </>
              )}
            </div>
          </div>

          {/* What you said - inline compact */}
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-[10px] md:text-xs font-medium">
              {t('Global.whatYouSaid')}
            </p>
            <div
              lang="en"
              className={cn(
                'flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5',
                {
                  'bg-success/5 border-success/20': isPassed,
                  'bg-destructive/10 border-destructive/20': !isPassed,
                }
              )}
            >
              <p className="text-foreground text-xs md:text-sm truncate">{userTranscript}</p>
              {recordUrl && (
                <EarSound className="cursor-pointer shrink-0" soundSrc={recordUrl} />
              )}
            </div>
          </div>

          {/* Tip - only when failed, very compact */}
          {!isPassed && (
            <p className="text-muted-foreground text-[10px] md:text-xs mt-0.5">
              <span className="text-foreground font-semibold">
                {t('Global.tip.title')}:{' '}
              </span>
              {t('Global.tip.description')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
