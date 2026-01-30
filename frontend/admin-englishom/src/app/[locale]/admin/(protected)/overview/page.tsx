'use client';
import { DataTable } from '@/components/shared/data-table';
import { LEVELS_LABELS } from '@/constants';
import { cn, omit } from '@/lib/utils';
import { getOverview } from '@/services/admins';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { withAccess } from '../_components/with-access';
import LevelsChart from './chart';
import { recentOrdersColumns } from './columns';
function camelCaseToTitleCase(input: string): string {
  return input
    .replace(/([A-Z])/g, ' $1') // insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize the first character
}

const Overview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: getOverview,
    refetchOnMount: true,
  });
  const analytics = data?.data;
  if (isLoading) return <Loader2 className="mx-auto animate-spin" />;
  if (isError || !analytics)
    return <div className="text-red-500">Error loading data</div>;
  return (
    <div>
      <ul
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          {
            'animate-pulse duration-1000': false,
          },
        )}
      >
        {Object.entries(omit(analytics.overview, ['totalCourses'])).map(
          ([key, value], i) => (
            <StatsBox
              key={i}
              count={new Intl.NumberFormat('en', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(value)}
              title={camelCaseToTitleCase(key).replace('Total', '')}
            />
          ),
        )}
      </ul>
      <div className="flex flex-col gap-4 *:flex-1">
        <LevelsChart
          data={analytics.levelStatistics.map((item) => ({
            ...item,
            level: LEVELS_LABELS[item.level] as never,
          }))}
          className="mt-8"
        />
        <div
          className={cn('mt-8 flex flex-col gap-4', {
            'animate-pulse duration-1000': isLoading,
          })}
        >
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="subheading">Recent Orders</h2>
            <section className="box flex">
              {isLoading ? (
                <Loader2 className="mx-auto animate-spin" />
              ) : (
                <DataTable
                  columns={recentOrdersColumns}
                  data={analytics.recentActivity.recentOrders || []}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

type StatsBoxProps = {
  title: string;
  count: string;
  unit?: string;
};

const StatsBox = ({ title, count, unit }: StatsBoxProps) => {
  return (
    <li className="rounded-lg bg-secondary p-4 text-secondary-foreground">
      <h2 className="subheading">{title}</h2>
      <p className="flex items-center gap-2">
        <span className="text-4xl font-bold">{count}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </p>
    </li>
  );
};

export default withAccess(Overview, ['super', 'manager']);
