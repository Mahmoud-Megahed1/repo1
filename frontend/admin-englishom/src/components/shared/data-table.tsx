'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowUpDownIcon } from 'lucide-react';

type DataTableProps<TData, TValue> = React.ComponentProps<typeof ScrollArea> & {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <ScrollArea className={cn('size-full', className)} {...props}>
      <div className="size-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.getContext().column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? () => {
                              header.column.toggleSorting();
                            }
                          : undefined
                      }
                      className={cn('text-nowrap font-bold', {
                        'cursor-pointer': canSort,
                      })}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort && (
                            <ArrowUpDownIcon className="h-[16px] w-[18px] text-neutral-500" />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="min-w-[150px]" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
