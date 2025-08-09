'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding } from './onboarding-provider';
import {
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Target,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Clock
} from 'lucide-react';

interface OnboardingControlsProps {
  className?: string;
}

export function OnboardingControls({ className }: OnboardingControlsProps) {
  const { startOnboarding, isStepCompleted, getStepsForSection } =
    useOnboarding();

  const sections = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      description: 'Learn the basics of navigating the analytics dashboard',
      icon: <BarChart3 className='h-4 w-4' />,
      color:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 'data-table',
      title: 'Data Analysis',
      description: 'Explore detailed physician data and filtering options',
      icon: <Target className='h-4 w-4' />,
      color:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      id: 'charts',
      title: 'Visual Analytics',
      description: 'Understand performance charts and trend analysis',
      icon: <TrendingUp className='h-4 w-4' />,
      color:
        'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    {
      id: 'heatmap',
      title: 'Hourly Patterns',
      description: 'Analyze discharge patterns across 24-hour periods',
      icon: <Clock className='h-4 w-4' />,
      color:
        'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/50',
      textColor: 'text-orange-700 dark:text-orange-300'
    },
    {
      id: 'insights',
      title: 'Performance Insights',
      description: 'Access strategic recommendations and improvement plans',
      icon: <Lightbulb className='h-4 w-4' />,
      color:
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    }
  ];

  const getCompletionStatus = (sectionId: string) => {
    const sectionSteps = getStepsForSection(sectionId);
    const completedCount = sectionSteps.filter((step) =>
      isStepCompleted(step.id)
    ).length;
    return {
      completed: completedCount,
      total: sectionSteps.length,
      percentage:
        sectionSteps.length > 0
          ? (completedCount / sectionSteps.length) * 100
          : 0
    };
  };

  return (
    <Card
      className={`border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70 ${className}`}
    >
      <CardHeader>
        <div className='flex items-center gap-2'>
          <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 text-white'>
            <BookOpen className='h-4 w-4' />
          </div>
          <div>
            <CardTitle className='text-lg'>Analytics Training Center</CardTitle>
            <CardDescription>
              Interactive tours designed for hospital administrators and data
              analysts
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {sections.map((section) => {
            const status = getCompletionStatus(section.id);
            const isCompleted = status.percentage === 100;

            return (
              <div
                key={section.id}
                className={`rounded-lg border p-4 transition-all hover:shadow-md ${section.color}`}
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className={section.textColor}>{section.icon}</div>
                    <h4 className={`text-sm font-medium ${section.textColor}`}>
                      {section.title}
                    </h4>
                  </div>
                  {isCompleted && (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  )}
                </div>

                <p className='text-muted-foreground mb-3 text-xs leading-relaxed'>
                  {section.description}
                </p>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant={isCompleted ? 'default' : 'secondary'}
                      className={`text-xs ${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    >
                      {status.completed}/{status.total} steps
                    </Badge>
                    {status.percentage > 0 && status.percentage < 100 && (
                      <Badge variant='outline' className='text-xs'>
                        {Math.round(status.percentage)}%
                      </Badge>
                    )}
                  </div>

                  <Button
                    size='sm'
                    variant={isCompleted ? 'outline' : 'default'}
                    onClick={() => startOnboarding(section.id)}
                    className='h-7 text-xs'
                  >
                    {isCompleted ? (
                      <>
                        <RotateCcw className='mr-1 h-3 w-3' />
                        Review
                      </>
                    ) : status.percentage > 0 ? (
                      <>
                        <Play className='mr-1 h-3 w-3' />
                        Continue
                      </>
                    ) : (
                      <>
                        <Play className='mr-1 h-3 w-3' />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Start Options */}
        <div className='border-t border-slate-200/50 pt-4 dark:border-slate-700/50'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='mb-1 text-sm font-medium'>Quick Start Options</h4>
              <p className='text-muted-foreground text-xs'>
                Jump into specific areas based on your role and needs
              </p>
            </div>
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => startOnboarding('overview')}
                className='text-xs'
              >
                <HelpCircle className='mr-1 h-3 w-3' />
                Full Tour
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => startOnboarding('insights')}
                className='text-xs'
              >
                <Target className='mr-1 h-3 w-3' />
                Executive Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Hospital-specific tips */}
        <div className='rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50/70 to-purple-50/70 p-3 dark:border-blue-700/50 dark:from-blue-900/20 dark:to-purple-900/20'>
          <div className='flex items-start gap-2'>
            <Lightbulb className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600' />
            <div className='text-xs'>
              <p className='mb-1 font-medium text-blue-800 dark:text-blue-300'>
                Hospital Administrator Tip
              </p>
              <p className='leading-relaxed text-blue-700 dark:text-blue-400'>
                Start with the Executive Summary to get a high-level overview,
                then dive into specific sections based on your improvement
                priorities. Each tour is designed to be completed in 3-5
                minutes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
