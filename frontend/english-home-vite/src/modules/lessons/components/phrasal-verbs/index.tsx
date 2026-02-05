import useItemsPagination from '@hooks/use-items-pagination';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { useEffect, useState, type ComponentProps, type FC } from 'react';
import type { PhrasalVerbLesson } from '../../types';
import PhrasalCard from './phrasal-card';
import { useTranslation } from 'react-i18next';
import useLocale from '@hooks/use-locale';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type LevelId } from '../../types';

type Props = {
  lesson: PhrasalVerbLesson[];
} & ComponentProps<'div'>;
const PhrasalVerbs: FC<Props> = ({ lesson, className, ...props }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [isFlipped, setIsFlipped] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  let defaultIndex = searchParams.get('index') || 0;
  defaultIndex = isNaN(Number(defaultIndex)) ? 0 : Number(defaultIndex);

  const { id: levelId, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  const handleComplete = () => {
    if (levelId && day) {
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'PHRASAL_VERBS',
        submission: { completed: true },
        score: 100,
        feedback: 'Phrasal Verbs Completed',
      });
    }
  };

  const {
    currentItem,
    next,
    prev,
    hasNextItems,
    hasPrevItems,
    currentIndex,
    setCurrentIndex,
    isLast,
  } = useItemsPagination(lesson, defaultIndex);

  // Update search params when current index changes
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('index', currentIndex.toString());
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${searchParams}`
    );
  }, [currentIndex]);

  if (!currentItem) return null;
  const { exampleAr, exampleEn, pictureSrc, sentence, soundSrc } = currentItem;
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-xl flex-col space-y-4',
        className
      )}
      {...props}
    >
      <PhrasalCard
        key={currentIndex}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        phrasalVerb={{
          exampleAr,
          exampleEn,
          pictureSrc,
          soundSrc,
          sentence,
        }}
      />
      <div className="inline-flex justify-between gap-2">
        <Button variant={'outline'} onClick={prev} disabled={!hasPrevItems}>
          {t('Global.prev')}
        </Button>
        <Button onClick={next} variant={'outline'} disabled={!hasNextItems}>
          {t('Global.next')}
        </Button>
      </div>
      <Card className="mt-16 border-none">
        <CardHeader>
          <CardTitle>{t('Global.otherPhrasalVerbs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {lesson.map(({ exampleEn, exampleAr }, index) => (
              <li key={index}>
                <Button
                  variant={'ghost'}
                  className={cn('bg-accent w-full capitalize', {
                    'ring-primary ring-2 ring-offset-1': index === currentIndex,
                  })}
                  onClick={() => setCurrentIndex(index)}
                >
                  {locale === 'ar' ? exampleAr : exampleEn}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {isLast && <NextLessonButton lessonName="IDIOMS" className="mt-6" onClick={handleComplete} />}
    </div>
  );
};

export default PhrasalVerbs;
