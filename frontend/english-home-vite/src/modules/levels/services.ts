import axiosClient from '@lib/axios-client';
import type { LevelId } from '@shared/types/entities';
import type { AxiosRequestConfig } from 'axios';
import type { Certification, LevelType, PaymentParams } from './types';

export function payment({
  data,
  config,
}: {
  data: PaymentParams;
  config?: AxiosRequestConfig;
}) {
  return axiosClient.post<{ clientURL: string }>(
    '/payment/process-payment',
    { ...data },
    config
  );
}

export function getCompletedDays(levelName: LevelId) {
  return axiosClient.get<number>(`/users/completed-days`, {
    params: {
      levelName,
    },
  });
}

export function markLevelAsCompleted(levelName: LevelId) {
  return axiosClient.post(`/users/complete-level`, {
    level_name: levelName,
  });
}

export function getCertification(levelName: LevelId) {
  return axiosClient.get<Certification>(`/users/certificate/${levelName}`);
}

export function getUserLevels(config?: AxiosRequestConfig) {
  return axiosClient.get<LevelId[]>('/users/levels', config);
}

export function getAllLevels() {
  return axiosClient.get<LevelType[]>(`/courses`);
}

export function getLevelById(levelId: LevelId) {
  return axiosClient.get<LevelType>(`/courses/${levelId}`);
}

export function getCompletedTasks(levelName: LevelId, day: number | string) {
  return axiosClient.get<string[]>(`/users/completed-tasks`, {
    params: { levelName, day },
  });
}
