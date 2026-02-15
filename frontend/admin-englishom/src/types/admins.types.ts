import { LevelId } from './user.types';

export type Analytics = {
  overview: Overview;
  recentActivity: RecentActivity;
  levelStatistics: LevelStatistic[];
  generatedAt: string;
};

export type Overview = {
  totalUsers: number;
  totalActiveUsers: number;
  totalSuspendedUsers: number;
  totalBlockedUsers: number;
  totalRevenue: number;
  totalSubscribedUsers: number;
  totalCourses: number;
};

export type RecentActivity = {
  recentOrders: RecentOrder[];
};

export type RecentOrder = {
  _id: string;
  userId: string;
  levelName: LevelId;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
  createdAt: string;
  username: string;
};

export type LevelStatistic = {
  level: LevelId;
  all: number;
  completed: number;
};

export type PaginationResult = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminsResponse = PaginationResult & {
  admins: Admin[];
};

export type UsersResponse = PaginationResult & {
  users: User[];
};

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastActivity: string;
  country: string;
  strategy: string;
  isVerified: boolean;
  role: string;
  status: 'active' | 'suspended' | 'blocked';
  isVoluntaryPaused?: boolean;
  totalPausedDays?: number;
  voluntaryPauseAttempts?: number;
  pauseScheduledEndDate?: string;
  pauseHistory?: Array<{
    start: string;
    end: string;
    reason: string;
    isVoluntary: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type Admin = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  adminRole: 'super' | 'manager' | 'view' | 'operator';
  role: 'admin' | 'user';
  isActive: boolean;
  isVerified: boolean;
  createdBy?: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
};
