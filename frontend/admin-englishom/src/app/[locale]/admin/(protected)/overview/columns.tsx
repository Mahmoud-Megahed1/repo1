'use client';
import { Badge } from '@/components/ui/badge';
import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Analytics } from '@/types/admins.types';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const recentOrdersColumns: ColumnDef<
  Analytics['recentActivity']['recentOrders'][number]
>[] = [
  {
    header: 'Name',
    accessorKey: 'username',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Level',
    accessorKey: 'levelName',
    cell: ({ getValue }) => {
      return LEVELS_LABELS[getValue() as LevelId];
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
          {status.charAt(0).toUpperCase() + status.slice(1).toLocaleLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: 'Date',
    accessorKey: 'paymentDate',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
  },
];
