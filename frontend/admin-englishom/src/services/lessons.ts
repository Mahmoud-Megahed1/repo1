import client from '@/lib/client';
import { LessonParams } from '@/types/lessons.types';
import { AxiosRequestConfig, toFormData } from 'axios';

export const getLesson = <T = unknown>(
  params: LessonParams,
  config?: Omit<AxiosRequestConfig, 'params'>,
) => {
  return client.get<{
    data: T[];
  }>('/files', { params, ...config });
};

export const uploadMedia = (
  data: {
    file: File;
  } & LessonParams,
) => {
  return client.post<{ url: string }>('/files/single-file', toFormData(data));
};

export const createLesson = async (
  data: {
    data: unknown[];
  } & LessonParams,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lesson: Record<string, any> = data.data.at(0) || {};

  await Promise.all(
    Object.entries(lesson).map(async ([key, value]) => {
      if (value instanceof File) {
        const res = await uploadMedia({
          file: value,
          day: data.day,
          lesson_name: data.lesson_name,
          level_name: data.level_name,
        });
        lesson[key] = res.data.url;
      }
    }),
  );

  data.data = [lesson];
  return client.post<{ message: string; key: string }>('/files', data);
};

export const deleteLesson = (
  data: {
    id: string;
  } & LessonParams,
) => {
  const { id, ...rest } = data;
  const params = {
    ...rest,
    objectId: id,
  };
  return client.delete(`/files/delete-obj`, { params });
};

export const updateLessonMetadata = (
  data: {
    aiInstructions?: string;
  } & LessonParams,
) => {
  return client.post('/files/metadata', data);
};
