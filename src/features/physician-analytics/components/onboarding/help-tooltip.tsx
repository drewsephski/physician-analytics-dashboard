'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  HelpCircle,
  Info,
  AlertCircle,
  Target,
  TrendingUp
} from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  title?: string;
  type?: 'info' | 'warning' | 'success' | 'target';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export function HelpTooltip({
  content,
  title,
  type = 'info',
  side = 'top',
  className = '',
  children
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className='h-3 w-3 text-orange-600' />;
      case 'success':
        return <TrendingUp className='h-3 w-3 text-green-600' />;
      case 'target':
        return <Target className='h-3 w-3 text-blue-600' />;
      default:
        return <Info className='h-3 w-3 text-blue-600' />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 dark:border-orange-700 bg-orange-50/90 dark:bg-orange-900/90';
      case 'success':
        return 'border-green-200 dark:border-green-700 bg-green-50/90 dark:bg-green-900/90';
      case 'target':
        return 'border-blue-200 dark:border-blue-700 bg-blue-50/90 dark:bg-blue-900/90';
      default:
        return 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          {children || (
            <Button
              variant='ghost'
              size='sm'
              className={`h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => setIsOpen(!isOpen)}
            >
              <HelpCircle className='text-muted-foreground h-3 w-3' />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className={`max-w-xs p-3 shadow-lg backdrop-blur-sm ${getColorClasses()}`}
          sideOffset={5}
        >
          <div className='space-y-2'>
            {title && (
              <div className='flex items-center gap-2'>
                {getIcon()}
                <h4 className='text-sm font-medium'>{title}</h4>
              </div>
            )}
            <p className='text-muted-foreground text-xs leading-relaxed'>
              {content}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Predefined hospital-specific tooltips
export const HospitalTooltips = {
  MorningDischargeRate: (
    <HelpTooltip
      title='Morning Discharge Rate'
      content='Percentage of discharges completed before noon. Hospital best practice targets 40%+ to optimize bed turnover and reduce patient wait times. Higher rates indicate better discharge planning and coordination.'
      type='target'
    />
  ),

  DischargeVolume: (
    <HelpTooltip
      title='Discharge Volume'
      content='Total number of patient discharges handled by this physician. Higher volume physicians may need different optimization strategies and additional support resources.'
      type='info'
    />
  ),

  AverageDischargeTime: (
    <HelpTooltip
      title='Average Discharge Time'
      content='Mean time when discharges occur throughout the day. Earlier average times (before 12:00 PM) indicate better morning discharge practices and improved patient flow efficiency.'
      type='success'
    />
  ),

  PerformanceTiers: (
    <HelpTooltip
      title='Performance Tiers'
      content='Excellence (50%+): Top performers serving as best practice examples. Target (40-49%): Meeting minimum standards with growth potential. Focus (<40%): Priority for improvement initiatives and additional support.'
      type='target'
    />
  ),

  OptimalWindow: (
    <HelpTooltip
      title='Optimal Discharge Window'
      content='8 AM - 12 PM is considered the optimal discharge window for hospitals. Discharges during this period maximize bed availability for new admissions and reduce afternoon bottlenecks.'
      type='success'
    />
  ),

  ImpactProjection: (
    <HelpTooltip
      title='Impact Projection'
      content='Estimated improvement in morning discharges if physicians in the Focus tier reach the 40% target. This calculation helps prioritize improvement efforts and resource allocation.'
      type='warning'
    />
  ),

  BestPractices: (
    <HelpTooltip
      title='Best Practice Analysis'
      content='Patterns identified from top-performing physicians including early morning rounds, consistent discharge timing, and effective team coordination. These insights guide improvement strategies.'
      type='success'
    />
  ),

  HeatmapIntensity: (
    <HelpTooltip
      title='Heatmap Color Intensity'
      content='Darker colors indicate higher discharge volumes during specific hours. This visualization helps identify individual physician patterns and opportunities for schedule optimization.'
      type='info'
    />
  )
};
