'use client';
import CustomPagination from '@/components/shared/custom-pagination';
import CustomSelect from '@/components/ui/custom-select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RefreshCcw, Download } from 'lucide-react';
import { FC, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUsers } from '../_components/users-provider';
import { Button } from '@/components/ui/button';
import { getUsers } from '@/services/admins';
import { exportUsersToExcel } from './export-users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminPauseUser,
  adminResumeUser,
  updateUserStatus,
} from '@/services/admins';
import { DataTable } from '@/components/shared/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usersColumns } from './columns';

const Users = () => {
  const t = useTranslations('Admin.users');
  const tOrders = useTranslations('Admin.orders');
  const tGlobal = useTranslations('Global');
  const queryClient = useQueryClient();
  const {
    queryResult: { data, isFetching, isLoading, refetch },
    dispatch,
    params: { page, limit, query },
  } = useUsers();

  const isSuper = true;

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationKey: ['updateUserStatus'],
    mutationFn: updateUserStatus,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    },
  });

  const { mutate: pause, isPending: isPausing } = useMutation({
    mutationKey: ['adminPauseUser'],
    mutationFn: adminPauseUser,
    onSuccess() {
      toast.success(t('accountFrozen') || 'Account frozen successfully for 20 days');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const { mutate: resume, isPending: isResuming } = useMutation({
    mutationKey: ['adminResumeUser'],
    mutationFn: adminResumeUser,
    onSuccess() {
      toast.success(t('accountResumed') || 'Account resumed successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const response = await getUsers({
        limit: 10000,
        query: query === '' ? undefined : query,
      });
      const allUsers = response.data.users || [];
      await exportUsersToExcel(allUsers);
    } catch (error) {
      console.error('Failed to export users:', error);
    } finally {
      setIsExporting(false);
    }
  }, [query]);
  const onPaginate = useCallback(
    (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    [dispatch],
  );

  const onSizeChange = useCallback(
    (size: string) => dispatch({ type: 'SET_LIMIT', payload: +size }),
    [dispatch],
  );

  const users = data?.data.users || [];
  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="heading">{t('title')} ({users.length})</h1>
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
        <div className="flex w-full items-center gap-4 md:w-auto">
          <SearchInput />
          <Button
            disabled={isExporting}
            onClick={handleExport}
            className="gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md transition-colors"
          >
            <Download className="size-4" />
            {isExporting ? `${tGlobal('loading')}...` : tOrders('exportExcel')}
          </Button>
        </div>
      </header>
      <div className="mt-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="box flex h-[400px] items-center justify-center">
            <RefreshCcw className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="box h-[calc(100vh-300px)] md:h-[calc(100vh-204px)]">
            <DataTable
              columns={usersColumns(
                t,
                isSuper,
                updateStatus,
                pause,
                resume,
                isUpdatingStatus,
                isPausing,
                isResuming,
              )}
              data={users}
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
            totalPages={data?.data.totalPages || 1}
          />
        </div>
      </div>
    </div>
  );
};

const SearchInput: FC<React.ComponentProps<typeof Input>> = ({
  className,
  ...props
}) => {
  const t = useTranslations('Admin.users');
  const { params, dispatch } = useUsers();
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const query = e.target.value.trim();
      dispatch({ type: 'SET_SEARCH_TERM', payload: query });
    },
    [dispatch],
  );

  return (
    <Input
      type="search"
      placeholder={t('searchPlaceholder')}
      className={cn('md:w-[400px]', className)}
      onChange={handleSearch}
      defaultValue={params.query}
      value={params.query}
      {...props}
    />
  );
};

export default Users;
