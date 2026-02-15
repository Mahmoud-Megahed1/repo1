import client from '@/lib/client';
import {
  Admin,
  AdminsResponse,
  Analytics,
  User,
  UsersResponse,
} from '@/types/admins.types';
import { LevelId } from '@/types/user.types';
import { AxiosRequestConfig } from 'axios';

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
    admin: Admin;
  }>('/admin/auth/login', { ...data }, config);
};

export function getLoggedAdmin() {
  return client.get<Admin>('/admin/me');
}

type GetAdminsParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
  adminRole?: 'super' | 'manager' | 'view' | 'operator';
  query?: string;
};
export const getAdmins = (params: GetAdminsParams) => {
  return client.get<AdminsResponse>('/admin/search', { params });
};

export const deleteAdmin = (id: string) => {
  return client.delete(`/admin/${id}`);
};

export const updateAdmin = ({
  id,
  data,
  config,
}: {
  id: string;
  data: {
    isActive?: boolean;
    adminRole?: 'super' | 'manager' | 'view' | 'operator';
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  config?: AxiosRequestConfig;
}) => {
  return client.patch(`/admin/${id}`, { ...data }, config);
};

export const getAdminById = (id: string) => {
  return client.get<Admin>(`/admin/details/${id}`);
};

export const createAdmin = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  adminRole: 'super' | 'manager' | 'view' | 'operator';
}) => {
  return client.post<Admin>('/admin/create-admin', { ...data });
};

export const getUsers = (params: {
  page?: number;
  limit?: number;
  query?: string;
}) => {
  return client.get<UsersResponse>('/dashboard/users', { params });
};

export const getUserById = (id: string) => {
  return client.get<{
    user: User;
    levelsDetails: Array<{
      levelName: LevelId;
      currentDay: number;
      isCompleted: boolean;
    }>;
  }>(`/dashboard/user-details/${id}`);
};

export const getOverview = () => {
  return client.get<Analytics>('/dashboard/stats');
};

//Super or Manager only
export const assignCourseToUser = ({
  userId,
  level_name,
  reason,
}: {
  userId: string;
  level_name: LevelId;
  reason?: string;
}) => {
  return client.post(`/dashboard/assign-course`, {
    userId,
    level_name,
    reason,
  });
};

//Super or Manager only
export const updateUserStatus = ({
  userId,
  status,
  reason,
}: {
  userId: string;
  status: 'active' | 'suspended' | 'blocked';
  reason?: string;
}) => {
  return client.patch(`/admin/users/status/${userId}`, {
    status,
    reason,
  });
};

export const deleteUserCourse = (userId: string, levelName: LevelId) => {
  return client.delete(`/users/${userId}/courses/${levelName}`);
};

export const adminPauseUser = ({
  userId,
  durationDays,
}: {
  userId: string;
  durationDays: number;
}) => {
  return client.post(`/subscription/admin/pause`, { userId, durationDays });
};

export const adminResumeUser = (userId: string) => {
  return client.post(`/subscription/admin/resume`, { userId });
};
