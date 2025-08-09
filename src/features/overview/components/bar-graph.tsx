'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';

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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

export const description = 'Physician discharge performance and volume';

const chartConfig = {
  morningRate: {
    label: 'Morning Discharge %',
    color: 'hsl(var(--chart-2))'
  },
  totalDischarges: {
    label: 'Total Discharges',
    color: 'hsl(var(--chart-1))'
  },
  avgTime: {
    label: 'Avg Discharge Hour',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

interface ChartRow {
  rank: number;
  physician: string;
  fullName: string;
  morningRate: number;
  totalDischarges: number;
  avgTime: number;
}

export function BarGraph() {
  const [metric, setMetric] =
    React.useState<keyof typeof chartConfig>('morningRate');
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState('15');
  const [showValues] = React.useState(true);
  const [selected, setSelected] = React.useState<ChartRow | null>(null);

  const processed = React.useMemo(
    () => processPhysicianData(physicianData),
    []
  );
  // const metrics = React.useMemo(() => calculateOverallMetrics(processed), [processed]);

  const filtered = React.useMemo(() => {
    return processed.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [processed, search]);

  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (metric === 'morningRate')
        return b.percentBeforeNoon - a.percentBeforeNoon;
      if (metric === 'totalDischarges') return b.total - a.total;
      return a.averageDischargeTime - b.averageDischargeTime; // lower is better
    });
  }, [filtered, metric]);

  const limited = React.useMemo(() => {
    const count = limit === 'all' ? sorted.length : parseInt(limit);
    return sorted.slice(0, count);
  }, [sorted, limit]);

  const chartData: ChartRow[] = React.useMemo(() => {
    return limited.map((phy, index) => ({
      rank: index + 1,
      physician:
        phy.name.length > 12 ? phy.name.substring(0, 12) + '...' : phy.name,
      fullName: phy.name,
      morningRate: Number(phy.percentBeforeNoon.toFixed(2)),
      totalDischarges: phy.total,
      avgTime: Number(phy.averageDischargeTime.toFixed(2))
    }));
  }, [limited]);

  const headerTotals = React.useMemo(() => {
    const avgMorning =
      chartData.reduce((s, r) => s + r.morningRate, 0) /
      (chartData.length || 1);
    const totalVolume = chartData.reduce((s, r) => s + r.totalDischarges, 0);
    const avgHour =
      chartData.reduce((s, r) => s + r.avgTime, 0) / (chartData.length || 1);
    return { avgMorning, totalVolume, avgHour };
  }, [chartData]);

  function handleExportCsv() {
    const rows: (string | number)[][] = [
      [
        'physician',
        ...Array.from({ length: 24 }, (_, i) => `h${i}`),
        'total',
        'percentBeforeNoon',
        'averageDischargeHour'
      ]
    ];
    processed.forEach((p) => {
      rows.push([
        p.name,
        ...p.discharges,
        p.total,
        Number(p.percentBeforeNoon.toFixed(2)),
        Number(p.averageDischargeTime.toFixed(2))
      ]);
    });
    const csv = rows
      .map((r) =>
        r
          .map((c) =>
            typeof c === 'string' ? '"' + c.replace(/"/g, '""') + '"' : c
          )
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'physician_performance.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }

  const isClient = true; // component is client-only already
  if (!isClient) return null;

  return (
    <Card className='@container/card !pt-3' data-onboarding='performance-chart'>
      <CardHeader className='flex flex-col gap-3 border-b !p-0 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-3'>
          <CardTitle className='text-xl'>Top Physician Performance</CardTitle>
          <CardDescription>
            Rank by morning discharge %, total discharges, or average discharge
            hour
          </CardDescription>
        </div>
        <div className='flex w-full flex-col gap-2 border-t px-4 py-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:px-6'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Filter physicians'
            className='h-9 w-full sm:w-[180px]'
            aria-label='Filter physicians'
          />
          <Select
            value={metric}
            onValueChange={(v) => setMetric(v as keyof typeof chartConfig)}
          >
            <SelectTrigger className='h-9 w-full sm:w-[200px]'>
              <SelectValue placeholder='Metric' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='morningRate'>Morning Discharge %</SelectItem>
              <SelectItem value='totalDischarges'>Total Discharges</SelectItem>
              <SelectItem value='avgTime'>Avg Discharge Hour</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className='h-9 w-full sm:w-[140px]'>
              <SelectValue placeholder='Show' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='10'>Top 10</SelectItem>
              <SelectItem value='15'>Top 15</SelectItem>
              <SelectItem value='20'>Top 20</SelectItem>
              <SelectItem value='all'>All</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='secondary'
            className='h-9'
            onClick={handleExportCsv}
            aria-label='Export CSV'
          >
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <div className='mb-3 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm'>
          <div>
            <div className='text-muted-foreground'>Avg Morning %</div>
            <div className='font-semibold'>
              {headerTotals.avgMorning.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className='text-muted-foreground'>Total Discharges</div>
            <div className='font-semibold'>
              {headerTotals.totalVolume.toLocaleString()}
            </div>
          </div>
          <div>
            <div className='text-muted-foreground'>Avg Discharge Hour</div>
            <div className='font-semibold'>
              {headerTotals.avgHour.toFixed(1)}h
            </div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[300px] w-full'
        >
          <BarChart
            data={chartData}
            layout='horizontal'
            margin={{ left: 90, right: 16, top: 8, bottom: 8 }}
            barSize={20}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type='number'
              domain={
                metric === 'morningRate'
                  ? [0, 100]
                  : metric === 'avgTime'
                    ? [0, 24]
                    : [0, 'dataMax']
              }
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type='category'
              dataKey='physician'
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fontSize: 12 }}
            />
            {metric === 'morningRate' && (
              <ReferenceLine
                x={60}
                stroke='hsl(142,76%,36%)'
                strokeDasharray='3 3'
                label={{
                  value: 'Target 60%',
                  position: 'insideTopRight',
                  fill: 'hsl(142,76%,36%)',
                  fontSize: 12
                }}
              />
            )}
            {metric === 'avgTime' && (
              <ReferenceLine
                x={12}
                stroke='hsl(25,95%,53%)'
                strokeDasharray='3 3'
                label={{
                  value: 'Noon',
                  position: 'insideTopRight',
                  fill: 'hsl(25,95%,53%)',
                  fontSize: 12
                }}
              />
            )}
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.06 }}
              content={
                <ChartTooltipContent
                  className='w-[240px]'
                  labelFormatter={(_: unknown, payload: any) => {
                    const row = payload?.[0]?.payload as ChartRow | undefined;
                    if (!row) return null;
                    return (
                      <div className='flex flex-col'>
                        <span className='font-medium'>{row.fullName}</span>
                        <span className='text-muted-foreground'>
                          Total: {row.totalDischarges.toLocaleString()} •
                          Morning: {row.morningRate.toFixed(1)}% • Avg Hour:{' '}
                          {row.avgTime.toFixed(1)}h
                        </span>
                      </div>
                    );
                  }}
                  formatter={(value) => {
                    if (metric === 'morningRate')
                      return [value + '%', 'Morning Discharge %'];
                    if (metric === 'avgTime')
                      return [value + 'h', 'Avg Discharge Hour'];
                    return [value, 'Total Discharges'];
                  }}
                />
              }
            />
            <Bar
              dataKey={metric}
              radius={[0, 6, 6, 0]}
              onClick={(d) => setSelected(d as unknown as ChartRow)}
            >
              {chartData.map((row, idx) => {
                let fill = `var(--color-${metric})`;
                if (metric === 'morningRate')
                  fill =
                    row.morningRate >= 60
                      ? 'url(#gradGreen)'
                      : 'url(#gradOrange)';
                if (metric === 'avgTime')
                  fill =
                    row.avgTime <= 12 ? 'url(#gradGreen)' : 'url(#gradRed)';
                return (
                  <Cell
                    key={idx}
                    fill={fill}
                    cursor='pointer'
                    aria-label={`Show details for ${row.fullName}`}
                  />
                );
              })}
              {showValues && (
                <LabelList
                  dataKey={metric}
                  position='right'
                  className='fill-foreground'
                  formatter={(v: number) =>
                    metric === 'morningRate'
                      ? `${v}%`
                      : metric === 'avgTime'
                        ? `${v}h`
                        : v
                  }
                />
              )}
            </Bar>

            {/* gradients for conditional coloring */}
            <defs>
              <linearGradient id='gradGreen' x1='0' y1='0' x2='1' y2='0'>
                <stop
                  offset='0%'
                  stopColor='hsl(142,76%,36%)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='hsl(142,76%,36%)'
                  stopOpacity={0.5}
                />
              </linearGradient>
              <linearGradient id='gradOrange' x1='0' y1='0' x2='1' y2='0'>
                <stop
                  offset='0%'
                  stopColor='hsl(25,95%,53%)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='hsl(25,95%,53%)'
                  stopOpacity={0.5}
                />
              </linearGradient>
              <linearGradient id='gradRed' x1='0' y1='0' x2='1' y2='0'>
                <stop
                  offset='0%'
                  stopColor='hsl(0,84%,60%)'
                  stopOpacity={0.9}
                />
                <stop
                  offset='100%'
                  stopColor='hsl(0,84%,60%)'
                  stopOpacity={0.5}
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ChartContainer>

        {/* Details dialog with hourly distribution for selected physician */}
        <Dialog
          open={!!selected}
          onOpenChange={(open) => !open && setSelected(null)}
        >
          <DialogContent className='max-w-xl sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle>{selected?.fullName}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className='space-y-4'>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div>
                    <div className='text-muted-foreground'>Morning %</div>
                    <div className='font-semibold'>
                      {selected.morningRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className='text-muted-foreground'>Total</div>
                    <div className='font-semibold'>
                      {selected.totalDischarges.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className='text-muted-foreground'>Avg Hour</div>
                    <div className='font-semibold'>
                      {selected.avgTime.toFixed(1)}h
                    </div>
                  </div>
                </div>
                <div className='h-48'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={(() => {
                        const full = processed.find(
                          (p) => p.name === selected.fullName
                        );
                        const arr = full?.discharges ?? [];
                        return arr.map((v, hour) => ({
                          hour: `${hour}:00`,
                          value: v
                        }));
                      })()}
                      margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray='3 3' vertical={false} />
                      <XAxis
                        dataKey='hour'
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <Bar
                        dataKey='value'
                        fill='var(--primary)'
                        radius={[2, 2, 0, 0]}
                      />
                      <ReferenceLine x={'8:00'} stroke='hsl(43,96%,56%)' />
                      <ReferenceLine x={'12:00'} stroke='hsl(43,96%,56%)' />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
