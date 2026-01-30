import axiosClient from '@lib/axios-client';
import type { AxiosRequestConfig } from 'axios';
import type { LevelDetails, UserType } from './types/entities';

export const getMe = async () => {
  return await axiosClient.get<GetMeResponse>('/users/me');
};
