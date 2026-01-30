'use client';
import { Admin } from '@/types/admins.types';
import { ColumnDef } from '@tanstack/react-table';

export const adminColumns: ColumnDef<Admin>[] = [
  {
    header: 'Name',
    accessorKey: 'firstName',
    cell: ({ getValue }) => getValue(),
  },
  {
    header: 'Role',
    accessorKey: 'adminRole',
    cell: ({ getValue }) => {
      return getValue();
    },
  },
  {
    header: 'Status',
    accessorKey: 'isActive',
    cell: ({ getValue }) => {
      return getValue() ? 'Active' : 'Inactive';
    },
  },
];
