'use client';
import { Badge } from '@/components/ui/badge';
import { LEVELS_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';
import { Analytics } from '@/types/admins.types';
import { LevelId } from '@/types/user.types';
import { ColumnDef } from '@tanstack/react-table';

export const getRecentOrdersColumns = (t: any): ColumnDef<
  Analytics['recentActivity']['recentOrders'][number]
>[] => [
  {
    header: t('name'),
    accessorKey: 'username',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: t('level'),
    accessorKey: 'levelName',
    cell: ({ getValue }) => {
      return LEVELS_LABELS[getValue() as LevelId];
    },
  },
  {
    header: t('status'),
    accessorKey: 'paymentStatus',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge
          variant={status === 'COMPLETED' ? 'success' : 'info-yellow'}
          className="capitalize"
        >
          {status === 'COMPLETED' ? t('completed') : status}
        </Badge>
      );
    },
  },
  {
    header: t('date'),
    accessorKey: 'paymentDate',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    header: t('amount'),
    accessorKey: 'amount',
  },
];
