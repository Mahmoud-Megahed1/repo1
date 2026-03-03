import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import { cn } from '@lib/utils';
import { useParams } from '@tanstack/react-router';
import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type LevelId } from '../../types';
import { useMarkTaskAsCompleted } from '../../mutations';
import type { ReadLesson } from '../../types';
import { ReadingCard } from './reading-card';

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

  return (
    <div
      className={cn(
        'mx-auto flex size-full max-w-7xl flex-col gap-4',
        'lg:flex-row lg:items-start lg:gap-6',
        'lg:h-[calc(100vh-12rem)]',
        className
      )}
      {...props}
    >
      {/* Left: Audio + Navigation - sticky sidebar on desktop */}
      <div className="w-full space-y-4 lg:w-72 xl:w-80 lg:shrink-0 lg:sticky lg:top-24">
        <div className="space-y-2">
          <h3 className="text-lg font-bold md:text-xl">
            {t('Global.sidebarItems.LISTEN')}
          </h3>
          <AudioPlayback
            audioSrc={soundSrc}
            title={t('Global.sidebarItems.LISTEN')}
          />
        </div>
        <NextLessonButton lessonName="PICTURES" onClick={handleComplete} />
      </div>

      {/* Right: Reading Content - scrollable on desktop to avoid page scroll */}
      <div className="flex-1 min-w-0 lg:overflow-y-auto lg:h-full lg:pe-2">
        <ReadingCard title={t('Global.sidebarItems.READ')} content={transcript} />
      </div>
    </div>
  );
};

export default Reading;

