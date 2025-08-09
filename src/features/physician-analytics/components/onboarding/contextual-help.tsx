'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  HelpCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  BarChart3,
  Users,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface ContextualHelpProps {
  topic:
    | 'morning-discharge'
    | 'performance-tiers'
    | 'optimal-window'
    | 'best-practices'
    | 'impact-analysis';
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const helpContent = {
  'morning-discharge': {
    title: 'Morning Discharge Rate',
    icon: <Target className='h-4 w-4' />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    content: {
      overview:
        'The percentage of patient discharges completed before noon (12:00 PM). This is a critical metric for hospital efficiency.',
      importance:
        'Morning discharges free up beds earlier in the day, allowing for better patient flow and reduced wait times for new admissions.',
      target:
        'Hospital best practice targets 40%+ morning discharge rate, with excellence level at 60%+.',
      impact:
        'Improving morning discharge rates can reduce afternoon bottlenecks by 25-40% and improve overall patient satisfaction.'
    },
    tips: [
      'Start discharge planning during early morning rounds (7-8 AM)',
      'Coordinate with nursing staff for medication reconciliation',
      'Prepare discharge paperwork the evening before when possible',
      'Communicate with patients about expected discharge timing'
    ]
  },
  'performance-tiers': {
    title: 'Performance Tier System',
    icon: <BarChart3 className='h-4 w-4' />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-700',
    content: {
      overview:
        'Physicians are categorized into three performance tiers based on their morning discharge rates.',
      excellence:
        'Excellence Tier (50%+): Top performers who serve as best practice examples and mentors.',
      target:
        'Target Tier (40-49%): Meeting minimum standards with potential for improvement to excellence level.',
      focus:
        'Focus Tier (<40%): Priority physicians for improvement initiatives and additional support resources.',
      strategy:
        'This tiered approach helps prioritize improvement efforts and resource allocation effectively.'
    },
    tips: [
      'Excellence tier physicians can mentor others',
      'Target tier physicians need focused coaching',
      'Focus tier physicians require comprehensive intervention',
      'Regular tier assessment helps track progress'
    ]
  },
  'optimal-window': {
    title: 'Optimal Discharge Window',
    icon: <Clock className='h-4 w-4' />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    content: {
      overview:
        'The 8 AM - 12 PM window is considered optimal for patient discharges in hospital settings.',
      rationale:
        'This timing maximizes bed availability for new admissions and reduces afternoon workflow congestion.',
      benefits:
        'Discharges during this window improve patient satisfaction, reduce wait times, and optimize staff workflow.',
      coordination:
        'Requires coordination between physicians, nursing staff, pharmacy, and discharge planning teams.'
    },
    tips: [
      'Begin discharge assessments during 7 AM rounds',
      'Complete medication reconciliation by 9 AM',
      'Coordinate transportation arrangements early',
      'Prepare discharge instructions the night before'
    ]
  },
  'best-practices': {
    title: 'Best Practice Analysis',
    icon: <Lightbulb className='h-4 w-4' />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-700',
    content: {
      overview:
        'Analysis of patterns and strategies from top-performing physicians to identify replicable success factors.',
      patterns:
        'Top performers typically start discharge planning early, maintain consistent timing, and coordinate effectively with teams.',
      communication:
        'Effective communication with patients about discharge expectations improves satisfaction and reduces delays.',
      workflow:
        'Standardized discharge workflows and checklists help maintain consistency and reduce errors.'
    },
    tips: [
      'Study patterns from excellence tier physicians',
      'Implement standardized discharge checklists',
      'Establish clear communication protocols',
      'Regular team meetings to discuss discharge planning'
    ]
  },
  'impact-analysis': {
    title: 'Impact Analysis & Projections',
    icon: <TrendingUp className='h-4 w-4' />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    content: {
      overview:
        'Quantitative analysis of potential improvements if physicians in the Focus tier reach target performance levels.',
      calculation:
        'Impact is calculated by estimating additional morning discharges if all physicians achieve 40% morning rate.',
      benefits:
        'Improvements lead to better bed utilization, reduced patient wait times, and enhanced hospital efficiency.',
      roi: 'Investment in discharge optimization typically shows positive ROI within 3-6 months through improved patient flow.'
    },
    tips: [
      'Focus improvement efforts on highest-impact physicians',
      'Track progress monthly with specific metrics',
      'Celebrate improvements to maintain momentum',
      'Share success stories across departments'
    ]
  }
};

export function ContextualHelp({
  topic,
  className = '',
  side = 'top'
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const help = helpContent[topic];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={`h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
        >
          <HelpCircle className='text-muted-foreground h-3 w-3' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        className={`w-96 p-0 shadow-lg ${help.bgColor} ${help.borderColor} border-2`}
        sideOffset={5}
      >
        <Card className='border-0 bg-transparent shadow-none'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className={help.color}>{help.icon}</div>
                <CardTitle className='text-base'>{help.title}</CardTitle>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsOpen(false)}
                className='h-6 w-6 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            {/* Overview */}
            <div>
              <h4 className='mb-2 flex items-center gap-1 text-sm font-medium'>
                <Users className='h-3 w-3' />
                Overview
              </h4>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {help.content.overview}
              </p>
            </div>

            {/* Key Points */}
            <div className='space-y-2'>
              {Object.entries(help.content)
                .slice(1)
                .map(([key, value]) => (
                  <div key={key} className='text-xs'>
                    <span className='font-medium text-slate-700 capitalize dark:text-slate-300'>
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className='text-muted-foreground ml-1'>{value}</span>
                  </div>
                ))}
            </div>

            {/* Best Practice Tips */}
            <div>
              <h4 className='mb-2 flex items-center gap-1 text-sm font-medium'>
                <CheckCircle className='h-3 w-3 text-green-600' />
                Best Practice Tips
              </h4>
              <ul className='space-y-1'>
                {help.tips.map((tip, index) => (
                  <li
                    key={index}
                    className='text-muted-foreground flex items-start gap-2 text-xs'
                  >
                    <div className='mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-current' />
                    <span className='leading-relaxed'>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hospital Impact Badge */}
            <div className='border-t border-current/10 pt-2'>
              <Badge
                variant='outline'
                className={`text-xs ${help.color} bg-current/10`}
              >
                <AlertCircle className='mr-1 h-3 w-3' />
                Hospital Impact: High Priority
              </Badge>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

// Predefined contextual help components for common use cases
export const HospitalContextualHelp = {
  MorningDischarge: (props?: Partial<ContextualHelpProps>) => (
    <ContextualHelp topic='morning-discharge' {...props} />
  ),
  PerformanceTiers: (props?: Partial<ContextualHelpProps>) => (
    <ContextualHelp topic='performance-tiers' {...props} />
  ),
  OptimalWindow: (props?: Partial<ContextualHelpProps>) => (
    <ContextualHelp topic='optimal-window' {...props} />
  ),
  BestPractices: (props?: Partial<ContextualHelpProps>) => (
    <ContextualHelp topic='best-practices' {...props} />
  ),
  ImpactAnalysis: (props?: Partial<ContextualHelpProps>) => (
    <ContextualHelp topic='impact-analysis' {...props} />
  )
};
