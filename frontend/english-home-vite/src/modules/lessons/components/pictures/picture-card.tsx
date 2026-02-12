import NextLessonButton from '@components/next-lesson-button';
import useAudioPlayer from '@hooks/use-audio-player';
import { useIsMobile } from '@hooks/use-mobile';
import type { PictureLesson } from '@modules/lessons/types';
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@ui/card';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Omit<PictureLesson, 'id'> & {
  prev: () => void;
  next: () => void;
  hasPrevItems: boolean;
  hasNextItems: boolean;
  showNextLessonButton?: boolean;
  onComplete?: () => void;
};

const PictureCard: FC<Props> = ({
  pictureSrc,
  wordAr,
  wordEn,
  definition,
  examples,
  soundSrc,
  hasNextItems,
  hasPrevItems,
  next,
  prev,
  showNextLessonButton,
  onComplete,
}) => {
  const { ref, togglePlay, isPlaying } = useAudioPlayer();
  const { t } = useTranslation();
  const [showExamples, setShowExamples] = useState(true);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) window.scrollTo({ top: 110, behavior: 'instant' });
  }, [isMobile]);
  return (
    <div className="flex flex-col gap-4 md:w-2/3">
      <div className="relative flex w-fit mx-auto items-center justify-center overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
        <img
          src={pictureSrc}
          className="h-auto w-full max-w-full md:max-h-[400px] rounded-md object-contain"
          alt={wordEn}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white disabled:opacity-0 ltr:left-2 rtl:right-2 rtl:rotate-180"
          onClick={prev}
          disabled={!hasPrevItems}
        >
          <ChevronLeftIcon size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-gray-300 hover:bg-black/50 hover:text-white disabled:opacity-0 ltr:right-2 rtl:left-2 rtl:rotate-180"
          onClick={next}
          disabled={!hasNextItems}
        >
          <ChevronRightIcon size={24} />
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        <Card className="shadow-none">
          <CardHeader className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-muted-foreground text-sm">
                  {t('Global.english')}
                </span>
                <h3 lang="en" className="text-lg font-semibold">
                  {wordEn}
                </h3>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  {t('Global.arabic')}
                </span>
                <h3 lang="ar" className="text-lg font-semibold">
                  {wordAr}
                </h3>
              </div>
            </div>
            <CardDescription lang="en">{definition}</CardDescription>
          </CardHeader>
          <CardContent>
            <audio ref={ref} src={soundSrc} hidden />
            <Button
              variant={isPlaying ? 'secondary' : 'default'}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <>
                  <PauseIcon />
                  {t('Global.pause')}
                </>
              ) : (
                <>
                  <PlayIcon />
                  {t('Global.play')}
                </>
              )}
            </Button>
            <div className="mt-4 space-y-2">
              <Button
                variant={'link'}
                className="p-0"
                onClick={() => setShowExamples(!showExamples)}
              >
                {showExamples
                  ? t('Global.hideExamples')
                  : t('Global.showExamples')}{' '}
                ({examples.length})
              </Button>
              {showExamples && (
                <ul lang="en" className="space-y-2">
                  {examples.map((example, index) => (
                    <li
                      key={index}
                      className="border-border bg-accent/30 rounded-lg border p-4"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
        {showNextLessonButton && (
          <NextLessonButton lessonName="LISTEN" onClick={onComplete} />
        )}
      </div>
    </div>
  );
};

export default PictureCard;
