import NextLessonButton from '@components/next-lesson-button';
import useAudioPlayer from '@hooks/use-audio-player';
import type { PictureLesson } from '@modules/lessons/types';
import { Button } from '@ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@ui/card';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react';
import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = Omit<PictureLesson, 'id'> & {
  prev: () => void;
  next: () => void;
  hasPrevItems: boolean;
  hasNextItems: boolean;
  isLast?: boolean;
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
  isLast,
  onComplete,
}) => {
  const { ref, togglePlay, isPlaying } = useAudioPlayer();
  const { t, i18n } = useTranslation();
  const [showExamples, setShowExamples] = useState(true);
  const isAr = i18n.language === 'ar';

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start w-full">
      {/* Content Section — first in DOM (RIGHT in RTL, LEFT in LTR) */}
      <div className="flex flex-col gap-2 flex-1">
        <Card className="shadow-none border-border flex-1">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-muted-foreground text-xs uppercase font-medium">
                  {t('Global.english')}
                </span>
                <h3 lang="en" className="text-xl font-semibold">
                  {wordEn}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs uppercase font-medium">
                  {t('Global.arabic')}
                </span>
                <h3 lang="ar" className="text-xl font-semibold">
                  {wordAr}
                </h3>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-muted-foreground text-xs uppercase font-medium block mb-1">
                {isAr ? 'التعريف' : 'Definition'}
              </span>
              <CardDescription lang="en" className="text-base">
                {definition}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <audio ref={ref} src={soundSrc} hidden />

            <div className="flex flex-col gap-2">
              <Button
                variant={isPlaying ? 'secondary' : 'default'}
                className="w-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="mr-2 h-4 w-4" />
                    {t('Global.pause')}
                  </>
                ) : (
                  <>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    {t('Global.play')}
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground p-0 h-auto self-start hover:bg-transparent"
                onClick={() => setShowExamples(!showExamples)}
              >
                {showExamples ? t('Global.hideExamples') : t('Global.showExamples')} ({examples.length})
              </Button>
            </div>

            {showExamples && (
              <ul lang="en" className="space-y-2 mt-2 max-h-[100px] lg:max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {examples.map((example, index) => (
                  <li
                    key={index}
                    className="border-border bg-accent/30 rounded-md border p-2 text-xs italic"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <NextLessonButton
          lessonName="LISTEN"
          onClick={onComplete}
          className={`w-full transition-opacity ${isLast ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
          disabled={!isLast}
        />
      </div>

      {/* Image Section — second in DOM (LEFT in RTL, RIGHT in LTR) */}
      <div className="relative lg:w-[420px] shrink-0 overflow-hidden rounded-lg max-h-[360px]">
        <img
          src={pictureSrc}
          className="h-full w-full object-cover select-none pointer-events-none rounded-lg max-h-[360px]"
          alt={wordEn}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute z-10 top-1/2 -translate-y-1/2 left-3 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
          onClick={prev}
          disabled={!hasPrevItems}
        >
          <ChevronLeftIcon size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute z-10 top-1/2 -translate-y-1/2 right-3 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30"
          onClick={next}
          disabled={!hasNextItems}
        >
          <ChevronRightIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

export default PictureCard;
