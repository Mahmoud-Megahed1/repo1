import { deleteLesson } from '@/services/lessons';
import { LessonsId } from '@/types/global.types';
import { LevelId } from '@/types/user.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const useDeleteLesson = <T extends LessonsId>({
  day,
  levelId,
  lessonName,
  id,
  onSuccess,
}: {
  day: string;
  levelId: LevelId;
  lessonName: T;
  id: string;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { mutate: fn, isPending } = useMutation({
    mutationKey: [`delete${lessonName}`],
    mutationFn: deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [lessonName] });
      onSuccess?.();
    },
  });
  const mutate = useCallback(() => {
    return fn({
      id,
      level_name: levelId,
      day,
      lesson_name: lessonName,
    });
  }, [day, fn, id, lessonName, levelId]);
  return {
    mutate,
    isPending,
  };
};

export default useDeleteLesson;
