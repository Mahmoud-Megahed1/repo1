'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import FormDialog from './form-dialog';
import PhrasalVerbItem, { PhrasalVerbSkeleton } from './phrasal-verbs-item';

const PhrasalVerbs: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const {
    isLoading,
    lesson: phrasalVerbs,
    isEmpty,
    isFetching,
  } = useLesson({
    day,
    levelId,
    lessonName: 'PHRASAL_VERBS',
  });
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
        <FormDialog levelId={levelId} day={`${day}`} />
      </div>
      <ul
        className={cn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3', {
          'animate-pulse duration-1000': isFetching,
        })}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <PhrasalVerbSkeleton key={index} />
            ))
          : phrasalVerbs.map((phrasalVerb) => (
              <PhrasalVerbItem
                key={phrasalVerb.id}
                phrasalVerb={phrasalVerb}
                day={`${day}`}
                levelId={levelId}
              />
            ))}
      </ul>
      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Phrasal Verbs</h2>
        </div>
      )}
    </div>
  );
};

export default PhrasalVerbs;
