import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types/orders.types';
import { LevelId } from '@/types/user.types';
import * as XLSX from 'xlsx';

export function exportOrdersToExcel(orders: Order[], filename?: string) {
  const excelData = orders.map((order) => ({
    'User Name': `${order.user.firstName} ${order.user.lastName}`,
    Email: order.user.email,
    Level: LEVELS_LABELS[order.levelName as LevelId] || order.levelName,
    Amount: `$${order.amount.toFixed(2)}`,
    Status: order.paymentStatus,
    'Payment ID': order.paymentId,
    'Payment Date': formatDate(order.paymentDate),
    'Created At': formatDate(order.createdAt),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const columnWidths = [
    { wch: 25 },
    { wch: 30 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  const date = new Date().toISOString().split('T')[0];
  const defaultFilename = `orders_${date}.xlsx`;

  XLSX.writeFile(workbook, filename || defaultFilename);
}
