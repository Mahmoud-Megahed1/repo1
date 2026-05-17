'use client';
import { Badge } from '@/components/ui/badge';
import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types/orders.types';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const ordersColumns = (t: any): ColumnDef<Order>[] => [
  {
    header: t('user'),
    accessorKey: 'user',
    cell: ({ getValue }) => {
      const user = getValue() as Order['user'];
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    header: t('level'),
    accessorKey: 'levelName',
    cell: ({ getValue }) => {
      const level = getValue() as string;
      return LEVELS_LABELS[level as LevelId] || level;
    },
  },
  {
    header: t('amount'),
    accessorKey: 'amount',
    cell: ({ getValue }) => {
      const amount = getValue() as number;
      if (amount === 0) {
        return (
          <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-700">
            Free / مجاني
          </Badge>
        );
      }
      return `${amount.toFixed(2)} ر.س`;
    },
  },
  {
    header: t('status'),
    accessorKey: 'paymentStatus',
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const isFree = row.original.isFree;
      const paymentId = row.original.paymentId;
      const isManual = isFree || paymentId?.startsWith('ADMIN_ASSIGNED') || (status === 'COMPLETED' && row.original.amount === 0);
      
      if (isManual) {
        return (
          <Badge
            variant="outline"
            className="border-purple-300 text-purple-600 dark:border-purple-700 dark:text-purple-400"
          >
            {t('manual')}
          </Badge>
        );
      }
      
      return (
        <Badge
          variant={status === 'COMPLETED' ? 'success' : 'info-yellow'}
          className="capitalize"
        >
          {status === 'COMPLETED' ? t('completed') : status === 'REFUNDED' ? t('refunded') : status}
        </Badge>
      );
    },
  },
  {
    header: t('createdAt'),
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
];
