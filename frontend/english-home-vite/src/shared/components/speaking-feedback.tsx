import EarSound from '@components/ear-sound';
import { cn } from '@lib/utils';
import type { SpeakingResult } from '@modules/lessons/types';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
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
        'animate-in dark:bg-accent/10 fade-in slide-in-from-bottom-4 space-y-3 p-4 md:p-6 duration-500 dark:border',
        className
      )}
      {...props}
    >
      {/* Header with results title, try again, score circle, and pass/fail — all in one compact row */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Score Circle - compact size */}
        <div className="relative shrink-0">
          <div className="relative h-24 w-24 md:h-28 md:w-28">
            <svg className="h-24 w-24 md:h-28 md:w-28 -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - similarityPercentage / 100)}`}
                className={isPassed ? 'text-success' : 'text-destructive'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-foreground text-2xl md:text-3xl font-bold">
                {similarityPercentage}%
              </span>
              <span className="text-muted-foreground text-[10px] md:text-xs">
                {t('Global.similarity')}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Title + Pass/Fail + Try Again */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h2 className="text-foreground text-lg md:text-xl font-bold">
            {t('Global.yourResults')}
          </h2>

          {/* Pass/Fail Badge */}
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 w-fit ${
              isPassed
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {isPassed ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold text-sm">{t('Global.passed')}</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span className="font-semibold text-sm">
                  {t('Global.keepPracticing')}
                </span>
              </>
            )}
          </div>

          {/* Try Again Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground w-fit p-0 h-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {t('Global.tryAgain')}
          </Button>
        </div>
      </div>

      {/* Transcripts Comparison - compact */}
      <div className="border-border space-y-2 border-t pt-3">
        <div className="space-y-1.5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide">
            {t('Global.whatYouSaid')}
          </p>
          <div
            lang="en"
            className={cn(
              `flex flex-col-reverse items-center justify-between gap-2 rounded-lg border p-3 md:flex-row`,
              {
                'bg-success/5 border-success/20': isPassed,
                'bg-destructive/10 border-destructive/20': !isPassed,
              }
            )}
          >
            <p className="text-foreground text-sm">{userTranscript}</p>
            {recordUrl && (
              <EarSound className="cursor-pointer shrink-0" soundSrc={recordUrl} />
            )}
          </div>
        </div>
      </div>

      {/* Tips - compact */}
      {!isPassed && (
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-muted-foreground text-xs">
            <span className="text-foreground font-semibold">
              {t('Global.tip.title')}:{' '}
            </span>
            {t('Global.tip.description')}
          </p>
        </div>
      )}
    </Card>
  );
};
