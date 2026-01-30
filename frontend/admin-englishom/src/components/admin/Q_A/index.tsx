'use client';

import LevelAndDaySelector from '@/components/shared/level-and-day-selector';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import FormDialog from './form-dialog';
import QuestionAnswerItem, { QuestionAnswerItemSkeleton } from './q-and-a-item';

const QuestionAnswer: FC = () => {
  const [{ levelId, day }, setParams] = useLessonQueryParams();
  const {
    isLoading,
    lesson: questionAnswerList,
    isEmpty,
    isFetching,
  } = useLesson({
    day,
    levelId,
    lessonName: 'Q_A',
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

      <div
        className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3', {
          'animate-pulse duration-1000': isFetching,
        })}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <QuestionAnswerItemSkeleton key={index} />
            ))
          : questionAnswerList.map((qa) => (
              <QuestionAnswerItem
                key={qa.id}
                questionAnswer={qa}
                levelId={levelId}
                day={`${day}`}
              />
            ))}
      </div>

      {isEmpty && (
        <div className="flex h-full items-center justify-center">
          <h2 className="text-2xl font-bold">No Q&A</h2>
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;
