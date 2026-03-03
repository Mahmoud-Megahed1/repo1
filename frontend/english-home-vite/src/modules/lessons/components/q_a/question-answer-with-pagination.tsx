import useItemsPagination from '@hooks/use-items-pagination';
import type { QuestionAnswerLesson } from '@modules/lessons/types';
import { cn } from '@lib/utils';
import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import QuestionAnswerCard from './question-answer-card';
import { Button } from '@ui/button';

const QuestionAnswerWithPagination = ({
  lesson,
  onIndexChange,
  defaultIndex = 0,
  nextLessonButton,
}: {
  lesson: QuestionAnswerLesson[];
  // eslint-disable-next-line no-unused-vars
  onIndexChange?: (index: number) => void;
  defaultIndex?: number;
  nextLessonButton?: ReactNode;
}) => {
  const { next, prev, currentItem, currentIndex, hasNextItems, hasPrevItems, isLast } =
    useItemsPagination(lesson, defaultIndex);
  const { t } = useTranslation();
  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);
  if (!currentItem) return null;
  return (
    <div>
      <QuestionAnswerCard
        key={currentIndex}
        index={currentIndex + 1}
        {...currentItem}
      />
      <div className="mt-6 flex items-center justify-between gap-2">
        <Button onClick={prev} variant={'outline'} disabled={!hasPrevItems}>
          {t('Global.prev')}
        </Button>
        <ul className="flex items-center gap-1">
          {Array(lesson.length)
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
        {isLast && nextLessonButton ? (
          nextLessonButton
        ) : (
          <Button onClick={next} variant={'outline'} disabled={!hasNextItems}>
            {t('Global.next')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswerWithPagination;
