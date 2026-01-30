import { createLesson } from '@/services/lessons';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

const useCreateLesson = <T extends LessonName>({
  day,
  levelId,
  lessonName,
  onSuccess,
}: {
  day: string;
  levelId: LevelId;
  lessonName: T;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { mutate: fn, isPending } = useMutation({
    mutationKey: [`create${lessonName}`],
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [lessonName] });
      onSuccess?.();
    },
  });
  const mutate = (data: Omit<DataMap[T], 'id'>) => {
    return fn({
      data: [{ ...data }],
      level_name: levelId,
      day,
      lesson_name: lessonName,
    });
  };
  return {
    mutate,
    isPending,
  };
};

export default useCreateLesson;
