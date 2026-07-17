import axiosClient from '@lib/axios-client';
import type { UserType, LevelDetails } from './types/entities';

type GetMeResponse = {
  user: UserType;
  levelsDetails: Array<LevelDetails>;
};

export const getMe = async () => {
  return await axiosClient.get<GetMeResponse>('/users/me');
};

export const updateUserOccupation = async (userId: string, occupation: string) => {
  return await axiosClient.patch<UserType>(`/users/${userId}`, { occupation });
};
