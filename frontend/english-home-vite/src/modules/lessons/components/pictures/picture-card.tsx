import NextLessonButton from '@components/next-lesson-button';
import useAudioPlayer from '@hooks/use-audio-player';
import { useIsMobile } from '@hooks/use-mobile';
import { cn } from '@lib/utils';
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
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between w-full">
      {/* Left side: Image */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5 border border-border/50 shadow-sm min-h-[300px] lg:min-h-[500px] max-h-[600px]">
        <img
          src={pictureSrc}
          className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
          style={{ maxHeight: 'inherit' }}
          alt={wordEn}
        />

        {/* Navigation Overlays */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 disabled:opacity-0 ltr:left-4 rtl:right-4 rtl:rotate-180 transition-all z-10 size-12"
          onClick={prev}
          disabled={!hasPrevItems}
        >
          <ChevronLeftIcon size={32} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 disabled:opacity-0 ltr:right-4 rtl:left-4 rtl:rotate-180 transition-all z-10 size-12"
          onClick={next}
          disabled={!hasNextItems}
        >
          <ChevronRightIcon size={32} />
        </Button>
      </div>

      {/* Right side: Content Card */}
      <div className="flex flex-col gap-4 lg:w-[400px] xl:w-[450px] shrink-0">
        <Card className="shadow-xl border-blue-50/50 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="space-y-6 pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                    {t('Global.english')}
                  </span>
                  <h3 lang="en" className="text-2xl font-bold text-blue-900 leading-tight">
                    {wordEn}
                  </h3>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1 text-right">
                    {t('Global.arabic')}
                  </span>
                  <h3 lang="ar" className="text-2xl font-bold text-indigo-900 leading-tight">
                    {wordAr}
                  </h3>
                </div>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-2 block">
                  {isAr ? 'التعريف' : 'Definition'}
                </span>
                <CardDescription lang="en" className="text-base text-slate-700 leading-relaxed italic">
                  {definition}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <audio ref={ref} src={soundSrc} hidden />

            <div className="flex items-center gap-3">
              <Button
                variant={isPlaying ? 'secondary' : 'default'}
                className={cn(
                  "flex-1 h-12 rounded-xl font-bold shadow-lg transition-all",
                  !isPlaying && "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                )}
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="size-5 fill-current mr-2" />
                    {t('Global.pause')}
                  </>
                ) : (
                  <>
                    <PlayIcon className="size-5 fill-current mr-2" />
                    {t('Global.play')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="size-12 rounded-xl border-slate-200"
                onClick={() => setShowExamples(!showExamples)}
                title={t('Global.showExamples')}
              >
                <div className="relative">
                  <span className="text-xs font-bold">{examples.length}</span>
                </div>
              </Button>
            </div>

            {showExamples && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter ml-1">
                  {t('Global.examples')}
                </h4>
                <ul lang="en" className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {examples.map((example, index) => (
                    <li
                      key={index}
                      className="border-blue-50 bg-blue-50/30 text-slate-700 rounded-xl border p-3.5 text-sm leading-relaxed relative overflow-hidden group"
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-blue-200 group-hover:bg-blue-400 transition-colors" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {showNextLessonButton && (
          <div className="mt-2 animate-bounce-slow">
            <NextLessonButton
              lessonName="LISTEN"
              onClick={onComplete}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-none hover:opacity-90 shadow-xl shadow-blue-100 font-bold"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PictureCard;
