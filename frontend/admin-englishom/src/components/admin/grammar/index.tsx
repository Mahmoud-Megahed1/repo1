'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { FC } from 'react';
import FormDialog from './form-dialog';
import GrammarItem, { GrammarItemSkeleton } from './grammar-item';

const Grammar: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty, isFetching } = useLesson({
    day,
    levelId: levelId,
    lessonName: 'GRAMMAR',
  });
  const grammar = lesson.at(0);
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

      {isLoading || isFetching ? (
        <GrammarItemSkeleton />
      ) : (
        grammar && (
          <GrammarItem grammar={grammar} levelId={levelId} day={`${day}`} />
        )
      )}
      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Grammar</h2>
        </div>
      )}
    </div>
  );
};

export default Grammar;
