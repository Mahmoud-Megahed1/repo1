import useItemsPagination from '@hooks/use-items-pagination';
import type { QuestionAnswerLesson } from '@modules/lessons/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QuestionAnswerCard from './question-answer-card';
import { Button } from '@ui/button';

const QuestionAnswerWithPagination = ({
  lesson,
  onIndexChange,
  defaultIndex = 0,
}: {
  lesson: QuestionAnswerLesson[];
  // eslint-disable-next-line no-unused-vars
  onIndexChange?: (index: number) => void;
  defaultIndex?: number;
}) => {
  const { next, prev, currentItem, currentIndex, hasNextItems, hasPrevItems } =
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
      <div className="mt-8 flex justify-between gap-2">
        <Button onClick={prev} variant={'outline'} disabled={!hasPrevItems}>
          {t('Global.prev')}
        </Button>
        <Button onClick={next} variant={'outline'} disabled={!hasNextItems}>
          {t('Global.next')}
        </Button>
      </div>
    </div>
  );
};

export default QuestionAnswerWithPagination;
