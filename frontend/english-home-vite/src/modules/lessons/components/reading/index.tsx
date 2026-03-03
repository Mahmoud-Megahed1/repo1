import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import { cn } from '@lib/utils';
import { useParams } from '@tanstack/react-router';
import { useMemo, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type LevelId } from '../../types';
import { useMarkTaskAsCompleted } from '../../mutations';
import type { ReadLesson } from '../../types';
import RichTextViewer from '@components/rich-text-viewer';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';

type Props = {
  lesson: ReadLesson;
} & ComponentProps<'div'>;
const Reading: FC<Props> = ({
  lesson: { soundSrc, transcript },
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  const handleComplete = async () => {
    if (levelId && day) {
      await markTaskCompletedAsync({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'READ',
        submission: { completed: true },
        score: 100,
        feedback: 'Reading Completed',
      });
    }
  };

  // Extract image from transcript and separate text content
  const { imageSrc, textContent } = useMemo(() => {
    const imgMatch = transcript.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    const imgSrc = imgMatch ? imgMatch[1] : null;
    // Remove the img tag from transcript to get pure text
    const text = transcript.replace(/<img[^>]*>/gi, '').trim();
    return { imageSrc: imgSrc, textContent: text };
  }, [transcript]);

  return (
    <div
      className={cn(
        'mx-auto flex size-full max-w-7xl flex-col gap-3',
        'lg:flex-row lg:items-stretch lg:gap-4',
        'lg:h-[calc(100vh-13rem)]',
        className
      )}
      {...props}
    >
      {/* Left Column: Image + Audio + Next Button */}
      <div className="flex w-full flex-col gap-3 lg:w-[45%] xl:w-[42%] lg:shrink-0">
        {/* Image */}
        {imageSrc && (
          <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
            <img
              src={imageSrc}
              alt="Reading illustration"
              className="h-full w-full object-contain max-h-[250px] lg:max-h-full rounded-xl"
            />
          </div>
        )}

        {/* Audio Player */}
        <div className="space-y-1">
          <h3 className="text-base font-bold">
            {t('Global.sidebarItems.LISTEN')}
          </h3>
          <AudioPlayback
            audioSrc={soundSrc}
            title={t('Global.sidebarItems.LISTEN')}
          />
        </div>

        {/* Next Lesson Button */}
        <NextLessonButton lessonName="PICTURES" onClick={handleComplete} />
      </div>

      {/* Right Column: Text Content - scrollable */}
      <Card className="flex-1 min-w-0 flex flex-col lg:overflow-hidden border-border shadow-card">
        <CardHeader className="flex items-center gap-2 shrink-0 pb-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle className="text-xl font-semibold">
            {t('Global.sidebarItems.READ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 lg:overflow-y-auto lg:pe-2">
          <div className="bg-accent/30 w-full rounded-lg p-3">
            <RichTextViewer lang="en">{textContent}</RichTextViewer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reading;


