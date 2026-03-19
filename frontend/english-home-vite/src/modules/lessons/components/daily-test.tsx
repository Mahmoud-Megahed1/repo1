import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useLessonProgressStore } from '@hooks/use-lesson-progress-store';
import type { DailyTestLesson } from '../types';
import useItemsPagination from '@hooks/use-items-pagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { AudioPlayback } from '@components/audio-playback';
import { Button } from '@ui/button';
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@ui/radio-group';
import { Label } from '@ui/label';
import { cn, localizedNumber } from '@lib/utils';
import useLocale from '@hooks/use-locale';
import { useMarkDayAsCompleted, useMarkTaskAsCompleted, useGetDayStatus } from '../mutations';
import type { LevelId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Link } from '@shared/i18n/routing';
import { ChevronLeftIcon } from 'lucide-react';

const PASS_SCORE = 70;

type QuestionState = {
  selectedAnswer?: string;
  isSubmitted?: boolean;
  isCorrect?: boolean;
} & DailyTestLesson;

const TestProgress = ({
  currentIndex,
  total,
}: {
  currentIndex: number;
  total: number;
}) => {
  const setProgress = useLessonProgressStore((s) => s.setProgress);
  const resetProgress = useLessonProgressStore((s) => s.resetProgress);

  useEffect(() => {
    setProgress(currentIndex, total);
  }, [currentIndex, total, setProgress]);

  useEffect(() => {
    return () => resetProgress();
  }, [resetProgress]);

  return null;
};

const ResultCard = ({
  score,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  onReset,
  onReview,
  isPassed = false,
}: {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  onReset?: () => void;
  onReview?: () => void;
  isPassed?: boolean;
}) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  const { day, id } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader lang="en" className="text-center">
          <CardTitle className="text-xl font-bold">
            {t('Global.dailyTest.testCard.title')}
          </CardTitle>
          <span
            className={cn(
              'text-5xl font-bold text-blue-600 dark:text-blue-400',
              {
                'text-green-500 dark:text-green-500': score >= PASS_SCORE,
                'text-destructive dark:text-destructive': score < PASS_SCORE,
              }
            )}
          >
            {localizedNumber(score, locale)}%
          </span>
          <CardDescription>
            {t('Global.dailyTest.testCard.description', {
              correctAnswers: localizedNumber(correctAnswers, locale),
              totalQuestions: localizedNumber(totalQuestions, locale),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4 *:flex-1 sm:flex-row">
            {[
              {
                id: 'correct',
                label: t('Global.dailyTest.testCard.correct'),
                value: correctAnswers,
              },
              {
                id: 'incorrect',
                label: t('Global.dailyTest.testCard.inCorrect'),
                value: incorrectAnswers,
              },
              {
                id: 'total',
                label: t('Global.dailyTest.testCard.total'),
                value: totalQuestions,
              },
            ].map(({ id, label, value }, i) => (
              <li
                key={i}
                className="border-input/50 bg-accent/20 flex flex-col rounded-md border py-4 text-center"
              >
                <span
                  className={cn('text-2xl font-bold', {
                    'text-green-500': id === 'correct',
                    'text-destructive': id === 'incorrect',
                    'text-blue-600 dark:text-blue-400': id === 'total',
                  })}
                >
                  {localizedNumber(value, locale)}
                </span>
                <span className="text-sm capitalize">{label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="mx-auto flex flex-col gap-4 *:w-[17ch] md:flex-row">
          <Button variant={'secondary'} onClick={onReset}>
            {t('Global.dailyTest.testCard.retake')}
          </Button>
          <Button variant={'outline'} onClick={onReview}>
            {t('Global.dailyTest.testCard.review')}
          </Button>
        </CardFooter>
      </Card>
      {isPassed && (
        <Button className="w-2xs mx-auto mt-4 text-base" size={'lg'} asChild>
          <Link
            to="/app/levels/$id/$day/$lessonName"
            params={{ id: id as any, day: String(+day + 1), lessonName: 'READ' }}
          >
            {t('Global.nextDay' as any, { day: +day + 1 })}
          </Link>
        </Button>
      )}
    </div>
  );
};

type DailyTestProps = {
  lesson: DailyTestLesson[];
  day: number | string;
  levelId: LevelId;
};

const DailyTest: FC<DailyTestProps> = ({ lesson, day, levelId }) => {
  const { t } = useTranslation();
  const { mutate, isSuccess, reset: resetMutation } = useMarkDayAsCompleted();

  const { data: dayStatus } = useGetDayStatus({
    levelName: levelId as LevelId,
    day: +day,
  });

  const [testStatus, setTestStatus] = useState<
    'idle' | 'completed' | 'reviewed'
  >('idle');
  const [questionsStates, setQuestionsStates] =
    useState<QuestionState[]>(lesson);

  useEffect(() => {
    if (dayStatus?.data?.dailyTestResult?.isPassed) {
      const savedResult = dayStatus.data.dailyTestResult;
      setQuestionsStates(savedResult.questions);
      setTestStatus('completed');
    }
  }, [dayStatus]);

  const {
    currentIndex,
    currentItem,
    next,
    prev,
    hasNextItems,
    hasPrevItems,
    reset,
  } = useItemsPagination(questionsStates);

  const onSelectValue = useCallback(
    (value: string) => {
      setQuestionsStates((prev) => {
        prev[currentIndex].selectedAnswer = value;
        return [...prev];
      });
    },
    [currentIndex]
  );

  const onSubmit = useCallback(() => {
    setQuestionsStates((prev) => {
      const isCorrect = prev[currentIndex].answers?.some(
        (ans) => ans.text === prev[currentIndex].selectedAnswer && ans.isCorrect
      );
      prev[currentIndex].isSubmitted = true;
      prev[currentIndex].isCorrect = isCorrect;
      return [...prev];
    });
  }, [currentIndex]);

  const getResult = useMemo(() => {
    const correctAnswers = questionsStates.filter((q) => q.isCorrect).length;
    return {
      correctAnswers,
      totalQuestions: questionsStates.length,
      incorrectAnswers: questionsStates.length - correctAnswers,
      score: Math.round((correctAnswers / questionsStates.length) * 100),
      isPassed:
        Math.round((correctAnswers / questionsStates.length) * 100) >=
        PASS_SCORE,
    };
  }, [questionsStates]);

  const resetTest = useCallback(() => {
    reset();
    resetMutation();
    setTestStatus('idle');
    setQuestionsStates((prev) =>
      prev.map((q) => ({
        ...q,
        isSubmitted: false,
        isCorrect: false,
        selectedAnswer: undefined,
      }))
    );
  }, [reset, resetMutation]);

  useEffect(() => {
    setTestStatus((prev) => {
      if (prev === 'completed' || prev === 'reviewed') return prev;
      if (questionsStates.every((q) => q.isSubmitted)) return 'completed';
      return prev;
    });
  }, [questionsStates]);

  const { mutate: markTaskCompleted } = useMarkTaskAsCompleted();

  useEffect(() => {
    if (testStatus === 'completed' && getResult.isPassed && !isSuccess) {
      mutate({
        levelName: levelId as LevelId,
        day: +day,
        dailyTestResult: {
          score: getResult.score,
          questions: questionsStates,
          isPassed: getResult.isPassed
        }
      });
      markTaskCompleted({
        levelName: levelId as LevelId,
        day: +day,
        taskName: 'DAILY_TEST',
        submission: { completed: true },
        score: getResult.score,
        feedback: 'Daily Test Passed',
      });
    }
  }, [testStatus, getResult, mutate, isSuccess, levelId, day, questionsStates, markTaskCompleted]);

  if (!currentItem) return null;

  const { question, answers, type } = currentItem;

  return (
    <div className="mx-auto flex max-w-5xl flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        {testStatus !== 'completed' && (
          <TestProgress
            currentIndex={currentIndex}
            total={questionsStates.length}
          />
        )}
        {testStatus === 'reviewed' && (
          <Button
            variant={'outline'}
            size="sm"
            onClick={() => {
              setTestStatus('completed');
            }}
          >
            {t('Global.dailyTest.showResults')}
          </Button>
        )}
      </div>

      {testStatus === 'completed' ? (
        <ResultCard
          {...getResult}
          onReset={resetTest}
          onReview={() => {
            reset();
            setTestStatus('reviewed');
          }}
          isPassed={getResult.isPassed}
        />
      ) : (
        <Card className="overflow-hidden border-border shadow-card">
          <div className={cn(
            'flex flex-col',
            type === 'image' && 'lg:flex-row lg:items-stretch'
          )}>
            {/* Content + Options — first in DOM (RIGHT in RTL) */}
            <div className={cn(
              'flex flex-col p-4',
              type === 'image' ? 'flex-1' : 'w-full max-w-3xl mx-auto'
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#96796e] text-lg font-bold text-white shadow-md">
                  {currentIndex + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {type === 'text' && question}
                  {type === 'audio' && t('Global.dailyTest.listenToAudio')}
                  {type === 'image' && t('Global.dailyTest.lookAtImage')}
                </h3>
              </div>

              <div className="flex-1">
                {type === 'audio' && (
                  <div className="mb-6">
                    <AudioPlayback
                      key={question}
                      audioSrc={question}
                      className="w-full"
                    />
                  </div>
                )}

                <RadioGroup
                  lang="en"
                  key={currentIndex}
                  disabled={currentItem.isSubmitted}
                  defaultValue={currentItem.selectedAnswer}
                  onValueChange={onSelectValue}
                  className="grid gap-3"
                >
                  {answers && answers.map(({ text, isCorrect }, index) => (
                    <div key={index} className="relative">
                      <RadioGroupItem
                        value={text}
                        id={`answer-${index}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`answer-${index}`}
                        className={cn(
                          'flex w-full cursor-pointer items-center rounded-xl border-2 border-transparent bg-accent/30 p-4 text-base font-medium transition-all hover:bg-accent/50',
                          'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary',
                          currentItem.isSubmitted && {
                            'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400': isCorrect,
                            'border-destructive bg-destructive/5 text-destructive': currentItem.selectedAnswer === text && !isCorrect,
                            'opacity-50': currentItem.selectedAnswer !== text && !isCorrect
                          }
                        )}
                      >
                        <div className={cn(
                          'mr-3 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-current',
                          'peer-data-[state=checked]:bg-primary peer-data-[state=checked]:border-primary'
                        )}>
                          {currentItem.selectedAnswer === text && (
                            <div className="size-2 rounded-full bg-white" />
                          )}
                        </div>
                        {text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation Controls */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                <Button
                  onClick={prev}
                  variant="ghost"
                  disabled={!hasPrevItems}
                  className="gap-2"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  {t('Global.prev')}
                </Button>

                {currentItem.isSubmitted ? (
                  <Button
                    onClick={next}
                    variant="default"
                    disabled={!hasNextItems}
                    className="min-w-[120px]"
                  >
                    {t('Global.next')}
                  </Button>
                ) : (
                  <Button
                    onClick={onSubmit}
                    disabled={!currentItem.selectedAnswer}
                    variant="default"
                    className="min-w-[150px] bg-primary hover:bg-primary/90"
                  >
                    {currentIndex === questionsStates.length - 1
                      ? t('Global.dailyTest.finish')
                      : t('Global.dailyTest.submitAnswer')}
                  </Button>
                )}
              </div>
            </div>

            {/* Image — second in DOM (LEFT in RTL), no frame */}
            {type === 'image' && (
              <div className="relative group lg:w-[45%] xl:w-[50%] shrink-0 flex items-center justify-center p-0 min-h-[200px] lg:min-h-0 overflow-hidden">
                <img
                  src={question}
                  alt="Daily Test Question"
                  className="w-full h-full max-h-[250px] lg:max-h-[400px] rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {testStatus === 'reviewed' && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={resetTest} className="gap-2">
            {t('Global.reset')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DailyTest;
