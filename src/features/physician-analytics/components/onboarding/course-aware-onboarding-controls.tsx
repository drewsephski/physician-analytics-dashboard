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
import { useOnboarding } from './course-aware-onboarding-provider';
import {
  HelpCircle,
  Play,
  BarChart3,
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

interface CourseAwareOnboardingControlsProps {
  className?: string;
}

export function CourseAwareOnboardingControls({
  className
}: CourseAwareOnboardingControlsProps) {
  const { startOnboarding, getSectionProgress } = useOnboarding();

  const sections = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      icon: <BarChart3 className='h-4 w-4' />,
      description: 'Learn the basics of navigating your analytics dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'data-table',
      title: 'Data Analysis',
      icon: <Target className='h-4 w-4' />,
      description: 'Master the physician data table and filtering tools',
      color: 'text-green-600'
    },
    {
      id: 'charts',
      title: 'Visual Analytics',
      icon: <TrendingUp className='h-4 w-4' />,
      description: 'Understand charts and performance visualizations',
      color: 'text-purple-600'
    },
    {
      id: 'heatmap',
      title: 'Hourly Patterns',
      icon: <Clock className='h-4 w-4' />,
      description: 'Explore discharge timing patterns with heat maps',
      color: 'text-orange-600'
    },
    {
      id: 'insights',
      title: 'Performance Insights',
      icon: <Lightbulb className='h-4 w-4' />,
      description: 'Generate actionable insights and recommendations',
      color: 'text-yellow-600'
    }
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <HelpCircle className='h-5 w-5' />
          Training Modules
        </CardTitle>
        <CardDescription>
          Start guided tours for different sections of the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-3'>
          {sections.map((section) => {
            const progress = getSectionProgress(section.id);
            const isCompleted = progress >= 100;

            return (
              <div key={section.id} className='space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => startOnboarding(section.id)}
                  className='flex h-auto w-full flex-col items-center gap-2 p-3'
                >
                  <div
                    className={`${section.color} ${isCompleted ? 'text-green-600' : ''}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className='h-4 w-4' />
                    ) : (
                      section.icon
                    )}
                  </div>
                  <div className='text-center'>
                    <div className='text-xs font-medium'>{section.title}</div>
                    <div className='text-muted-foreground mt-1 text-xs'>
                      {section.description}
                    </div>
                  </div>
                </Button>

                <div className='flex items-center justify-between'>
                  <Badge
                    variant={isCompleted ? 'default' : 'secondary'}
                    className={`text-xs ${isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {Math.round(progress)}%
                  </Badge>
                  {!isCompleted && (
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => startOnboarding(section.id)}
                      className='h-6 px-2 text-xs'
                    >
                      <Play className='h-3 w-3' />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
