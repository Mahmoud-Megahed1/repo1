'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useLesson from '@/hooks/use-lesson';
import useLessonQueryParams from '@/hooks/use-lesson-query-params';
import usePagination from '@/hooks/use-pagination';
import { markDayAsCompleted } from '@/services/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { AnswerItem, AnswersGroup } from './answers-list';
const CHOOSE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const PASS_RATE = 0.7; // 70% pass rate
//TODO: Need improvements
const DailyTest = ({ handleReset }: { handleReset: () => void }) => {
  const [answers, setAnswers] = useState<Record<string, Set<number>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(0);
  const [open, setOpen] = useState(false);
  const tGlobal = useTranslations('Global');
  const t = useTranslations('DailyTestPage');
  const queryClient = useQueryClient();
  const [isPassed, setIsPassed] = useState(false);
  const [{ day, levelId }] = useLessonQueryParams();
  const { mutate } = useMutation({
    mutationKey: ['mark-as-complete'],
    mutationFn: markDayAsCompleted,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['completed-days', levelId] });
    },
  });
  const { isLoading, lesson, isEmpty } = useLesson({
    day,
    levelId,
    lessonName: 'DAILY_TEST',
  });
  const {
    currentItem: dailyTest,
    hasNextItems,
    hasPrevItems,
    next,
    prev,
    currentIndex,
  } = usePagination(lesson);
  const handleSubmission = useCallback(() => {
    setIsSubmitted(true);
    setOpen(true);
    let correct = 0;
    lesson.forEach((item) => {
      const correctAnswers = item.answers
        .map((answer, index) => (answer.isCorrect ? index : -1))
        .filter((index) => index !== -1);
      const userAnswers = Array.from(answers[item.id] || []);
      userAnswers.forEach((userAnswer) => {
        if (correctAnswers.includes(userAnswer)) {
          correct++;
        }
      });
      setIsPassed(correct / lesson.length >= PASS_RATE);
      if (correct / lesson.length >= PASS_RATE) {
        mutate({ day, levelName: levelId });
      }
      setResult(correct);
    });
  }, [lesson, answers, mutate, day, levelId]);
  const handleOnChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      setAnswers((prev) => ({ ...prev, [dailyTest.id]: new Set(values) }));
    },
    [dailyTest?.id],
  );
  if (isLoading) return 'Loading...';
  if (isEmpty) return 'Coming Soon';
  return (
    <div className="flex size-full flex-col gap-8 text-primary">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold md:text-xl">
          {t('title')}{' '}
          <span dir="ltr" lang="en">
            ({currentIndex + 1} / {lesson.length})
          </span>
        </h3>
        {isSubmitted && (
          <span>
            {t('grade')}:{' '}
            <span dir="ltr" lang="en">
              {result} / {lesson.length}
            </span>
          </span>
        )}
      </div>
      <Card className="border-muted-foreground/30 dark:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg md:text-lg">
            {t('description')}:
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {dailyTest.type === 'text' && (
            <h4 lang="en" className="text-lg font-bold md:text-xl">
              {dailyTest.question}
            </h4>
          )}
          {dailyTest.type === 'image' && (
            <div>
              <img
                src={dailyTest.question}
                alt=""
                className="w-[400px] rounded-lg"
              />
              <h4 className="mt-2 text-lg font-bold md:text-xl">
                {t('pictureDescription')}:
              </h4>
            </div>
          )}
          {dailyTest.type === 'audio' && (
            <div>
              <audio
                controls
                src={dailyTest.question}
                controlsList="nodownload"
                className="w-full max-w-2xl"
              >
                <track
                  kind="captions"
                  src={dailyTest.question}
                  srcLang="en"
                  label="English captions"
                  default
                />
              </audio>
              <h4 className="mt-2 text-lg font-bold md:text-xl">
                {t('audioDescription')}:
              </h4>
            </div>
          )}
          <AnswersGroup
            key={dailyTest.id}
            values={Array.from(answers[dailyTest.id] || [])}
            onValuesChange={handleOnChange}
            lang="en"
          >
            {dailyTest.answers.map(({ text, isCorrect }, i) => (
              <li key={i} className="text-lg font-semibold">
                <AnswerItem
                  disabled={isSubmitted}
                  variant={
                    isSubmitted
                      ? isCorrect
                        ? 'correct'
                        : answers[dailyTest.id].has(i)
                          ? 'wrong'
                          : 'default'
                      : 'default'
                  }
                  value={i}
                >
                  <span className="me-4">
                    {CHOOSE_LABELS.at(i % CHOOSE_LABELS.length)} {')'}
                  </span>
                  {text}
                </AnswerItem>
              </li>
            ))}
          </AnswersGroup>
          <ul id={`${currentIndex}`} className="mt-4 space-y-4"></ul>
          <div className="mt-8 flex items-center justify-between">
            <Button
              disabled={!hasPrevItems}
              onClick={prev}
              variant={'secondary'}
              className="rounded-full"
            >
              {tGlobal('prev')}
            </Button>
            {hasNextItems ? (
              <Button
                onClick={next}
                disabled={!answers[dailyTest.id]?.size}
                className="rounded-full"
              >
                {tGlobal('next')}
              </Button>
            ) : (
              <Button
                className="rounded-full"
                onClick={isSubmitted ? handleReset : handleSubmission}
                disabled={!answers[dailyTest.id]?.size}
              >
                {isSubmitted ? 'Retry' : 'Submit'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-center">
          <DialogHeader className="mx-auto">
            <DialogTitle className="text-2xl font-bold">
              {isPassed ? 'Congratulations!' : 'Try Again!'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium">
              You got {`${result} / ${lesson.length}`}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Wrapper = () => {
  const [key, setKey] = useState(0);
  const handleReset = () => {
    setKey((prevKey) => prevKey + 1);
  };
  return <DailyTest key={key} handleReset={handleReset} />;
};

export default Wrapper;
