import type { LevelId } from '@shared/types/entities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  combineLevelAudios,
  compareAudio,
  markDayAsCompleted,
  uploadAudio,
  getSentenceAudios,
  markTaskAsCompleted,
} from './services';
import type { LessonParams } from './types';

export function useUploadAudio(options: LessonParams) {
  return useMutation({
    mutationKey: ['upload-user-audio'],
    mutationFn: (file: File) => uploadAudio({ ...options, file }),
  });
}

export function useMarkDayAsCompleted(
  options: Parameters<typeof markDayAsCompleted>['0']
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-day-as-completed', options],
    mutationFn: () => markDayAsCompleted(options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });
}

export function useCompareAudio({ levelName, day, lessonName }: { levelName: LevelId; day: number; lessonName?: string }) {
  return useMutation({
    mutationKey: ['compare-audio'],
    mutationFn: ({
      audio,
      sentenceText,
    }: {
      audio: File;
      sentenceText: string;
    }) => compareAudio({ audio, level_name: levelName, sentenceText, day, lesson_name: lessonName }),
  });
}

export function useCombineLevelAudios(levelName: LevelId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['combine-level-audios', levelName],
    mutationFn: () => combineLevelAudios(levelName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['combined-level-audio', levelName],
      });
    },
  });
}

export function useMarkTaskAsCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-task-completed'],
    mutationFn: markTaskAsCompleted,
    onSuccess: () => {
      // invalidating getMe might differ based on if we track tasks there
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      queryClient.invalidateQueries({ queryKey: ['completedTasks'] });
    },
  });
}

export function useGetSentenceAudios({ levelName }: { levelName: LevelId }) {
  return useQuery({
    queryKey: ['get-sentence-audios', levelName],
    queryFn: () => getSentenceAudios({ levelName }),
  });
}
