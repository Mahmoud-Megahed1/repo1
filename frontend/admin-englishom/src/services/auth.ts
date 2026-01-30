import client from '@/lib/client';
import { User } from '@/types/admins.types';
import { LevelId } from '@/types/user.types';
import { AxiosRequestConfig } from 'axios';

export const register = ({
  data,
  config,
}: {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return client.post<{
    access_token: string;
    user: User;
  }>('/auth/signup', { ...data }, config);
};

export const login = ({
  data,
  config,
}: {
  data: {
    email: string;
    password: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return client.post<{
    access_token: string;
    user: User;
  }>('/auth/login', { ...data }, config);
};

export const verifyOtp = ({
  data,
  config,
}: {
  data: {
    otp: string;
    email: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return client.post<{
    user: User;
    access_token: string;
  }>('/auth/verify-otp', data, config);
};

export const resendOtp = (email: string) => {
  return client.post<{ message: string }>('/auth/resend-otp', { email });
};

export const getMe = (config?: AxiosRequestConfig) => {
  return client.get<{
    user: User;
    levelsDetails: Array<{
      levelName: LevelId;
      currentDay: number;
      isCompleted: boolean;
    }>;
  }>('/users/me', config);
};

export const facebookAuth = () => {
  window.open(process.env.NEXT_PUBLIC_API_URL + '/auth/facebook', '_self');
};

export const googleAuth = () => {
  window.open(process.env.NEXT_PUBLIC_API_URL + '/auth/google', '_self');
};
