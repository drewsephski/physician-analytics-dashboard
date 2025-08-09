'use client';

import * as React from 'react';
import { IconTarget, IconClock } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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

const chartConfig = {
  discharges: {
    label: 'Discharges'
  },
  morning: {
    label: 'Morning (Before Noon)',
    color: 'hsl(var(--chart-2))'
  },
  afternoon: {
    label: 'Afternoon (After Noon)',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const processedData = React.useMemo(
    () => processPhysicianData(physicianData),
    []
  );
  const metrics = React.useMemo(
    () => calculateOverallMetrics(processedData),
    [processedData]
  );

  const morningDischarges = processedData.reduce(
    (sum, phy) => sum + phy.dischargesBeforeNoon,
    0
  );
  const afternoonDischarges = metrics.totalDischarges - morningDischarges;
  const morningPercentage =
    metrics.totalDischarges > 0
      ? (morningDischarges / metrics.totalDischarges) * 100
      : 0;

  const chartData = [
    {
      period: 'morning',
      discharges: morningDischarges,
      fill: 'var(--color-morning)',
      percentage: morningPercentage
    },
    {
      period: 'afternoon',
      discharges: afternoonDischarges,
      fill: 'var(--color-afternoon)',
      percentage: 100 - morningPercentage
    }
  ];

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Morning vs Afternoon Split</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Distribution of discharges before and after noon
          </span>
          <span className='@[540px]/card:hidden'>Discharge timing split</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              <linearGradient id='fillMorning' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-morning)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-morning)'
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id='fillAfternoon' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--color-afternoon)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='100%'
                  stopColor='var(--color-afternoon)'
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => [
                    `${value} discharges (${props.payload.percentage.toFixed(1)}%)`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill:
                  item.period === 'morning'
                    ? 'url(#fillMorning)'
                    : 'url(#fillAfternoon)'
              }))}
              dataKey='discharges'
              nameKey='period'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {morningPercentage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Morning Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {morningPercentage >= 40 ? (
            <>
              Meeting morning target <IconTarget className='h-4 w-4' />
            </>
          ) : (
            <>
              Below 40% morning target <IconClock className='h-4 w-4' />
            </>
          )}
        </div>
        <div className='text-muted-foreground leading-none'>
          Target: 40%+ discharges before noon for optimal flow
        </div>
      </CardFooter>
    </Card>
  );
}
