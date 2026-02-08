import type { LevelId } from '@shared/types/entities';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  combineLevelAudios,
  compareAudio,
  markDayAsCompleted,
  uploadAudio,
  getSentenceAudios,
  markTaskAsCompleted,
  getDayStatus,
} from './services';
import type { LessonParams } from './types';

export function useUploadAudio(options: LessonParams) {
  return useMutation({
    mutationKey: ['upload-user-audio'],
    mutationFn: (file: File) => uploadAudio({ ...options, file }),
  });
}

export function useMarkDayAsCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['mark-day-as-completed'],
    mutationFn: (options: Parameters<typeof markDayAsCompleted>['0']) =>
      markDayAsCompleted(options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });
}

export function useCompareAudio({ levelName, day, lessonName }: { levelName: LevelId; day: number; lessonName?: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['compare-audio'],
    mutationFn: ({
      audio,
      sentenceText,
    }: {
      audio: File;
      sentenceText: string;
    }) => compareAudio({ audio, level_name: levelName, sentenceText, day, lesson_name: lessonName }),
    onSuccess: (data, variables) => {
      // Optimistically update the 'today-audio' cache
      queryClient.setQueryData(['today-audio', day, levelName], {
        data: {
          url: data.data.audioUrl,
          metadata: {
            ...data.data,
            similarityPercentage: data.data.similarityPercentage.toString(),
            isPassed: data.data.isPassed.toString(),
          }
        }
      });

      // Optimistically update the 'get-sentence-audios' cache to persist on navigation
      queryClient.setQueryData(
        ['get-sentence-audios', levelName],
        (oldData: { data: { sentence: string; url: string; metadata?: any }[] } | undefined) => {
          if (!oldData?.data) {
            // If no old data, create a new array with this result
            const sentenceKey = variables.sentenceText
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
              .replace(/_+/g, '_')
              .substring(0, 100);
            return {
              data: [{
                sentence: sentenceKey,
                url: data.data.audioUrl,
                metadata: {
                  similarityPercentage: data.data.similarityPercentage,
                  correctSentence: data.data.correctSentence,
                  userTranscript: data.data.userTranscript,
                  isPassed: data.data.isPassed,
                }
              }]
            };
          }
          // Update existing array
          const sentenceKey = variables.sentenceText
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .substring(0, 100);

          const existingIndex = oldData.data.findIndex(s => s.sentence === sentenceKey);
          const newEntry = {
            sentence: sentenceKey,
            url: data.data.audioUrl || '',
            metadata: {
              similarityPercentage: data.data.similarityPercentage,
              correctSentence: data.data.correctSentence,
              userTranscript: data.data.userTranscript,
              isPassed: data.data.isPassed,
            }
          };

          if (existingIndex >= 0) {
            // Update existing entry
            const newData = [...oldData.data];
            newData[existingIndex] = newEntry;
            return { data: newData };
          } else {
            // Add new entry
            return { data: [...oldData.data, newEntry] };
          }
        }
      );

      // Don't invalidate queries - rely on optimistic updates to prevent stale data race conditions
      // queryClient.invalidateQueries({ queryKey: ['today-audio', day, levelName] });
      // queryClient.invalidateQueries({ queryKey: ['get-sentence-audios', levelName] });
    },
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

export function useGetDayStatus({
  levelName,
  day,
}: {
  levelName: LevelId;
  day: number;
}) {
  return useQuery({
    queryKey: ['day-status', levelName, day],
    queryFn: () => getDayStatus(levelName, day),
    enabled: !!levelName && !!day,
  });
}
