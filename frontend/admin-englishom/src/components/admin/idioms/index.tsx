'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import FormDialog from './form-dialog';
import IdiomItem, { IdiomSkeleton } from './idiom-item';

const Idioms: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty, isFetching } = useLesson({
    day,
    levelId,
    lessonName: 'IDIOMS',
  });
  const idioms = lesson.at(0);
  return (
    <div className="flex size-full flex-col">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LevelAndDaySelector
            levelId={levelId}
            day={day}
            setParams={setParams}
          />
        </div>
        {isEmpty && <FormDialog levelId={levelId} day={`${day}`} />}
      </div>
      <ul
        className={cn('grid grid-cols-1 gap-4', {
          'animate-pulse duration-1000': isFetching,
        })}
      >
        {isLoading ? (
          <IdiomSkeleton />
        ) : (
          idioms && (
            <IdiomItem idiom={idioms} day={`${day}`} levelId={levelId} />
          )
        )}
      </ul>
      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Idioms</h2>
        </div>
      )}
    </div>
  );
};

export default Idioms;
