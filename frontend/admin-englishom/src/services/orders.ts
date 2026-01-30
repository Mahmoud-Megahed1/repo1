import client from '@/lib/client';
import {
  OrdersReportResponse,
  OrdersResponse,
  PeriodType,
} from '@/types/orders.types';

export function getOrders(
  params?: Partial<{
    period: PeriodType;
    limit: number | string;
    page: number | string;
  }>,
) {
  return client.get<OrdersResponse>('/payment/orders/search-orders', {
    params,
  });
}

export function getOrdersReport(params?: { period?: PeriodType }) {
  return client.get<OrdersReportResponse>('/payment/orders/reports', {
    params,
  });
}
