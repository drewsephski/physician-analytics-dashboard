'use client';

import { useState } from 'react';
import { ProcessedPhysicianData, DischargeMetrics } from '@/types/discharge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

interface ComprehensiveChartsProps {
  data: ProcessedPhysicianData[];
  metrics: DischargeMetrics;
}

const chartConfig = {
  morningRate: {
    label: 'Morning Rate %',
    color: 'hsl(var(--chart-2))'
  },
  totalDischarges: {
    label: 'Total Discharges',
    color: 'hsl(var(--chart-1))'
  },
  avgTime: {
    label: 'Avg Discharge Time',
    color: 'hsl(var(--chart-3))'
  },
  hourlyDischarges: {
    label: 'Hourly Discharges',
    color: 'hsl(var(--chart-4))'
  },
  optimal: {
    label: 'Optimal Window',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function ComprehensiveCharts({
  data,
  metrics
}: ComprehensiveChartsProps) {
  const [filterName, setFilterName] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'morningRate' | 'totalDischarges' | 'avgTime'
  >('morningRate');
  const [displayLimit, setDisplayLimit] = useState<string>('15');

  const filteredAndSortedData = data
    .filter((phy) => phy.name.toLowerCase().includes(filterName.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'morningRate') {
        return b.percentBeforeNoon - a.percentBeforeNoon;
      } else if (sortBy === 'totalDischarges') {
        return b.total - a.total;
      } else {
        // avgTime
        return a.averageDischargeTime - b.averageDischargeTime;
      }
    })
    .slice(0, parseInt(displayLimit))
    .map((phy, index) => ({
      rank: index + 1,
      name: phy.name.length > 12 ? phy.name.substring(0, 12) + '...' : phy.name,
      fullName: phy.name,
      morningRate: phy.percentBeforeNoon,
      totalDischarges: phy.total,
      avgTime: phy.averageDischargeTime
    }));

  // Performance distribution data
  const performanceData = filteredAndSortedData;

  // Hourly distribution with optimal window
  const hourlyData = metrics.hourlyTotals.map((total, hour) => ({
    hour: `${hour}:00`,
    hourlyDischarges: total,
    optimal: hour >= 8 && hour < 12 ? total : 0,
    isOptimal: hour >= 8 && hour < 12
  }));

  // Scatter plot data for correlation analysis
  const scatterData = data.map((phy) => ({
    name: phy.name,
    totalDischarges: phy.total,
    morningRate: phy.percentBeforeNoon,
    avgTime: phy.averageDischargeTime
  }));

  // Volume vs Performance analysis
  const volumePerformanceData = filteredAndSortedData.map((phy) => ({
    name: phy.name.length > 10 ? phy.name.substring(0, 10) + '...' : phy.name,
    fullName: phy.fullName,
    totalDischarges: phy.totalDischarges,
    morningRate: phy.morningRate
  }));

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <Card className='lg:col-span-2' data-onboarding='chart-controls'>
        <CardHeader>
          <CardTitle>Physician Performance Controls</CardTitle>
          <CardDescription>
            Adjust display settings for physician data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6 flex flex-wrap items-center gap-4'>
            <Input
              placeholder='Filter by physician name...'
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className='max-w-sm'
            />
            <div className='flex items-center gap-2'>
              <span>Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={(
                  value: 'morningRate' | 'totalDischarges' | 'avgTime'
                ) => setSortBy(value)}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='morningRate'>Morning Rate</SelectItem>
                  <SelectItem value='totalDischarges'>
                    Total Discharges
                  </SelectItem>
                  <SelectItem value='avgTime'>Average Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <span>Display:</span>
              <Select value={displayLimit} onValueChange={setDisplayLimit}>
                <SelectTrigger className='w-[100px]'>
                  <SelectValue placeholder='Limit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='15'>15</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                  <SelectItem value='100'>100</SelectItem>
                </SelectContent>
              </Select>
              <span>physicians</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Physician Performance Chart - Enhanced */}
      <Card
        className='border-blue-200 bg-gradient-to-br from-slate-50 to-blue-50 shadow-lg lg:col-span-2 dark:border-blue-800 dark:from-slate-900 dark:to-blue-900/20'
        data-onboarding='performance-chart'
      >
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <CardTitle className='bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-xl font-bold text-transparent'>
                🏆 Top Physician Performance
              </CardTitle>
              <CardDescription className='text-sm'>
                Physicians ranked by{' '}
                {sortBy === 'morningRate'
                  ? 'morning discharge rate'
                  : sortBy === 'totalDischarges'
                    ? 'total discharge volume'
                    : 'average discharge time'}{' '}
                with performance indicators
              </CardDescription>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='text-muted-foreground flex items-center space-x-1 text-xs'>
                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                <span>Above Target</span>
              </div>
              <div className='text-muted-foreground flex items-center space-x-1 text-xs'>
                <div className='h-3 w-3 rounded-full bg-orange-500'></div>
                <span>Below Target</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={performanceData}
                margin={{ top: 30, right: 40, left: 20, bottom: 80 }}
              >
                <defs>
                  <linearGradient
                    id='performanceGradientGreen'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='hsl(142, 76%, 36%)'
                      stopOpacity={0.9}
                    />
                    <stop
                      offset='100%'
                      stopColor='hsl(142, 76%, 36%)'
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                  <linearGradient
                    id='performanceGradientOrange'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='hsl(25, 95%, 53%)'
                      stopOpacity={0.9}
                    />
                    <stop
                      offset='100%'
                      stopColor='hsl(25, 95%, 53%)'
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                  <linearGradient
                    id='performanceGradientRed'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='hsl(0, 84%, 60%)'
                      stopOpacity={0.9}
                    />
                    <stop
                      offset='100%'
                      stopColor='hsl(0, 84%, 60%)'
                      stopOpacity={0.6}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='2 2'
                  stroke='hsl(var(--muted-foreground))'
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={90}
                  className='text-xs font-medium'
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Morning Discharge Rate (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800'
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return (
                          <div className='font-semibold text-slate-900 dark:text-slate-100'>
                            {data?.fullName || label}
                          </div>
                        );
                      }}
                      formatter={(value, name, payload) => {
                        const data = payload.payload;
                        if (name === 'morningRate') {
                          const numValue =
                            typeof value === 'number'
                              ? value
                              : parseFloat(value as string);
                          const performanceLevel =
                            numValue >= 60
                              ? 'Excellent'
                              : numValue >= 40
                                ? 'Good'
                                : 'Needs Improvement';
                          const performanceColor =
                            numValue >= 60
                              ? 'text-green-600'
                              : numValue >= 40
                                ? 'text-orange-600'
                                : 'text-red-600';
                          return [
                            <div key='morning-rate' className='space-y-1'>
                              <div className='flex items-center justify-between'>
                                <span className='text-sm'>Morning Rate:</span>
                                <span className='font-bold'>{numValue}%</span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs'>Performance:</span>
                                <span
                                  className={`text-xs font-medium ${performanceColor}`}
                                >
                                  {performanceLevel}
                                </span>
                              </div>
                              <div className='text-muted-foreground flex items-center justify-between text-xs'>
                                <span>Total Discharges:</span>
                                <span>{data.totalDischarges}</span>
                              </div>
                              <div className='text-muted-foreground flex items-center justify-between text-xs'>
                                <span>Rank:</span>
                                <span>#{data.rank}</span>
                              </div>
                            </div>,
                            ''
                          ];
                        }
                        return [value, name];
                      }}
                    />
                  }
                />
                <ReferenceLine
                  y={40}
                  stroke='hsl(var(--destructive))'
                  strokeDasharray='8 4'
                  strokeWidth={2}
                  label={{
                    value: 'Target: 40%',
                    position: 'insideTopRight',
                    style: {
                      fill: 'hsl(var(--destructive))',
                      fontSize: '12px',
                      fontWeight: '600'
                    }
                  }}
                />
                <ReferenceLine
                  y={60}
                  stroke='hsl(142, 76%, 36%)'
                  strokeDasharray='8 4'
                  strokeWidth={2}
                  strokeOpacity={0.7}
                  label={{
                    value: 'Excellence: 60%',
                    position: 'insideTopRight',
                    style: {
                      fill: 'hsl(142, 76%, 36%)',
                      fontSize: '12px',
                      fontWeight: '600'
                    }
                  }}
                />
                <Bar
                  dataKey='morningRate'
                  radius={[6, 6, 0, 0]}
                  strokeWidth={1}
                >
                  {performanceData.map((entry, index) => {
                    const value = entry.morningRate;
                    let fillColor, strokeColor;

                    if (value >= 60) {
                      fillColor = 'url(#performanceGradientGreen)';
                      strokeColor = 'hsl(142, 76%, 36%)';
                    } else if (value >= 40) {
                      fillColor = 'url(#performanceGradientOrange)';
                      strokeColor = 'hsl(25, 95%, 53%)';
                    } else {
                      fillColor = 'url(#performanceGradientRed)';
                      strokeColor = 'hsl(0, 84%, 60%)';
                    }

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={fillColor}
                        stroke={strokeColor}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className='text-muted-foreground mt-4 flex items-center justify-between text-xs'>
            <div className='flex items-center space-x-4'>
              <span>Showing top {displayLimit} physicians</span>
              <span>•</span>
              <span>
                Sorted by{' '}
                {sortBy === 'morningRate'
                  ? 'Morning Rate'
                  : sortBy === 'totalDischarges'
                    ? 'Total Discharges'
                    : 'Average Time'}
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <span>Performance Levels:</span>
              <span className='font-medium text-green-600'>60%+ Excellent</span>
              <span>•</span>
              <span className='font-medium text-orange-600'>40-59% Good</span>
              <span>•</span>
              <span className='font-medium text-red-600'>
                &lt;40% Needs Improvement
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Distribution Area Chart */}
      <Card data-onboarding='hourly-distribution'>
        <CardHeader>
          <CardTitle>24-Hour Discharge Distribution</CardTitle>
          <CardDescription>
            Hourly discharge patterns with optimal window (8 AM - 12 PM)
            highlighted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='hour'
                  tickFormatter={(value) => value.replace(':00', '')}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type='monotone'
                  dataKey='hourlyDischarges'
                  stroke='var(--color-hourlyDischarges)'
                  fill='var(--color-hourlyDischarges)'
                  fillOpacity={0.3}
                />
                <Area
                  type='monotone'
                  dataKey='optimal'
                  stroke='var(--color-optimal)'
                  fill='var(--color-optimal)'
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Volume vs Performance Scatter */}
      <Card data-onboarding='volume-performance'>
        <CardHeader>
          <CardTitle>Volume vs Performance Analysis</CardTitle>
          <CardDescription>
            Correlation between total discharge volume and morning discharge
            rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <ScatterChart data={scatterData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  type='number'
                  dataKey='totalDischarges'
                  name='Total Discharges'
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <YAxis
                  type='number'
                  dataKey='morningRate'
                  name='Morning Rate %'
                  domain={[0, 100]}
                />
                <ChartTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, payload) => {
                        if (name === 'totalDischarges') {
                          return [value, 'Total Discharges'];
                        }
                        if (name === 'morningRate') {
                          return [`${value}%`, 'Morning Rate'];
                        }
                        if (name === 'avgTime') {
                          const hours = Math.floor(payload.payload.avgTime);
                          const minutes = Math.round(
                            (payload.payload.avgTime % 1) * 60
                          );
                          return [
                            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                            'Avg Time'
                          ];
                        }
                        return [value, name];
                      }}
                    />
                  }
                />
                <ReferenceLine
                  y={40}
                  stroke='hsl(var(--destructive))'
                  strokeDasharray='5 5'
                />
                <Scatter
                  dataKey='morningRate'
                  fill='var(--color-morningRate)'
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* High Volume Physicians Performance */}
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>High Volume Physicians - Performance Analysis</CardTitle>
          <CardDescription>
            Top 15 physicians by discharge volume showing their morning
            discharge performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={volumePerformanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                  className='text-xs'
                />
                <YAxis yAxisId='left' orientation='left' />
                <YAxis yAxisId='right' orientation='right' domain={[0, 100]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return data?.fullName || label;
                      }}
                      formatter={(value, name, payload) => {
                        if (name === 'totalDischarges') {
                          return [value, 'Total Discharges'];
                        }
                        if (name === 'morningRate') {
                          return [`${value}%`, 'Morning Rate'];
                        }
                        if (name === 'avgTime') {
                          const hours = Math.floor(payload.payload.avgTime);
                          const minutes = Math.round(
                            (payload.payload.avgTime % 1) * 60
                          );
                          return [
                            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                            'Avg Time'
                          ];
                        }
                        return [value, name];
                      }}
                    />
                  }
                />
                <ReferenceLine
                  yAxisId='right'
                  y={40}
                  stroke='hsl(var(--destructive))'
                  strokeDasharray='5 5'
                />
                <Bar
                  yAxisId='left'
                  dataKey='totalDischarges'
                  fill='var(--color-totalDischarges)'
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId='right'
                  type='monotone'
                  dataKey='morningRate'
                  stroke='var(--color-morningRate)'
                  strokeWidth={3}
                  dot={{
                    fill: 'var(--color-morningRate)',
                    strokeWidth: 2,
                    r: 4
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Average Discharge Time Trend */}
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>Average Discharge Time Analysis</CardTitle>
          <CardDescription>
            Physicians sorted by average discharge time with noon reference line
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={filteredAndSortedData.map((phy, index) => ({
                  rank: index + 1,
                  name: phy.name,
                  fullName: phy.fullName,
                  avgTime: phy.avgTime,
                  totalDischarges: phy.totalDischarges,
                  morningRate: phy.morningRate
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                  className='text-xs'
                />
                <YAxis domain={[6, 20]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return data?.fullName || label;
                      }}
                      formatter={(value, name, payload) => {
                        if (name === 'avgTime') {
                          const hours = Math.floor(value as number);
                          const minutes = Math.round(
                            ((value as number) % 1) * 60
                          );
                          return [
                            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                            'Avg Time'
                          ];
                        }
                        if (name === 'totalDischarges') {
                          return [
                            payload.payload.totalDischarges,
                            'Total Discharges'
                          ];
                        }
                        if (name === 'morningRate') {
                          return [
                            `${payload.payload.morningRate}%`,
                            'Morning Rate'
                          ];
                        }
                        return [value, name];
                      }}
                    />
                  }
                />
                <ReferenceLine
                  y={12}
                  stroke='hsl(var(--destructive))'
                  strokeDasharray='5 5'
                  label='Noon Target'
                />
                <Line
                  type='monotone'
                  dataKey='avgTime'
                  stroke='var(--color-avgTime)'
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-avgTime)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
