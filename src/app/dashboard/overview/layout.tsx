import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconClock,
  IconTarget
} from '@tabler/icons-react';
import { physicianData } from '@/data/physician-data';
import {
  processPhysicianData,
  calculateOverallMetrics
} from '@/lib/discharge-utils';
import TopPhysicianPerformanceChart from '@/features/overview/components/top-physician-performance-chart';
import React from 'react';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  // Calculate discharge metrics for KPI cards
  const processedData = processPhysicianData(physicianData);
  const metrics = calculateOverallMetrics(processedData);

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const earlyDischarges = metrics.hourlyTotals
    .slice(6, 12)
    .reduce((a, b) => a + b, 0);
  const earlyDischargeRate =
    metrics.totalDischarges > 0
      ? (earlyDischarges / metrics.totalDischarges) * 100
      : 0;
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='space-y-4 text-center'>
          <h1 className='text-foreground text-3xl font-bold'>
            Discharge Analytics Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Monitor physician discharge patterns and optimize patient flow
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:shadow-lg dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20'>
            <CardHeader>
              <CardDescription className='text-blue-700 dark:text-blue-300'>
                Total Discharges
              </CardDescription>
              <CardTitle className='text-2xl font-semibold text-blue-800 tabular-nums @[250px]/card:text-3xl dark:text-blue-200'>
                {metrics.totalDischarges.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge
                  variant='outline'
                  className='border-blue-300 bg-blue-100 text-blue-800'
                >
                  <IconTrendingUp />
                  All Physicians
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-blue-800 dark:text-blue-200'>
                Comprehensive analysis <IconTrendingUp className='size-4' />
              </div>
              <div className='text-blue-600 dark:text-blue-400'>
                Across {processedData.length} physicians
              </div>
            </CardFooter>
          </Card>
          <Card
            className={`@container/card ${earlyDischargeRate >= 50 ? 'border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/20' : 'border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:border-red-800 dark:from-red-900/20 dark:to-red-800/20'} transition-all duration-300 hover:shadow-lg`}
          >
            <CardHeader>
              <CardDescription
                className={
                  earlyDischargeRate >= 50
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }
              >
                Early Discharge Rate
              </CardDescription>
              <CardTitle
                className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${earlyDischargeRate >= 50 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}
              >
                {earlyDischargeRate.toFixed(1)}%
              </CardTitle>
              <CardAction>
                <Badge
                  variant={earlyDischargeRate >= 50 ? 'default' : 'destructive'}
                  className={
                    earlyDischargeRate >= 50
                      ? 'border-green-300 bg-green-100 text-green-800'
                      : 'border-red-300 bg-red-100 text-red-800'
                  }
                >
                  {earlyDischargeRate >= 50 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {earlyDischargeRate >= 50 ? 'On Target' : 'Below Target'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div
                className={`line-clamp-1 flex gap-2 font-medium ${earlyDischargeRate >= 50 ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}
              >
                {earlyDischargeRate >= 50
                  ? 'Meeting 50% target'
                  : 'Needs improvement'}{' '}
                <IconTarget className='size-4' />
              </div>
              <div
                className={
                  earlyDischargeRate >= 50
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }
              >
                6 AM - 12 PM discharges
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Average Discharge Time</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {formatTime(metrics.avgDischargeTime)}
              </CardTitle>
              <CardAction>
                <Badge
                  variant={
                    metrics.avgDischargeTime < 12 ? 'default' : 'secondary'
                  }
                >
                  {metrics.avgDischargeTime < 12 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconClock />
                  )}
                  {metrics.avgDischargeTime < 12 ? 'Optimal' : 'Late'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {metrics.avgDischargeTime < 12
                  ? 'Before noon target met'
                  : 'Target: Before 12 PM'}{' '}
                <IconClock className='size-4' />
              </div>
              <div className='text-muted-foreground'>Weighted average time</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Morning Discharge Rate</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {metrics.percentBeforeNoon.toFixed(1)}%
              </CardTitle>
              <CardAction>
                <Badge
                  variant={
                    metrics.percentBeforeNoon >= 40 ? 'default' : 'destructive'
                  }
                >
                  {metrics.percentBeforeNoon >= 40 ? (
                    <IconTrendingUp />
                  ) : (
                    <IconTrendingDown />
                  )}
                  {metrics.percentBeforeNoon >= 40 ? 'Good' : 'Needs Work'}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Before 12 PM discharges <IconTarget className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Target: 40%+ before noon
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales parallel routes */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
        <div className='grid grid-cols-1 gap-6'>
          <TopPhysicianPerformanceChart />
        </div>
      </div>
    </PageContainer>
  );
}
