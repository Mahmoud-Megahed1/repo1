import axiosClient from '@lib/axios-client';
import { toFormData, type AxiosRequestConfig } from 'axios';
import type { LessonParams } from './types';
import type { LevelId } from '@shared/types/entities';

export const getLesson = <T = unknown>(
  params: LessonParams,
  config?: Omit<AxiosRequestConfig, 'params'>
) => {
  return axiosClient.get<{
    data: T[];
  }>('/files', { params, ...config });
};

export const uploadAudio = (
  data: {
    file: File;
  } & LessonParams
) => {
  return axiosClient.post<{ url: string }>(
    '/files/user-audio',
    toFormData(data)
  );
};

export const getTodayAudio = ({
  day,
  level_name,
}: Omit<LessonParams, 'lesson_name'>) => {
  return axiosClient.get<{ url: string; metadata?: any }>(
    `/files/user-audio/${level_name}/${day}`
  );
};

export function markDayAsCompleted({
  levelName,
  day,
  dailyTestResult
}: {
  levelName: LevelId;
  day: number | string;
  dailyTestResult?: any;
}) {
  return axiosClient.post(`/users/complete-day`, {
    levelName,
    day: +day,
    dailyTestResult
  });
}

export async function compareAudio(data: {
  audio: File;
  level_name: LevelId;
  sentenceText: string;
  day: number;
  lesson_name?: string;
}) {
  return axiosClient.post<{
    similarityPercentage: number;
    correctSentence: string;
    userTranscript: string;
    isPassed: boolean;
    audioUrl?: string;
  }>('/user-results/speak/compare-transcript', toFormData(data));
}

export function combineLevelAudios(levelName: LevelId) {
  return axiosClient.post<{ url: string }>(`/files/user-audio/combine-level`, {
    levelName,
  });
}

export function getCombinedLevelAudio(levelName: LevelId) {
  return axiosClient.get<{ url: string }>(
    `/files/user-audio/combine-level/${levelName}`
  );
}

export const getSentenceAudios = ({
  levelName,
}: {
  levelName: LevelId;
}) => {
  return axiosClient.get<{ sentence: string; url: string; metadata?: any }[]>(
    `/files/user-audio/sentences/${levelName}`
  );
};

export function markTaskAsCompleted({
  levelName,
  day,
  taskName,
  submission,
  score,
  feedback,
}: {
  levelName: LevelId;
  day: number;
  taskName: string;
  submission?: any;
  score?: number;
  feedback?: string;
}) {
  return axiosClient.post(`/users/complete-task`, {
    levelName,
    day,
    taskName,
    submission,
    score,
    feedback,
  });
}
