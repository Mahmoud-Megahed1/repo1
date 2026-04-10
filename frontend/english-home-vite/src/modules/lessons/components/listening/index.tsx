import { AudioPlayback } from '@components/audio-playback';
import NextLessonButton from '@components/next-lesson-button';
import LessonProgress from '@components/lesson-progress';
import RichTextViewer from '@components/rich-text-viewer';
import useItemsPagination from '@hooks/use-items-pagination';
import { cn } from '@lib/utils';
import { useParams } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { FileText } from 'lucide-react';
import { type ComponentProps, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LevelId } from '../../types';
import type { ListenLesson } from '../../types';
import { useMarkTaskAsCompleted } from '../../mutations';
import { DefinitionCard } from './definition-card';

type Props = {
  lesson: ListenLesson;
} & ComponentProps<'div'>;
const Listening: FC<Props> = ({ lesson, ...props }) => {
  const { t } = useTranslation();
  const [isTranscriptVisible, setTranscriptVisible] = useState(false);
  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  // Paginate definitions instead of a long scrolling list
  const {
    currentItem: currentDefinition,
    hasNextItems,
    hasPrevItems,
    currentIndex,
    next,
    prev,
    isLast,
  } = useItemsPagination(lesson.definitions);

  const handleComplete = async () => {
    if (levelId && day) {
      await markTaskCompletedAsync({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'LISTEN',
        submission: { completed: true },
        score: 100,
        feedback: 'Listening Completed',
      });
    }
  };

  return (
    <div className="mx-auto flex size-full max-w-3xl flex-col gap-4" {...props}>
      {/* Progress bar at top */}
      <LessonProgress currentIndex={currentIndex} total={lesson.definitions.length} />

      {/* Audio Player Section */}
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-end gap-4">
          {/* Show transcript */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTranscriptVisible((prev) => !prev)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isTranscriptVisible ? t('Global.hide') : t('Global.show')}{' '}
            {t('Global.transcript')}
          </Button>
        </div>
        <AudioPlayback
          audioSrc={lesson.soundSrc}
          title={t('Global.sidebarItems.LISTEN')}
        />
      </div>
      {isTranscriptVisible && (
        <Card className="gap-2">
          <CardHeader className="pb-2">
            <CardTitle>{t('Global.transcript')}</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[40vh] overflow-y-auto">
            <RichTextViewer lang="en" className="leading-relaxed text-sm md:text-base">
              {lesson.transcript.replace(/{(.*?)}/g, '<b>$1</b>')}
            </RichTextViewer>
          </CardContent>
        </Card>
      )}

      {/* Definitions Section — Paginated */}
      <div className="space-y-4">

        {/* Current Definition Card */}
        {currentDefinition && (
          <div lang="en" className="font-inter">
            <DefinitionCard
              word={currentDefinition.word}
              definition={currentDefinition.definition}
              soundSrc={currentDefinition.soundSrc}
              index={currentIndex + 1}
            />
          </div>
        )}

        {/* Pagination Controls — Arrow buttons + dots */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={!hasPrevItems}>
            {t('Global.prev')}
          </Button>
          <ul className="flex items-center gap-1">
            {Array(lesson.definitions.length)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className={cn('bg-accent size-2 rounded-full', {
                    'bg-primary scale-105': i === currentIndex,
                  })}
                />
              ))}
          </ul>
          {isLast ? (
            <NextLessonButton lessonName="WRITE" onClick={handleComplete} />
          ) : (
            <Button variant="outline" onClick={next} disabled={!hasNextItems}>
              {t('Global.next')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listening;
