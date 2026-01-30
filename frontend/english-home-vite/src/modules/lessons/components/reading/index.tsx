import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import { cn } from '@lib/utils';
import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
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
      <NextLessonButton lessonName="PICTURES" />
    </div>
  );
};

export default Reading;
