'use client';

import { ProcessedPhysicianData } from '@/types/discharge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getColorScale } from '@/lib/discharge-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface HourlyHeatmapProps {
  data: ProcessedPhysicianData[];
}

export function HourlyHeatmap({ data }: HourlyHeatmapProps) {
  const maxValue = Math.max(...data.flatMap((p) => p.discharges));

  // Sort physicians by morning discharge rate for better visualization
  const sortedData = [...data].sort(
    (a, b) => b.percentBeforeNoon - a.percentBeforeNoon
  );

  const HeatmapCell = ({
    value,
    hour,
    physicianName
  }: {
    value: number;
    hour: number;
    physicianName: string;
  }) => {
    const { bg, text } = getColorScale(value, maxValue);
    const isOptimalHour = hour >= 8 && hour < 12;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`relative flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-medium transition-all duration-200 hover:z-10 hover:scale-110 ${isOptimalHour ? 'ring-opacity-50 ring-2 ring-green-400' : ''} `}
              style={{
                backgroundColor: bg,
                color: text
              }}
            >
              {value > 0 ? value : ''}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className='text-center'>
              <p className='font-semibold'>{physicianName}</p>
              <p>
                {hour}:00 - {hour}:59
              </p>
              <p>{value} discharges</p>
              {isOptimalHour && (
                <p className='text-xs text-green-600'>Optimal Window</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Legend and Instructions */}
      <Card data-onboarding='heatmap-controls'>
        <CardHeader>
          <CardTitle>24-Hour Discharge Heatmap</CardTitle>
          <CardDescription>
            Interactive heatmap showing discharge patterns for each physician
            across 24 hours. Darker colors indicate higher discharge volumes.
            Green rings highlight the optimal 8 AM - 12 PM window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>Intensity:</span>
              <div className='flex items-center gap-1'>
                <div className='h-4 w-4 border bg-teal-50'></div>
                <span className='text-xs'>Low</span>
                <div className='h-4 w-4 bg-teal-200'></div>
                <div className='h-4 w-4 bg-teal-400'></div>
                <div className='h-4 w-4 bg-teal-600'></div>
                <div className='h-4 w-4 bg-teal-800'></div>
                <span className='text-xs'>High</span>
              </div>
            </div>
            <Badge
              variant='outline'
              className='border-green-200 bg-green-50 text-green-700'
            >
              Optimal Window: 8 AM - 12 PM
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card data-onboarding='heatmap-main'>
        <CardContent className='p-6'>
          <div className='overflow-x-auto'>
            <div className='min-w-[800px]'>
              {/* Hour Headers */}
              <div className='mb-2 flex'>
                <div className='w-32 flex-shrink-0'></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className='w-8 text-center'>
                    <div
                      className={`text-xs font-medium ${i >= 8 && i < 12 ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      {i}
                    </div>
                  </div>
                ))}
              </div>

              {/* Physician Rows */}
              <div className='space-y-1'>
                {sortedData.map((physician) => (
                  <div key={physician.name} className='flex items-center'>
                    {/* Physician Info */}
                    <div className='w-32 flex-shrink-0 pr-2'>
                      <div className='truncate text-sm font-medium'>
                        {physician.name}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {physician.percentBeforeNoon.toFixed(1)}% morning
                      </div>
                    </div>

                    {/* Hourly Cells */}
                    <div className='flex gap-0.5'>
                      {physician.discharges.map((value, hour) => (
                        <HeatmapCell
                          key={hour}
                          value={value}
                          hour={hour}
                          physicianName={physician.name}
                        />
                      ))}
                    </div>

                    {/* Summary Stats */}
                    <div className='ml-4 flex items-center gap-2'>
                      <Badge variant='secondary' className='text-xs'>
                        {physician.total} total
                      </Badge>
                      <Badge
                        variant={
                          physician.percentBeforeNoon >= 40
                            ? 'default'
                            : 'destructive'
                        }
                        className='text-xs'
                      >
                        Peak: {physician.peakHour}:00
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Row */}
              <div className='mt-4 border-t pt-4'>
                <div className='flex items-center'>
                  <div className='w-32 flex-shrink-0 pr-2'>
                    <div className='text-sm font-bold'>Hospital Total</div>
                    <div className='text-muted-foreground text-xs'>
                      All physicians
                    </div>
                  </div>

                  <div className='flex gap-0.5'>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const totalForHour = sortedData.reduce(
                        (sum, phy) => sum + phy.discharges[hour],
                        0
                      );
                      const { bg, text } = getColorScale(
                        totalForHour,
                        (maxValue * sortedData.length) / 5
                      );
                      const isOptimalHour = hour >= 8 && hour < 12;

                      return (
                        <TooltipProvider key={hour}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 ${isOptimalHour ? 'ring-2 ring-green-400' : ''} `}
                                style={{ backgroundColor: bg, color: text }}
                              >
                                {totalForHour}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className='text-center'>
                                <p className='font-semibold'>Hospital Total</p>
                                <p>
                                  {hour}:00 - {hour}:59
                                </p>
                                <p>{totalForHour} total discharges</p>
                                {isOptimalHour && (
                                  <p className='text-xs text-green-600'>
                                    Optimal Window
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
              <h4 className='mb-2 font-semibold text-green-800'>
                Optimal Performers
              </h4>
              <p className='text-sm text-green-700'>
                {sortedData.filter((p) => p.percentBeforeNoon >= 40).length}{' '}
                physicians meet the 40% morning discharge target
              </p>
            </div>

            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
              <h4 className='mb-2 font-semibold text-blue-800'>
                Peak Activity
              </h4>
              <p className='text-sm text-blue-700'>
                Most discharges occur between{' '}
                {
                  Array.from({ length: 24 }, (_, hour) =>
                    sortedData.reduce((sum, p) => sum + p.discharges[hour], 0)
                  )
                    .map((total, hour) => ({ hour, total }))
                    .sort((a, b) => b.total - a.total)[0]?.hour
                }
                :00 -{' '}
                {Array.from({ length: 24 }, (_, hour) =>
                  sortedData.reduce((sum, p) => sum + p.discharges[hour], 0)
                )
                  .map((total, hour) => ({ hour, total }))
                  .sort((a, b) => b.total - a.total)[0]?.hour + 1}
                :00
              </p>
            </div>

            <div className='rounded-lg border border-orange-200 bg-orange-50 p-4'>
              <h4 className='mb-2 font-semibold text-orange-800'>
                Improvement Opportunity
              </h4>
              <p className='text-sm text-orange-700'>
                {sortedData.filter((p) => p.percentBeforeNoon < 30).length}{' '}
                physicians have significant room for morning optimization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
