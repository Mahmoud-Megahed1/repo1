'use client';
import { Badge } from '@/components/ui/badge';
import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types/orders.types';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const ordersColumns: ColumnDef<Order>[] = [
  {
    header: 'User',
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
    header: 'Level',
    accessorKey: 'levelName',
    cell: ({ getValue }) => {
      const level = getValue() as string;
      return LEVELS_LABELS[level as LevelId] || level;
    },
  },
  {
    header: 'Amount',
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
    header: 'Status',
    accessorKey: 'paymentStatus',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge
          variant={status === 'COMPLETED' ? 'success' : 'info-yellow'}
          className="capitalize"
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
];
