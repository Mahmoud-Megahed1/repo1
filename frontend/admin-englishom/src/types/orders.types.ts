import { LessonsId, WithPagination } from './global.types';

export type Order = {
  _id: string;
  levelName: LessonsId;
  amount: number;
  paymentStatus: 'COMPLETED';
  paymentDate: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type OrdersResponse = WithPagination<Order>;

export type OrdersReportResponse = {
  total: number;
  data: Array<Order>;
};

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';
