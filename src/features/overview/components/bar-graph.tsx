'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
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
import { processPhysicianData } from '@/lib/discharge-utils';

export const description = 'Physician morning discharge performance';

const chartConfig = {
  morningRate: {
    label: 'Morning Discharge %',
    color: 'hsl(var(--chart-2))'
  },
  totalDischarges: {
    label: 'Total Discharges',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('morningRate');

  const processedData = React.useMemo(
    () => processPhysicianData(physicianData),
    []
  );

  const chartData = React.useMemo(() => {
    return processedData
      .sort((a, b) => b.percentBeforeNoon - a.percentBeforeNoon)
      .slice(0, 15) // Show top 15 performers
      .map((phy) => ({
        physician:
          phy.name.length > 10 ? phy.name.substring(0, 10) + '...' : phy.name,
        fullName: phy.name,
        morningRate: phy.percentBeforeNoon,
        totalDischarges: phy.total
      }));
  }, [processedData]);

  const totals = React.useMemo(
    () => ({
      morningRate:
        chartData.reduce((acc, curr) => acc + curr.morningRate, 0) /
        chartData.length,
      totalDischarges: chartData.reduce(
        (acc, curr) => acc + curr.totalDischarges,
        0
      )
    }),
    [chartData]
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Top Physician Performance</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Morning discharge leaders (Top 15)
            </span>
            <span className='@[540px]/card:hidden'>Top performers</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {(['morningRate', 'totalDischarges'] as const).map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {key === 'morningRate'
                    ? `${totals[key].toFixed(1)}%`
                    : totals[key].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            layout='horizontal'
            margin={{
              left: 80,
              right: 12,
              top: 12,
              bottom: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='1' y2='0'>
                <stop
                  offset='0%'
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor={`var(--color-${activeChart})`}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} />
            <XAxis
              type='number'
              domain={activeChart === 'morningRate' ? [0, 100] : [0, 'dataMax']}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type='category'
              dataKey='physician'
              tickLine={false}
              axisLine={false}
              width={70}
              className='text-xs'
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[200px]'
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data?.fullName || label;
                  }}
                  formatter={(value, name) => [
                    activeChart === 'morningRate' ? `${value}%` : value,
                    chartConfig[activeChart].label
                  ]}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
