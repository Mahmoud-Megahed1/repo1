import client from '@/lib/client';
import { LessonParams } from '@/types/lessons.types';
import { LevelId } from '@/types/user.types';
import { toFormData } from 'axios';

export const uploadAudio = (
  data: {
    file: File;
  } & LessonParams,
) => {
  return client.post<{ url: string }>('/files/user-audio', toFormData(data));
};

export const getDayAudio = ({
  day,
  level_name,
}: Omit<LessonParams, 'lesson_name'>) => {
  return client.get<{ url: string }>(`/files/user-audio/${level_name}/${day}`);
};

export const getLevelAudios = (levelId: LevelId) => {
  return client.get<Array<{ url: string }>>(`/files/user-audio/${levelId}`);
};

export const getAllAudios = () => {
  return client.get<Array<{ url: string }>>(`/files/user-audio`);
};
