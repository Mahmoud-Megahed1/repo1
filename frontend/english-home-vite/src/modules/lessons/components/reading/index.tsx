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
        'mx-auto flex size-full max-w-6xl flex-col gap-4',
        'lg:flex-row lg:items-start lg:gap-4',
        className
      )}
      {...props}
    >
      {/* Left: Reading Content - expands to use available space */}
      <div className="flex-1 min-w-0">
        <ReadingCard title={t('Global.sidebarItems.READ')} content={transcript} />
      </div>

      {/* Right: Audio + Navigation - sticky sidebar on desktop */}
      <div className="w-full space-y-4 lg:w-80 lg:shrink-0 lg:sticky lg:top-24">
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
    </div>
  );
};

export default Reading;
