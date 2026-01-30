'use client';
import CustomPagination from '@/components/shared/custom-pagination';
import { DataTable } from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/custom-select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getOrdersReport } from '@/services/orders';
import { PeriodType } from '@/types/orders.types';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Download, RefreshCcw } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { withAccess } from '../_components/with-access';
import { ordersColumns } from './columns';
import { exportOrdersToExcel } from './export-orders';
import { useOrders, withOrdersProvider } from './orders-provider';

const Orders = () => {
  const {
    queryResult: { data, isFetching, isLoading, refetch },
    dispatch,
    params: { page, limit, period },
  } = useOrders();
  const [selectPeriod, setSelectPeriod] = React.useState<
    PeriodType | undefined
  >();
  const { isFetching: isReportFetching, data: reportData } = useQuery({
    queryKey: ['orders_reports', selectPeriod],
    queryFn: () => getOrdersReport({ period: selectPeriod }),
    enabled: !!selectPeriod,
  });

  const onPaginate = useCallback(
    (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    [dispatch],
  );

  const onSizeChange = useCallback(
    (size: string) => dispatch({ type: 'SET_LIMIT', payload: +size }),
    [dispatch],
  );

  const onPeriodChange = useCallback(
    (value: string) => {
      if (value === 'all') {
        dispatch({ type: 'SET_PERIOD', payload: undefined });
      } else {
        dispatch({
          type: 'SET_PERIOD',
          payload: value as 'daily' | 'weekly' | 'monthly' | 'yearly',
        });
      }
    },
    [dispatch],
  );

  const orders = useMemo(() => data?.data.data || [], [data?.data.data]);
  const totalPages = data?.data.totalPages || 1;

  const handleExport = useCallback(
    async (exportPeriod: PeriodType = 'monthly') => {
      setSelectPeriod(exportPeriod);
      try {
        if (reportData && reportData?.data.data.length > 0) {
          const periodSuffix = exportPeriod ? `_${exportPeriod}` : '_all';
          exportOrdersToExcel(
            reportData.data.data,
            `orders${periodSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`,
          );
        }
      } catch (error) {
        console.error('Failed to export orders:', error);
      }
    },
    [reportData],
  );

  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="heading">Orders ({data?.data.total || 0})</h1>
          <button
            className={cn({
              'animate-spin opacity-60': isFetching,
            })}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isReportFetching} className="gap-2">
              <Download className="size-4" />
              Export Excel
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('daily')}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('weekly')}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('monthly')}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('yearly')}>
              Yearly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="w-[200px]">
        <CustomSelect
          label="Period"
          placeholder="Filter by period"
          onValueChange={onPeriodChange}
          value={period || 'all'}
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="box flex h-[400px] items-center justify-center">
            <RefreshCcw className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="box h-[calc(100vh-300px)] md:h-[calc(100vh-204px)]">
            <DataTable
              columns={ordersColumns}
              data={orders}
              className={cn({
                'animate-pulse duration-1000': isFetching,
              })}
            />
          </ScrollArea>
        )}

        <div className="mx-auto flex items-end gap-4">
          <CustomSelect
            placeholder="Size"
            label="Size"
            onValueChange={onSizeChange}
            defaultValue={`${limit}`}
            options={[
              { value: '10', label: '10' },
              { value: '30', label: '30' },
              { value: '50', label: '50' },
            ]}
          />
          <CustomPagination
            onPaginate={onPaginate}
            defaultPage={page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default withAccess(withOrdersProvider(Orders), ['super', 'manager']);
