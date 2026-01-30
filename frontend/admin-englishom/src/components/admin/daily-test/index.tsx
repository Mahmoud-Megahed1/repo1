'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { FC } from 'react';
import FormDialog from './form-dialog';
import DailyTestItem, { DailyTestItemSkeleton } from './daily-test-item';
import { cn } from '@/lib/utils';

const DailyTest: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const {
    isLoading,
    lesson: dailyTests,
    isEmpty,
    isFetching,
  } = useLesson({
    day,
    levelId: levelId,
    lessonName: 'DAILY_TEST',
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
        className={cn('grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4', {
          'animate-pulse duration-1000': isFetching,
        })}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <DailyTestItemSkeleton key={index} />
            ))
          : dailyTests.map((test) => (
              <DailyTestItem
                key={test.id}
                dailyTest={test}
                day={`${day}`}
                levelId={levelId}
              />
            ))}
      </ul>
      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Daily Test</h2>
        </div>
      )}
    </div>
  );
};

export default DailyTest;
