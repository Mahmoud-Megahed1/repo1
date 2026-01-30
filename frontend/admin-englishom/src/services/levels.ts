import client from '@/lib/client';
import { LevelType } from '@/types/global.types';
import { LevelId } from '@/types/user.types';

export const getAllLevels = () => {
  return client.get<LevelType[]>(`/courses`);
};

export const getLevelById = (levelId: LevelId) => {
  return client.get<LevelType>(`/courses/${levelId}`);
};

export const updateLevel = (data: Partial<Omit<LevelType, 'id'>>) => {
  return client.patch(`/courses/admin`, data);
};

export const createLevel = (data: Omit<LevelType, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
  return client.post(`/courses/admin`, data);
};
