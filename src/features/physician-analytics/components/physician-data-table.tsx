'use client';

import { useState } from 'react';
import { ProcessedPhysicianData } from '@/types/discharge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';

interface PhysicianDataTableProps {
  data: ProcessedPhysicianData[];
}

export function PhysicianDataTable({ data }: PhysicianDataTableProps) {
  const [sortColumn, setSortColumn] =
    useState<keyof ProcessedPhysicianData>('percentBeforeNoon');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: keyof ProcessedPhysicianData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const getPerformanceIndicator = (
    percentBeforeNoon: number,
    avgBeforeNoon: number
  ) => {
    if (percentBeforeNoon > avgBeforeNoon + 5) {
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Above Average'
      };
    } else if (percentBeforeNoon < avgBeforeNoon - 5) {
      return {
        icon: TrendingDown,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Below Average'
      };
    } else {
      return {
        icon: Minus,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'Average'
      };
    }
  };

  const avgBeforeNoon =
    data.reduce((sum, phy) => sum + phy.percentBeforeNoon, 0) / data.length;

  const SortableHeader = ({
    column,
    children
  }: {
    column: keyof ProcessedPhysicianData;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant='ghost'
        onClick={() => handleSort(column)}
        className='h-auto p-0 font-semibold hover:bg-transparent'
      >
        {children}
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Physician Performance Data</CardTitle>
        <CardDescription>
          Comprehensive discharge statistics for all physicians with sortable
          columns and performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'>Rank</TableHead>
                <SortableHeader column='name'>Physician</SortableHeader>
                <SortableHeader column='total'>Total Discharges</SortableHeader>
                <SortableHeader column='percentBeforeNoon'>
                  Morning Rate (%)
                </SortableHeader>
                <SortableHeader column='averageDischargeTime'>
                  Avg Time
                </SortableHeader>
                <SortableHeader column='peakHour'>Peak Hour</SortableHeader>
                <TableHead>Performance</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='flex items-center'>
                          Progress
                          <Info className='ml-1 h-3 w-3' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visual representation of morning discharge rate</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((physician, index) => {
                const indicator = getPerformanceIndicator(
                  physician.percentBeforeNoon,
                  avgBeforeNoon
                );
                const isOptimalTime = physician.averageDischargeTime < 12;
                const isOptimalPeak = physician.peakHour < 12;

                return (
                  <TableRow key={physician.name} className='hover:bg-muted/50'>
                    <TableCell className='text-center font-medium'>
                      {index + 1}
                    </TableCell>

                    <TableCell className='font-medium'>
                      <div>
                        <div className='font-semibold'>{physician.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {physician.dischargesBeforeNoon} morning /{' '}
                          {physician.total - physician.dischargesBeforeNoon}{' '}
                          afternoon
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className='text-center'>
                      <div className='font-semibold'>{physician.total}</div>
                      <Badge variant='outline' className='text-xs'>
                        {(
                          (physician.total /
                            data.reduce((sum, p) => sum + p.total, 0)) *
                          100
                        ).toFixed(1)}
                        % of total
                      </Badge>
                    </TableCell>

                    <TableCell className='text-center'>
                      <div
                        className={`font-semibold ${physician.percentBeforeNoon >= 40 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {physician.percentBeforeNoon.toFixed(1)}%
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Target: 40%+
                      </div>
                    </TableCell>

                    <TableCell className='text-center'>
                      <div
                        className={`font-semibold ${isOptimalTime ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {formatTime(physician.averageDischargeTime)}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {isOptimalTime ? 'Before noon' : 'After noon'}
                      </div>
                    </TableCell>

                    <TableCell className='text-center'>
                      <div
                        className={`font-semibold ${isOptimalPeak ? 'text-green-600' : 'text-purple-600'}`}
                      >
                        {physician.peakHour}:00
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {physician.discharges[physician.peakHour]} discharges
                      </div>
                    </TableCell>

                    <TableCell
                      className='text-center'
                      data-onboarding='performance-badges'
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant='secondary'
                              className={`${indicator.bg} ${indicator.color}`}
                            >
                              <indicator.icon className='h-3 w-3' />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{indicator.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    <TableCell>
                      <div className='w-full'>
                        <Progress
                          value={physician.percentBeforeNoon}
                          className='h-2'
                        />
                        <div className='text-muted-foreground mt-1 text-xs'>
                          {physician.percentBeforeNoon.toFixed(0)}% morning
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className='text-muted-foreground mt-4 text-sm'>
          Showing {sortedData.length} physicians • Average morning rate:{' '}
          {avgBeforeNoon.toFixed(1)}%
        </div>
      </CardContent>
    </Card>
  );
}
