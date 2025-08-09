import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { physicianData } from '@/data/physician-data';
import { processPhysicianData } from '@/lib/discharge-utils';
import React from 'react';

export function RecentSales() {
  const processedData = React.useMemo(
    () => processPhysicianData(physicianData),
    []
  );

  // Get top 5 performers by morning discharge rate
  const topPerformers = React.useMemo(() => {
    return processedData
      .sort((a, b) => b.percentBeforeNoon - a.percentBeforeNoon)
      .slice(0, 5)
      .map((phy) => ({
        name: phy.name,
        initials: phy.name
          .split(/[,\s]+/)
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase(),
        morningRate: phy.percentBeforeNoon,
        totalDischarges: phy.total,
        avgTime: phy.averageDischargeTime
      }));
  }, [processedData]);

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Top Morning Performers</CardTitle>
        <CardDescription>
          Physicians leading in early discharge optimization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {topPerformers.map((physician, index) => (
            <div key={index} className='flex items-center'>
              <Avatar className='h-9 w-9'>
                <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                  {physician.initials}
                </AvatarFallback>
              </Avatar>
              <div className='ml-4 flex-1 space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {physician.name}
                </p>
                <div className='flex items-center gap-2'>
                  <p className='text-muted-foreground text-xs'>
                    Avg: {formatTime(physician.avgTime)}
                  </p>
                  <Badge variant='secondary' className='text-xs'>
                    {physician.totalDischarges} total
                  </Badge>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-semibold text-green-600'>
                  {physician.morningRate.toFixed(1)}%
                </div>
                <div className='text-muted-foreground text-xs'>
                  morning rate
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
