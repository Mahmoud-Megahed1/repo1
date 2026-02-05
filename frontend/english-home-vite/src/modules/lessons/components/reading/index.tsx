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
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  const handleComplete = () => {
    if (levelId && day) {
      markTaskCompleted({
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
        'mx-auto flex size-full max-w-2xl flex-col gap-8',
        className
      )}
      {...props}
    >
      <ReadingCard title={t('Global.sidebarItems.READ')} content={transcript} />
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
  );
};

export default Reading;
