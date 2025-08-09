'use client';

import { IconTrendingUp, IconClock } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { physicianData } from '@/data/physician-data';
import {
  processPhysicianData,
  calculateOverallMetrics
} from '@/lib/discharge-utils';
import React from 'react';

const chartConfig = {
  discharges: {
    label: 'Total Discharges',
    color: 'hsl(var(--chart-1))'
  },
  optimal: {
    label: 'Optimal Window (8AM-12PM)',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  const processedData = React.useMemo(
    () => processPhysicianData(physicianData),
    []
  );
  const metrics = React.useMemo(
    () => calculateOverallMetrics(processedData),
    [processedData]
  );

  const chartData = React.useMemo(() => {
    return metrics.hourlyTotals.map((total, hour) => ({
      hour: `${hour}:00`,
      discharges: total,
      optimal: hour >= 8 && hour < 12 ? total : 0,
      isOptimalWindow: hour >= 8 && hour < 12
    }));
  }, [metrics.hourlyTotals]);

  const optimalDischarges = chartData
    .slice(8, 12)
    .reduce((sum, item) => sum + item.discharges, 0);
  const optimalPercentage =
    metrics.totalDischarges > 0
      ? (optimalDischarges / metrics.totalDischarges) * 100
      : 0;

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Hourly Discharge Distribution</CardTitle>
        <CardDescription>
          24-hour discharge pattern with optimal window highlighted
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillDischarges' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='hsl(220, 70%, 50%)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='hsl(220, 70%, 50%)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillOptimal' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='hsl(142, 76%, 36%)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='hsl(142, 76%, 36%)'
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='hour'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.replace(':00', '')}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='dot'
                  labelFormatter={(label) =>
                    `${label} - ${label.replace(':00', ':59')}`
                  }
                />
              }
            />
            <Area
              dataKey='discharges'
              type='monotone'
              fill='url(#fillDischarges)'
              stroke='hsl(220, 70%, 50%)'
              strokeWidth={2}
            />
            <Area
              dataKey='optimal'
              type='monotone'
              fill='url(#fillOptimal)'
              stroke='hsl(142, 76%, 36%)'
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              {optimalPercentage.toFixed(1)}% in optimal window (8AM-12PM){' '}
              <IconClock className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Peak hour: {metrics.peakHour}:00 (
              {metrics.hourlyTotals[metrics.peakHour]} discharges)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
