'use client';
import PermissionWrapper from '@/components/permission-wrapper';
import CustomPagination from '@/components/shared/custom-pagination';
import { Link } from '@/components/shared/smooth-navigation';
import { Button } from '@/components/ui/button';
import CustomSelect from '@/components/ui/custom-select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CirclePlusIcon, RefreshCcw } from 'lucide-react';
import { FC, useCallback } from 'react';
import { useAdmins } from '../_components/admins-provider';
import AdminsList from './admins-list';

const Admins = () => {
  const isSuper = true;
  const {
    queryResult: { data, isFetching, isLoading, refetch },
    dispatch,
    params: { page, limit, isActive, adminRole },
  } = useAdmins();
  const onPaginate = useCallback(
    (page: number) => dispatch({ type: 'SET_PAGE', payload: page }),
    [dispatch],
  );
  const onRoleChange = useCallback(
    (role: string) =>
      dispatch({ type: 'SET_ADMIN_ROLE', payload: role as never }),
    [dispatch],
  );

  const onStatusChange = useCallback(
    (status: string) =>
      dispatch({ type: 'SET_IS_ACTIVE', payload: status as never }),
    [dispatch],
  );

  const onSizeChange = useCallback(
    (size: string) => dispatch({ type: 'SET_LIMIT', payload: +size }),
    [dispatch],
  );

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const admins = data?.data.admins || [];
  return (
    <div className="flex flex-col gap-6 pb-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="heading">Admins ({admins.length})</h1>
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
          <PermissionWrapper permission={isSuper ? 'Edit' : 'Hidden'}>
            <Button className="shrink-0 gap-1 [&_svg]:size-5" asChild>
              <Link href={'/admin/admins/add'}>
                <CirclePlusIcon />
                <span className="sr-only md:not-sr-only">Add Admin</span>
              </Link>
            </Button>
          </PermissionWrapper>
          <SearchInput />
        </div>
      </header>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <CustomSelect
            label="Role"
            placeholder="Filter by role"
            onValueChange={onRoleChange}
            options={[
              { value: 'all', label: 'All' },
              { value: 'super', label: 'Super Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'operator', label: 'Operator' },
              { value: 'view', label: 'Viewer' },
            ]}
            value={adminRole}
          />
          <CustomSelect
            placeholder="Filter by status"
            label="Status"
            onValueChange={onStatusChange}
            value={isActive}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <Button
            variant="link"
            className="mt-auto shrink-0"
            onClick={resetFilters}
            disabled={isFetching}
          >
            Reset Filters
          </Button>
        </div>
        <AdminsList
          admins={admins}
          isLoading={isLoading}
          className={cn({
            'animate-pulse duration-1000': isFetching,
          })}
        />
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
  const { params, dispatch } = useAdmins();
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
      placeholder="Search by name or email"
      className={cn('md:w-[400px]', className)}
      onChange={handleSearch}
      defaultValue={params.query}
      value={params.query}
      {...props}
    />
  );
};

export default Admins;
