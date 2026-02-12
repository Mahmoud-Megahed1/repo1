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
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompleted();

  const handleComplete = async () => {
    if (levelId && day) {
      await markTaskCompletedAsync({
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
  const { definitionAr, definitionEn, examples } = currentItem;
  const firstExample = examples[0] || { exampleAr: '', exampleEn: '', pictureSrc: '', sentence: '', soundSrc: '' };
  const { exampleAr, exampleEn, pictureSrc, sentence, soundSrc } = firstExample;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-col space-y-8 pb-10',
        className
      )}
      {...props}
    >
      <PhrasalCard
        key={currentIndex}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
        phrasalVerb={{
          definitionAr,
          definitionEn,
          exampleAr,
          exampleEn,
          pictureSrc,
          soundSrc,
          sentence,
        }}
      />
      <div className="flex justify-between items-center gap-4">
        <Button
          variant={'outline'}
          onClick={prev}
          disabled={!hasPrevItems}
          className="h-12 px-8 font-semibold transition-all hover:bg-primary/5 active:scale-95"
        >
          {t('Global.prev')}
        </Button>
        <div className="text-muted-foreground text-sm font-medium">
          {currentIndex + 1} / {lesson.length}
        </div>
        <Button
          onClick={next}
          variant={'outline'}
          disabled={!hasNextItems}
          className="h-12 px-8 font-semibold transition-all hover:bg-primary/5 active:scale-95"
        >
          {t('Global.next')}
        </Button>
      </div>

      <Card className="mt-20 border-border/50 bg-secondary/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg">{t('Global.otherPhrasalVerbs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {lesson.map(({ definitionEn, definitionAr }, index) => (
              <li key={index} className="w-full sm:w-auto">
                <Button
                  variant={'ghost'}
                  className={cn(
                    'bg-background hover:bg-accent border border-border/50 h-auto py-2 px-4 transition-all !normal-case text-start h-full w-full',
                    {
                      'ring-primary bg-primary/5 border-primary/50 font-bold ring-1': index === currentIndex,
                    }
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <span className="text-sm">
                    {locale === 'ar' ? definitionAr : definitionEn}
                  </span>
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
