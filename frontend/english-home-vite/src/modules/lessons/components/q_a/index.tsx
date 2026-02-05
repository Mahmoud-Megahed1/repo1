import useLocale from '@hooks/use-locale';
import { cn, localizedNumber } from '@lib/utils';
import { Button } from '@ui/button';
import { useEffect, useState, type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionAnswerLesson } from '../../types';
import QuestionAnswerList from './question-answer-list';
import QuestionAnswerWithPagination from './question-answer-with-pagination';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type LevelId } from '../../types';
type Props = {
  lesson: QuestionAnswerLesson[];
} & ComponentProps<'div'>;
const Q_A: FC<Props> = ({ lesson, className, ...props }) => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  let questionIndex = searchParams.get('question') || 0;
  questionIndex = isNaN(Number(questionIndex)) ? 0 : Number(questionIndex);

  const [currentIndex, setCurrentIndex] = useState(questionIndex);

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  const handleComplete = () => {
    if (levelId && day) {
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'Q_A',
        submission: { completed: true },
        score: 100,
        feedback: 'Q&A Completed',
      });
    }
  };

  // Update search params when current index changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('question', currentIndex.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${searchParams}`
    );
  }, [currentIndex]);
  const locale = useLocale() === 'en' ? 'en-US' : 'ar-EG';
  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col', className)}
      {...props}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">
            {t('Global.questionAndAnswer')}
          </h2>
          {showAll ? (
            <span className="text-muted-foreground text-sm">
              {lesson.length} {t('Global.questions')}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">
              {localizedNumber(currentIndex + 1, locale)} {t('Global.of')}{' '}
              {localizedNumber(lesson.length, locale)}
            </span>
          )}
        </div>
        <Button onClick={() => setShowAll((prev) => !prev)} variant={'outline'}>
          {showAll ? t('Global.showLess') : t('Global.showAll')}
        </Button>
      </div>
      {showAll ? (
        <QuestionAnswerList lesson={lesson} />
      ) : (
        <QuestionAnswerWithPagination
          lesson={lesson}
          onIndexChange={setCurrentIndex}
          defaultIndex={questionIndex}
        />
      )}
      {(showAll || currentIndex === lesson.length - 1) && (
        <NextLessonButton lessonName="GRAMMAR" className="mt-8" onClick={handleComplete} />
      )}
    </div>
  );
};

export default Q_A;
