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
        'animate-in dark:bg-accent/10 fade-in slide-in-from-bottom-4 space-y-6 p-8 duration-500 dark:border',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">
          {t('Global.yourResults')}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('Global.tryAgain')}
        </Button>
      </div>

      {/* Similarity Score */}
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="relative h-40 w-40">
            <svg className="h-40 w-40 -rotate-90 transform">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - similarityPercentage / 100)}`}
                className={isPassed ? 'text-success' : 'text-destructive'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-foreground text-4xl font-bold">
                {similarityPercentage}%
              </span>
              <span className="text-muted-foreground text-sm">
                {t('Global.similarity')}
              </span>
            </div>
          </div>
        </div>

        {/* Pass/Fail Badge */}
        <div className="mt-4 flex justify-center">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              isPassed
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {isPassed ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">{t('Global.passed')}</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">
                  {t('Global.keepPracticing')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transcripts Comparison */}
      <div className="border-border space-y-4 border-t pt-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium tracking-wide">
            {t('Global.whatYouSaid')}
          </p>
          <div
            lang="en"
            className={cn(
              `flex flex-col-reverse items-center justify-between gap-4 rounded-lg border p-4 md:flex-row`,
              {
                'bg-success/5 border-success/20': isPassed,
                'bg-destructive/10 border-destructive/20': !isPassed,
              }
            )}
          >
            <p className="text-foreground">{userTranscript}</p>
            {recordUrl && (
              <EarSound className="cursor-pointer" soundSrc={recordUrl} />
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      {!isPassed && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-muted-foreground text-sm">
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
