import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
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
import { Progress } from '@ui/progress';
import useLocale from '@hooks/use-locale';
import { useMarkDayAsCompleted } from '../mutations';
import type { LevelId } from '@shared/types/entities';
import { useParams } from '@tanstack/react-router';
import { Link } from '@shared/i18n/routing';

const PASS_SCORE = 70;
type Props = {
  lesson: DailyTestLesson[];
  day: number | string;
  levelId: LevelId;
};
type QuestionState = {
  selectedAnswer?: string;
  isSubmitted?: boolean;
  isCorrect?: boolean;
} & DailyTestLesson;
const DailyTest: FC<Props> = ({ lesson, day, levelId }) => {
  const { t } = useTranslation();
  const { mutate, isSuccess } = useMarkDayAsCompleted({
    day,
    levelName: levelId,
  });
  const [testStatus, setTestStatus] = useState<
    'idle' | 'completed' | 'reviewed'
  >('idle');
  const [questionsStates, setQuestionsStates] =
    useState<QuestionState[]>(lesson);
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
    setTestStatus('idle');
    setQuestionsStates((prev) =>
      prev.map((q) => ({
        ...q,
        isSubmitted: false,
        isCorrect: false,
        selectedAnswer: undefined,
      }))
    );
  }, [reset]);

  useEffect(() => {
    setTestStatus((prev) => {
      if (questionsStates.every((q) => q.isSubmitted)) return 'completed';
      return prev;
    });
  }, [questionsStates]);

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
    }
  }, [testStatus, getResult, mutate, isSuccess, levelId, day, questionsStates]);

  if (!currentItem) return null;

  const { question, answers, type } = currentItem;
  return (
    <div className="mx-auto flex max-w-2xl flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {testStatus !== 'completed' && (
          <TestProgress
            currentIndex={currentIndex}
            total={questionsStates.length}
          />
        )}
        {testStatus === 'reviewed' && (
          <Button
            variant={'outline'}
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
        <Card>
          <CardHeader lang="en" className="flex items-center gap-2">
            <div className="dark:to-secondary to-primary flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#96796e] p-3 text-xl font-bold text-white shadow-lg">
              {currentIndex + 1}
            </div>
            <CardTitle
              lang={type === 'text' ? 'en' : undefined}
              className="text-lg font-bold"
            >
              {type === 'text' && question}
              {type === 'audio' && t('Global.dailyTest.listenToAudio')}
              {type === 'image' && t('Global.dailyTest.lookAtImage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {type === 'audio' && (
              <AudioPlayback
                key={question}
                audioSrc={question}
                className="border-input/50 w-full border"
              />
            )}
            {type === 'image' && (
              <img
                src={question}
                alt="Question"
                className="mx-auto max-h-60 rounded-md object-contain"
              />
            )}

            <RadioGroup
              lang="en"
              className="mt-4"
              key={currentIndex}
              disabled={currentItem.isSubmitted}
              defaultValue={currentItem.selectedAnswer}
              onValueChange={onSelectValue}
            >
              {answers && answers.map(({ text, isCorrect }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={text}
                    id={`answer-${index}`}
                    className="peer border-blue-400 text-blue-500 focus-visible:border-none focus-visible:ring-blue-500 disabled:opacity-100 [&_svg]:fill-blue-500"
                  />
                  <Label
                    htmlFor={`answer-${index}`}
                    className={cn(
                      'bg-accent/50 w-full cursor-pointer rounded-md p-3 peer-disabled:opacity-100',
                      {
                        'peer-data-[state=checked]:border-blue-200 peer-data-[state=checked]:bg-blue-100 peer-data-[state=checked]:text-blue-800 peer-data-[state=checked]:dark:border-blue-800 peer-data-[state=checked]:dark:bg-blue-950 peer-data-[state=checked]:dark:text-blue-300':
                          !currentItem.isSubmitted,
                        'peer-data-[state=checked]:border-green-200 peer-data-[state=checked]:bg-green-100 peer-data-[state=checked]:text-green-800 peer-data-[state=checked]:dark:border-green-800 peer-data-[state=checked]:dark:bg-green-950 peer-data-[state=checked]:dark:text-green-300':
                          currentItem.isCorrect && isCorrect,
                        'peer-data-[state=checked]:border-red-200 peer-data-[state=checked]:bg-red-100 peer-data-[state=checked]:text-red-800 peer-data-[state=checked]:dark:border-red-800 peer-data-[state=checked]:dark:bg-red-950 peer-data-[state=checked]:dark:text-red-300':
                          currentItem.isSubmitted &&
                          !currentItem.isCorrect &&
                          !isCorrect,
                        'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300':
                          currentItem.isSubmitted &&
                          !currentItem.isCorrect &&
                          isCorrect,
                      }
                    )}
                  >
                    {text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-8 flex justify-between gap-2">
              <Button
                onClick={prev}
                variant={'outline'}
                disabled={!hasPrevItems}
              >
                {t('Global.prev')}
              </Button>
              {currentItem.isSubmitted ? (
                <Button
                  onClick={next}
                  variant={'outline'}
                  disabled={!hasNextItems}
                >
                  {t('Global.next')}
                </Button>
              ) : (
                <Button
                  onClick={onSubmit}
                  disabled={!currentItem.selectedAnswer}
                >
                  {currentIndex === questionsStates.length - 1
                    ? t('Global.dailyTest.finish')
                    : t('Global.dailyTest.submitAnswer')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {testStatus === 'reviewed' && (
        <Button className="mx-auto" onClick={resetTest}>
          {t('Global.reset')}
        </Button>
      )}
    </div>
  );
};

const TestProgress = ({
  currentIndex,
  total,
}: {
  currentIndex: number;
  total: number;
}) => {
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <div className="flex flex-1 items-center gap-4">
      <div className="shrink-0">
        {localizedNumber(currentIndex + 1, locale)} {t('Global.of')}{' '}
        {localizedNumber(total, locale)}
      </div>
      <Progress
        value={((currentIndex + 1) / total) * 100}
        className="flex-1 md:max-w-52"
      />
    </div>
  );
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
            params={{ id, day: String(+day + 1), lessonName: 'READ' }}
          >
            Next Day {+day + 1}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default DailyTest;
