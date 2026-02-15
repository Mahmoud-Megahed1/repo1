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
  const { t, i18n } = useTranslation();
  const [showExamples, setShowExamples] = useState(true);
  const isMobile = useIsMobile();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (!isMobile) window.scrollTo({ top: 110, behavior: 'instant' });
  }, [isMobile]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start w-full">
      {/* Image Section */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={pictureSrc}
          className="h-auto w-full object-contain max-h-[280px] lg:max-h-[380px]"
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

      {/* Content Section */}
      <div className="flex flex-col gap-4 lg:w-[320px] xl:w-[380px] shrink-0">
        <Card className="shadow-none border-border">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-muted-foreground text-xs uppercase font-medium">
                  {t('Global.english')}
                </span>
                <h3 lang="en" className="text-lg font-semibold">
                  {wordEn}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs uppercase font-medium">
                  {t('Global.arabic')}
                </span>
                <h3 lang="ar" className="text-lg font-semibold">
                  {wordAr}
                </h3>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-muted-foreground text-xs uppercase font-medium block mb-1">
                {isAr ? 'التعريف' : 'Definition'}
              </span>
              <CardDescription lang="en" className="text-sm">
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
              <ul lang="en" className="space-y-2 mt-2 max-h-[120px] lg:max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
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

        {showNextLessonButton && (
          <NextLessonButton
            lessonName="LISTEN"
            onClick={onComplete}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};

export default PictureCard;
