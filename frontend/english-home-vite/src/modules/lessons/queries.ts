import type { LessonId, LevelId } from '@shared/types/entities';
import type { CustomExtract } from '@shared/types/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { IdiomLesson } from './components/idioms';
import { getCombinedLevelAudio, getLesson, getTodayAudio } from './services';
import type {
  DailyTestLesson,
  GrammarLesson,
  ListenLesson,
  PhrasalVerbLesson,
  PictureLesson,
  QuestionAnswerLesson,
  ReadLesson,
  SpeakLesson,
  TodayLesson,
  WritingLesson,
} from './types';
import { useEffect } from 'react';

type DataMap =
  | {
    type: CustomExtract<LessonId, 'READ'>;
    data: ReadLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'LISTEN'>;
    data: ListenLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'PICTURES'>;
    data: PictureLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'GRAMMAR'>;
    data: GrammarLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'Q_A'>;
    data: QuestionAnswerLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'PHRASAL_VERBS'>;
    data: PhrasalVerbLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'IDIOMS'>;
    data: IdiomLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'TODAY'>;
    data: TodayLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'WRITE'>;
    data: WritingLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'SPEAK'>;
    data: SpeakLesson[];
  }
  | {
    type: CustomExtract<LessonId, 'DAILY_TEST'>;
    data: DailyTestLesson[];
  };

export type LessonName = DataMap['type'];

type ReturnData = {
  lesson: DataMap;
  isLoading: boolean;
  isFetching: boolean;
  isEmpty: boolean;
  isSuccess: boolean;
};

export const useLessonQuery = <T extends LessonName>({
  day,
  lessonName,
  levelId,
}: {
  day: number | string;
  levelId: LevelId;
  lessonName: T;
}): ReturnData => {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [lessonName, { day, levelId }],
    queryFn: () =>
      getLesson<DataMap['data'][number]>({
        day: `${day}`,
        level_name: levelId,
        lesson_name: lessonName,
      }),
    staleTime: Infinity,
    enabled: +day >= 1 && +day <= 50,
  });
  const lesson = data?.data.data || [];
  const isEmpty = !isLoading && !isFetching && lesson.length === 0;
  useEffect(() => {
    if (lessonName === 'TODAY') {
      queryClient.prefetchQuery({
        queryKey: ['today-audio', day, levelId],
        queryFn: async () => {
          try {
            return await getTodayAudio({
              day: `${day}`,
              level_name: levelId,
            });
          } catch (error) {
            return null;
          }
        },
        staleTime: Infinity,
        retry: false,
      });
    }
  }, [day, lessonName, levelId, queryClient]);
  return {
    lesson: {
      type: lessonName,
      data: lesson,
    } as never,
    isLoading,
    isFetching,
    isEmpty,
    isSuccess,
  };
};

export function useTodayAudio({
  day,
  levelId,
}: {
  day: number | string;
  levelId: LevelId;
}) {
  return useQuery({
    queryKey: ['today-audio', day, levelId],
    queryFn: async () => {
      try {
        return await getTodayAudio({
          day: `${day}`,
          level_name: levelId,
        });
      } catch (err) {
        return null; // Return null on 404 or other errors to suppress console noise
      }
    },
    throwOnError: false,
    retry: false,
  });
}

export function useGetCombinedLevelAudio(levelName: LevelId) {
  return useQuery({
    queryKey: ['combined-level-audio', levelName],
    queryFn: () => getCombinedLevelAudio(levelName),
    throwOnError: false,
  });
}
