import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types/orders.types';
import { LevelId } from '@/types/user.types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export async function exportOrdersToExcel(orders: Order[], filename?: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  worksheet.columns = [
    { header: 'User Name', key: 'userName', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Level', key: 'level', width: 15 },
    { header: 'Amount', key: 'amount', width: 12 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Payment ID', key: 'paymentId', width: 25 },
    { header: 'Payment Date', key: 'paymentDate', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  orders.forEach((order) => {
    worksheet.addRow({
      userName: `${order.user.firstName} ${order.user.lastName}`,
      email: order.user.email,
      level: LEVELS_LABELS[order.levelName as LevelId] || order.levelName,
      amount: `$${order.amount.toFixed(2)}`,
      status: order.paymentStatus,
      paymentId: order.paymentId,
      paymentDate: formatDate(order.paymentDate),
      createdAt: formatDate(order.createdAt),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().split('T')[0];
  const defaultFilename = `orders_${date}.xlsx`;

  saveAs(new Blob([buffer]), filename || defaultFilename);
}
