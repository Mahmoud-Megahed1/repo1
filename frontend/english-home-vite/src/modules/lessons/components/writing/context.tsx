import useItemsPagination from '@hooks/use-items-pagination';
import { cn, localizedNumber } from '@lib/utils';
import type { WritingLesson } from '@modules/lessons/types';
import { useMarkTaskAsCompleted } from '@modules/lessons/mutations';
import { useParams } from '@tanstack/react-router';
import type { LevelId } from '@shared/types/entities';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { Progress } from '@ui/progress';
import {
  createContext,
  use,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import CompleteSentence from './complete-sentence';
import { useTranslation } from 'react-i18next';
import useLocale from '@hooks/use-locale';

type SentenceState = {
  answers: string[];
  isChecked: boolean;
  isCorrect: boolean | null;
};

type WritingContextType = {
  currentIndex: number;
  currentItem: string;
  isLastItem?: boolean;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  goNext: () => void;
  goPrev: () => void;
  resetAll: () => void;
  state: SentenceState;
  // eslint-disable-next-line no-unused-vars
  setAnswers: (values: string[]) => void;
  check: () => void;
};

const WritingContext = createContext<WritingContextType | null>(null);

export const WritingProvider: FC<{
  lesson: WritingLesson;
  children: ReactNode;
}> = ({ lesson: { sentences }, children }) => {
  const {
    currentItem,
    hasNextItems,
    hasPrevItems,
    currentIndex,
    next,
    prev,
    reset,
    isLast,
  } = useItemsPagination(sentences);

  const { id: levelName, day } = useParams({
    from: '/$locale/_globalLayout/_auth/app/levels/$id/$day/$lessonName',
  });
  const { mutate } = useMarkTaskAsCompleted();

  const [sentenceStates, setSentenceStates] = useState<
    Record<number, SentenceState>
  >({});

  useEffect(() => {
    setSentenceStates((prev) => {
      if (prev[currentIndex]) return prev;
      return {
        ...prev,
        [currentIndex]: { answers: [], isChecked: false, isCorrect: null },
      };
    });
  }, [currentIndex]);

  if (!currentItem) return null;

  const currentState = sentenceStates[currentIndex] ?? {
    answers: [],
    isChecked: false,
    isCorrect: null,
  };

  const setAnswers = (values: string[]) => {
    setSentenceStates((prev) => ({
      ...prev,
      [currentIndex]: { ...currentState, answers: values },
    }));
  };

  const check = () => {
    const correctAnswers = extractBraces(currentItem);
    const allCorrect = correctAnswers.every(
      (ans, i) =>
        currentState.answers[i]?.trim().toLowerCase() === ans.toLowerCase()
    );
    setSentenceStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...currentState,
        isChecked: true,
        isCorrect: allCorrect,
      },
    }));

    if (allCorrect) {
      mutate({
        levelName: levelName as LevelId,
        day: +day,
        taskName: currentItem,
        submission: { answers: currentState.answers },
        score: 100,
        feedback: 'Correct',
      });
    }
  };

  const resetAll = () => {
    setSentenceStates({});
    reset();
  };

  return (
    <WritingContext.Provider
      value={{
        currentIndex,
        currentItem,
        total: sentences.length,
        hasNext: hasNextItems,
        hasPrev: hasPrevItems,
        goNext: next,
        goPrev: prev,
        resetAll,
        state: currentState,
        setAnswers,
        check,
        isLastItem: isLast,
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">{children}</div>
    </WritingContext.Provider>
  );
};

export const WritingProgress = () => {
  const { currentIndex, total, resetAll } = useWriting();
  const { t } = useTranslation();
  const locale = useLocale() === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
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
      <Button variant="outline" onClick={resetAll}>
        {t('Global.reset')}
      </Button>
    </div>
  );
};

export const WritingSentence = () => {
  const { currentItem, state, setAnswers } = useWriting();
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl md:text-2xl">
          {t('Global.writing.title')}
        </CardTitle>
        <CardDescription>{t('Global.writing.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div
          lang="en"
          className="bg-accent/50 flex w-full items-center justify-center rounded-xl px-6 py-4"
        >
          <CompleteSentence
            sentence={currentItem}
            defaultValues={state.answers}
            onValuesChange={setAnswers}
            isChecked={state.isChecked}
          />
        </div>
        <WritingResult />
      </CardContent>
    </Card>
  );
};

export const WritingResult = () => {
  const { state, currentItem, check } = useWriting();
  const correctAnswers = extractBraces(currentItem);
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3">
      <Button className="mx-auto" variant="success" onClick={check}>
        {t('Global.writing.checkAnswers')}
      </Button>
      {state.isChecked && (
        <div className="text-center">
          {state.isCorrect ? (
            <p className="font-medium text-green-600">
              ✅ {t('Global.writing.correct')}
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-destructive font-medium">
                ❌ {t('Global.writing.incorrect')}
              </p>
              <ul lang="en" className="flex flex-wrap justify-center gap-2">
                {correctAnswers.map((ans, i) => (
                  <li
                    key={i}
                    className="bg-muted text-foreground rounded px-2 py-1 text-sm font-medium"
                  >
                    {ans}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const WritingControls = () => {
  const { goNext, goPrev, hasNext, hasPrev, currentIndex, total } =
    useWriting();
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={goPrev} disabled={!hasPrev}>
        {t('Global.prev')}
      </Button>
      <ul className="flex items-center gap-1">
        {Array(total)
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
      <Button variant="outline" onClick={goNext} disabled={!hasNext}>
        {t('Global.next')}
      </Button>
    </div>
  );
};

export const useWriting = () => {
  const ctx = use(WritingContext);
  if (!ctx)
    throw new Error('Writing compound component used outside <Writing>');
  return ctx;
};

function extractBraces(str: string) {
  const matches = [...str.matchAll(/\{([^}]+)\}/g)];
  return matches.map((m) => m[1]);
}
