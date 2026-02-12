import useItemsPagination from '@hooks/use-items-pagination';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { useEffect, type ComponentProps, type FC } from 'react';
import type { PhrasalVerbLesson } from '../../types';
import { useTranslation } from 'react-i18next';
import useLocale from '@hooks/use-locale';
import NextLessonButton from '@components/next-lesson-button';
import { useParams } from '@tanstack/react-router';
import { useMarkTaskAsCompleted } from '../../mutations';
import { type LevelId } from '../../types';
import DefinitionCard from './definition-card';
import UseCasesCard from './use-cases-card';
import ExamplesCard from './examples-card';

type Props = {
  lesson: PhrasalVerbLesson[];
} & ComponentProps<'div'>;
const PhrasalVerbs: FC<Props> = ({ lesson, className, ...props }) => {
  const { t } = useTranslation();
  const locale = useLocale();

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

  const useCases = locale === 'ar' ? currentItem.useCases.ar : currentItem.useCases.en;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-4xl flex-col space-y-8 pb-10',
        className
      )}
      {...props}
    >
      <div className="flex flex-col space-y-8">
        <DefinitionCard
          definitionAr={currentItem.definitionAr}
          definitionEn={currentItem.definitionEn}
        />
        <UseCasesCard useCases={useCases} />
        <ExamplesCard examples={currentItem.examples} />
      </div>

      <div className="flex justify-center items-center gap-4 py-4">
        <div className="text-muted-foreground text-sm font-medium border px-4 py-2 rounded-full bg-secondary/50">
          {currentIndex + 1} / {lesson.length}
        </div>
      </div>

      <Card className="mt-8 border-border/50 bg-secondary/30 backdrop-blur-sm">
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

      {isLast && (
        <div className="flex justify-end mt-10">
          <NextLessonButton lessonName="IDIOMS" onClick={handleComplete} />
        </div>
      )}
    </div>
  );
};

export default PhrasalVerbs;
