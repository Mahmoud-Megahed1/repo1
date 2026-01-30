import client from '@/lib/client';
import { Certification, LevelId } from '@/types/user.types';
import { AxiosRequestConfig } from 'axios';

export const getUserLevels = (config?: AxiosRequestConfig) => {
  return client.get<LevelId[]>('/users/levels', config);
};

export const payment = ({
  data,
  config,
}: {
  data: {
    level_name: LevelId;
    phone_number: string;
    city: string;
    country: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return client.post<{ clientURL: string }>(
    '/payment/process-payment',
    { ...data },
    config,
  );
};

export const getCompletedDays = (levelName: LevelId) => {
  return client.get<number>(`/users/completed-days`, {
    params: {
      levelName,
    },
  });
};

export const markDayAsCompleted = ({
  levelName,
  day,
}: {
  levelName: LevelId;
  day: number;
}) => {
  return client.post(`/users/complete-day`, {
    levelName,
    day,
  });
};

export const markLevelAsCompleted = (levelName: LevelId) => {
  return client.post(`/users/complete-level`, {
    level_name: levelName,
  });
};

export const getCertification = (levelName: LevelId) => {
  return client.get<Certification>(`/users/certificate/${levelName}`);
};
