import type { LevelId } from '@shared/types/entities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  combineLevelAudios,
  compareAudio,
  markDayAsCompleted,
  uploadAudio,
  getSentenceAudios,
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

export function useCompareAudio({ levelName }: { levelName: LevelId }) {
  return useMutation({
    mutationKey: ['compare-audio'],
    mutationFn: ({
      audio,
      sentenceText,
    }: {
      audio: File;
      sentenceText: string;
    }) => compareAudio({ audio, level_name: levelName, sentenceText }),
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

export function useGetSentenceAudios({ levelName }: { levelName: LevelId }) {
  return useQuery({
    queryKey: ['get-sentence-audios', levelName],
    queryFn: () => getSentenceAudios({ levelName }),
  });
}
