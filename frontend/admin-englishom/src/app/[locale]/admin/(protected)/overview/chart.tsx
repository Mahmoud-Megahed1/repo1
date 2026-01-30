'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LevelId } from '@/types/user.types';
import { FC } from 'react';
import { cn } from '@/lib/utils';

const chartConfig = {
  all: {
    label: 'All',
    color: '#2563eb',
  },
  completed: {
    label: 'Completed',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

type Props = {
  data: Array<{ level: LevelId; all: number; completed: number }>;
  className?: string;
};

const LevelsChart: FC<Props> = ({ data, className }) => {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn('mx-auto min-h-[200px] w-full max-w-[600px]', className)}
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="level"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent payload={data} />} />
        <Bar dataKey="all" fill="var(--color-all)" radius={4} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default LevelsChart;
