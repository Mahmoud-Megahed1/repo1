import { getLesson } from '@/services/lessons';
import {
  DailyTestLesson,
  GrammarLesson,
  IdiomLesson,
  ListenLesson,
  PhrasalVerbLesson,
  PictureLesson,
  QuestionAnswerLesson,
  ReadLesson,
  SpeakLesson,
  TodayLesson,
  WriteLesson,
} from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { useQuery } from '@tanstack/react-query';

type DataMap = {
  READ: ReadLesson;
  GRAMMAR: GrammarLesson;
  PICTURES: PictureLesson;
  PHRASAL_VERBS: PhrasalVerbLesson;
  Q_A: QuestionAnswerLesson;
  IDIOMS: IdiomLesson;
  WRITE: WriteLesson;
  SPEAK: SpeakLesson;
  LISTEN: ListenLesson;
  DAILY_TEST: DailyTestLesson;
  TODAY: TodayLesson;
};

type LessonName = keyof DataMap;

type ReturnData<T extends LessonName> = {
  lesson: DataMap[T][];
  isLoading: boolean;
  isFetching: boolean;
  isEmpty: boolean;
};

const useLesson = <T extends LessonName>({
  day,
  lessonName,
  levelId,
}: {
  day: number;
  levelId: LevelId;
  lessonName: T;
}): ReturnData<T> => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [lessonName, { day, levelId }],
    queryFn: () =>
      getLesson<DataMap[T]>({
        day: `${day}`,
        level_name: levelId,
        lesson_name: lessonName,
      }),
  });
  const lesson = data?.data.data || [];
  const isEmpty = !isLoading && !isFetching && lesson.length === 0;
  return {
    lesson,
    isLoading,
    isFetching,
    isEmpty,
  };
};

export default useLesson;
