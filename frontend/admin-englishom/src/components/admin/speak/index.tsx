'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import FormDialog from './form-dialog';
import SpeakItem, { SpeakItemSkeleton } from './speak-item';

const Speak: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const { isLoading, lesson, isEmpty, isFetching } = useLesson({
    day,
    levelId,
    lessonName: 'SPEAK',
  });
  const speaks = lesson.at(0);

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
        className={cn('mx-auto w-full max-w-2xl', {
          'animate-pulse duration-1000': isFetching,
        })}
      >
        {isLoading ? (
          <SpeakItemSkeleton />
        ) : (
          speaks && (
            <SpeakItem
              key={speaks.id}
              speak={speaks}
              day={`${day}`}
              levelId={levelId}
            />
          )
        )}
      </ul>

      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Speaks</h2>
        </div>
      )}
    </div>
  );
};

export default Speak;
