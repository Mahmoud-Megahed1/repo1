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
        {/* Left side: Results info + What you said + Progress Bar */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Results title + Pass/Fail in one row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-foreground text-base md:text-lg font-bold">
              {t('Global.yourResults')}
            </h2>
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                isPassed
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold">{t('Global.passed')}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span className="font-semibold">{t('Global.keepPracticing')}</span>
                </>
              )}
            </div>
          </div>

          {/* What you said - full text, moved up */}
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] md:text-xs font-medium">
              {t('Global.whatYouSaid')}
            </p>
            <div
              lang="en"
              className={cn(
                'flex items-start justify-between gap-3 rounded-md border px-3 py-2.5',
                {
                  'bg-success/5 border-success/20': isPassed,
                  'bg-destructive/10 border-destructive/20': !isPassed,
                }
              )}
            >
              <p className="text-foreground text-xs md:text-sm font-medium leading-relaxed whitespace-pre-wrap break-words flex-1 text-left" dir="ltr">
                {userTranscript}
              </p>
              {recordUrl && (
                <EarSound className="cursor-pointer shrink-0 mt-0.5" soundSrc={recordUrl} />
              )}
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-muted-foreground">{t('Global.similarity')}</span>
              <span className={isPassed ? 'text-success' : 'text-destructive'}>
                {similarityPercentage}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-accent overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", isPassed ? 'bg-success' : 'bg-destructive')} 
                style={{ width: `${similarityPercentage}%` }} 
              />
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
    </Card>
  );
};
