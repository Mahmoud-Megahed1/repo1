import axiosClient from '@lib/axios-client';
import type { AxiosRequestConfig } from 'axios';
import type { UserWithToken } from './types';

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
  return axiosClient.post<UserWithToken>('/auth/signup', { ...data }, config);
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
  return axiosClient.post<UserWithToken>('/auth/login', { ...data }, config);
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
  return axiosClient.post<UserWithToken>(
    '/auth/verify-otp',
    { ...data, cause: 'email_verification' },
    config
  );
};

export const verifyForgetPasswordOtp = ({
  data,
  config,
}: {
  data: {
    otp: string;
    email: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return axiosClient.post<{
    message: string;
    resetToken: string;
  }>('/auth/verify-otp', { ...data, cause: 'forget_password' }, config);
};

export const forgotPassword = ({
  data,
  config,
}: {
  data: {
    email: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return axiosClient.post<{ message: string }>(
    '/auth/forget-password',
    data,
    config
  );
};

export const resetPassword = ({
  data,
  config,
}: {
  data: {
    newPassword: string;
    resetToken: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return axiosClient.post<{ message: string }>(
    '/auth/reset-password-token',
    data,
    {
      ...config,
    }
  );
};

export const resendPasswordOTP = (email: string) => {
  return axiosClient.post<{ message: string }>('/auth/resend-otp', {
    email,
    cause: 'forget_password',
  });
};

export const resendOtp = (email: string) => {
  return axiosClient.post<{ message: string }>('/auth/resend-otp', { email });
};

export const facebookAuth = () => {
  window.open(
    import.meta.env.VITE_API_URL + '/api' + '/auth/facebook',
    '_self'
  );
};

export const googleAuth = () => {
  window.open(import.meta.env.VITE_API_URL + '/api' + '/auth/google', '_self');
};
