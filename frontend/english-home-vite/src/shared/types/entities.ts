import type {
  LESSONS_IDS,
  LEVEL_IDS,
  SIDEBAR_ITEMS_IDS,
} from '@shared/constants';
import type { LucideIcon } from 'lucide-react';
import type { RouteType, RouteWithoutLocale } from './utils';

export type UserType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  strategy: string;
  isVerified: boolean;
  role: 'admin' | 'user';
  status: 'active' | 'blocked' | 'suspended';
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
};

export type LevelId = (typeof LEVEL_IDS)[number];

export type SidebarItem = {
  id: (typeof SIDEBAR_ITEMS_IDS)[number];
  title: string;
  url: RouteWithoutLocale<RouteType>;
  icon: LucideIcon;
  isActive?: boolean;
  isCompleted?: boolean;
};

export type LessonId = (typeof LESSONS_IDS)[number];

export type LevelDetails = {
  levelName: LevelId;
  currentDay: number;
  isCompleted: boolean;
  purchaseDate: string;
  expiresAt: string;
  daysLeft: number;
  isExpired: boolean;
};
