'use client';

import { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, RotateCcw } from 'lucide-react';
import { useCourseProgress } from '@/hooks/use-course-progress';

interface CourseProgressProps {
  courseId: string;
  courseName: string;
  totalSteps?: number;
  currentStep?: number;
  autoSave?: boolean;
  className?: string;
}

export function CourseProgress({
  courseId,
  courseName,
  totalSteps = 1,
  currentStep = 0,
  autoSave = true,
  className = ''
}: CourseProgressProps) {
  const { getCourseProgress, updateCourseProgress, deleteCourse, loading } =
    useCourseProgress();

  const courseProgress = getCourseProgress(courseId);
  const progress = courseProgress?.progress || 0;
  const isCompleted = progress >= 100;

  // Auto-save progress when currentStep changes
  useEffect(() => {
    if (autoSave && currentStep > 0) {
      const newProgress = Math.round((currentStep / totalSteps) * 100);
      updateCourseProgress(courseId, newProgress, currentStep, totalSteps);
    }
  }, [courseId, currentStep, totalSteps, autoSave, updateCourseProgress]);

  const handleMarkComplete = async () => {
    await updateCourseProgress(courseId, 100, totalSteps, totalSteps);
  };

  const handleReset = async () => {
    await deleteCourse(courseId);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className='mb-2 h-4 rounded bg-gray-200'></div>
        <div className='h-2 rounded bg-gray-200'></div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium'>{courseName}</h3>
        <div className='flex items-center gap-2'>
          {isCompleted ? (
            <Badge variant='default' className='bg-green-100 text-green-800'>
              <CheckCircle className='mr-1 h-3 w-3' />
              Completed
            </Badge>
          ) : (
            <Badge variant='secondary'>
              <Clock className='mr-1 h-3 w-3' />
              In Progress
            </Badge>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <div className='text-muted-foreground flex justify-between text-xs'>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className='h-2' />
        {totalSteps > 1 && (
          <div className='text-muted-foreground text-xs'>
            Step{' '}
            {Math.min(
              currentStep || courseProgress?.currentStep || 0,
              totalSteps
            )}{' '}
            of {totalSteps}
          </div>
        )}
      </div>

      <div className='flex gap-2'>
        {!isCompleted && (
          <Button
            size='sm'
            variant='outline'
            onClick={handleMarkComplete}
            className='text-xs'
          >
            Mark Complete
          </Button>
        )}
        {courseProgress && (
          <Button
            size='sm'
            variant='ghost'
            onClick={handleReset}
            className='text-muted-foreground text-xs'
          >
            <RotateCcw className='mr-1 h-3 w-3' />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
