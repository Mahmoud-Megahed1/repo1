import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import { cn } from '@lib/utils';
import { useParams } from '@tanstack/react-router';
import { useMemo, useState, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type LevelId } from '../../types';
import { useMarkTaskAsCompleted } from '../../mutations';
import type { ReadLesson } from '../../types';
import RichTextViewer from '@components/rich-text-viewer';
import { Card, CardContent } from '@ui/card';

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

  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const handleAudioPlay = () => {
    if (!hasPlayedAudio) {
      setHasPlayedAudio(true);
      handleComplete();
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
        'lg:flex-row rtl:lg:flex-row-reverse lg:items-stretch lg:gap-4',
        'lg:h-[calc(100vh-13rem)]',
        className
      )}
      {...props}
    >
      {/* Image + Audio + Next — first in DOM (LEFT in both LTR and RTL) */}
      <div className="flex w-full flex-col gap-3 lg:w-[45%] xl:w-[42%] lg:shrink-0">
        {imageSrc && (
          <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl">
            <img
              src={imageSrc}
              alt="Reading illustration"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        )}
        <div className="space-y-1">
          <h3 className="text-base font-bold">
            {t('Global.sidebarItems.LISTEN')}
          </h3>
          <AudioPlayback
            audioSrc={soundSrc}
            title={t('Global.sidebarItems.LISTEN')}
            onPlay={handleAudioPlay}
          />
        </div>
        <NextLessonButton lessonName="PICTURES" />
      </div>

      {/* Text Content */}
      <Card className="flex-1 min-w-0 flex flex-col lg:overflow-hidden border-border shadow-card">
        <CardContent className="flex-1 min-h-0 lg:overflow-y-auto lg:pe-2 pt-6">
          <div className="bg-accent/30 w-full rounded-lg p-3">
            <RichTextViewer lang="en">{textContent}</RichTextViewer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reading;


