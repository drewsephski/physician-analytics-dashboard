'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useOnboarding } from './course-aware-onboarding-provider';
import { useCourseProgress } from '@/hooks/use-course-progress';
import {
  CheckCircle,
  Circle,
  Play,
  BarChart3,
  Target,
  TrendingUp,
  Clock,
  Lightbulb,
  Award,
  BookOpen
} from 'lucide-react';

interface CourseProgressIndicatorProps {
  className?: string;
}

export function CourseProgressIndicator({
  className = ''
}: CourseProgressIndicatorProps) {
  const {
    isStepCompleted,
    getStepsForSection,
    startOnboarding,
    getSectionProgress,
    getOverallProgress
  } = useOnboarding();
  const { courses, loading } = useCourseProgress();

  const sections = [
    {
      id: 'overview',
      title: 'Dashboard Overview',
      icon: <BarChart3 className='h-3 w-3' />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'data-table',
      title: 'Data Analysis',
      icon: <Target className='h-3 w-3' />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'charts',
      title: 'Visual Analytics',
      icon: <TrendingUp className='h-3 w-3' />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'heatmap',
      title: 'Hourly Patterns',
      icon: <Clock className='h-3 w-3' />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'insights',
      title: 'Performance Insights',
      icon: <Lightbulb className='h-3 w-3' />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  ];

  const getCompletionStatus = () => {
    let totalSteps = 0;
    let completedSteps = 0;

    sections.forEach((section) => {
      const sectionSteps = getStepsForSection(section.id);
      totalSteps += sectionSteps.length;
      completedSteps += sectionSteps.filter((step) =>
        isStepCompleted(step.id)
      ).length;
    });

    return {
      completed: completedSteps,
      total: totalSteps,
      percentage: totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    };
  };

  const getSectionStatus = (sectionId: string) => {
    const sectionSteps = getStepsForSection(sectionId);
    const completedCount = sectionSteps.filter((step) =>
      isStepCompleted(step.id)
    ).length;
    const courseProgress = getSectionProgress(sectionId);

    return {
      completed: completedCount,
      total: sectionSteps.length,
      percentage: courseProgress,
      isComplete: courseProgress >= 100
    };
  };

  const overallStatus = getCompletionStatus();
  const overallCourseProgress = getOverallProgress();
  const isFullyComplete = overallCourseProgress >= 100;

  if (loading) {
    return (
      <Button variant='outline' size='sm' disabled className={className}>
        <Circle className='h-4 w-4 animate-spin' />
        <span className='text-sm'>Loading...</span>
      </Button>
    );
  }

  if (overallStatus.total === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`flex items-center gap-2 ${className}`}
        >
          {isFullyComplete ? (
            <>
              <Award className='h-4 w-4 text-green-600' />
              <span className='font-medium text-green-600'>
                Training Complete
              </span>
            </>
          ) : (
            <>
              <div className='relative'>
                <Circle className='text-muted-foreground h-4 w-4' />
                <div
                  className='absolute inset-0 rounded-full border-2 border-blue-600'
                  style={{
                    clipPath: `polygon(0 0, ${overallCourseProgress}% 0, ${overallCourseProgress}% 100%, 0 100%)`
                  }}
                />
              </div>
              <span className='text-sm'>
                {Math.round(overallCourseProgress)}% Complete
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-80 p-4' side='bottom' align='end'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-4 w-4' />
              <h3 className='text-sm font-semibold'>Course Progress</h3>
            </div>
            {isFullyComplete && (
              <Badge className='bg-green-600 hover:bg-green-700'>
                <Award className='mr-1 h-3 w-3' />
                Complete
              </Badge>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>Overall Progress</span>
              <span className='font-medium'>
                {Math.round(overallCourseProgress)}%
              </span>
            </div>
            <Progress value={overallCourseProgress} className='h-2' />
            <div className='text-muted-foreground text-xs'>
              {courses.filter((c) => c.progress >= 100).length} of{' '}
              {sections.length} modules completed
            </div>
          </div>

          <div className='space-y-3'>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Module Progress
            </h4>
            {sections.map((section) => {
              const status = getSectionStatus(section.id);
              const courseData = courses.find(
                (c) => c.courseId === `physician-analytics-${section.id}`
              );

              return (
                <div key={section.id} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-1 items-center gap-2'>
                      <div
                        className={
                          status.isComplete ? 'text-green-600' : section.color
                        }
                      >
                        {status.isComplete ? (
                          <CheckCircle className='h-3 w-3' />
                        ) : (
                          section.icon
                        )}
                      </div>
                      <span className='truncate text-sm'>{section.title}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={status.isComplete ? 'default' : 'secondary'}
                        className={`text-xs ${status.isComplete ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        {Math.round(status.percentage)}%
                      </Badge>

                      {!status.isComplete && (
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

                  {courseData &&
                    courseData.currentStep &&
                    courseData.totalSteps && (
                      <div className='text-muted-foreground ml-5 text-xs'>
                        Step {courseData.currentStep} of {courseData.totalSteps}
                      </div>
                    )}
                </div>
              );
            })}
          </div>

          {!isFullyComplete && (
            <div className='border-t border-slate-200/50 pt-3 dark:border-slate-700/50'>
              <Button
                size='sm'
                onClick={() => {
                  // Find the first incomplete section
                  const incompleteSection = sections.find((section) => {
                    const status = getSectionStatus(section.id);
                    return !status.isComplete;
                  });
                  if (incompleteSection) {
                    startOnboarding(incompleteSection.id);
                  }
                }}
                className='flex w-full items-center gap-2 bg-blue-600 hover:bg-blue-700'
              >
                <Play className='h-3 w-3' />
                Continue Training
              </Button>
            </div>
          )}

          {isFullyComplete && (
            <div
              className={`rounded-lg border p-3 ${sections[0].bgColor} border-green-200 dark:border-green-700/50`}
            >
              <div className='flex items-start gap-2'>
                <Award className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <div className='text-xs'>
                  <p className='mb-1 font-medium text-green-800 dark:text-green-300'>
                    Congratulations!
                  </p>
                  <p className='leading-relaxed text-green-700 dark:text-green-400'>
                    You&apos;ve completed all training modules. Your progress
                    has been saved and you can access the course dashboard
                    anytime.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
