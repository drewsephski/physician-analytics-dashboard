'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { CourseProgress } from '@/components/course-progress';

const COURSE_DEFINITIONS = [
  {
    id: 'physician-analytics-overview',
    name: 'Dashboard Overview',
    description: 'Learn the basics of navigating your analytics dashboard',
    category: 'Getting Started'
  },
  {
    id: 'physician-analytics-data-table',
    name: 'Data Analysis',
    description: 'Master the physician data table and filtering tools',
    category: 'Data Analysis'
  },
  {
    id: 'physician-analytics-charts',
    name: 'Visual Analytics',
    description: 'Understand charts and performance visualizations',
    category: 'Data Analysis'
  },
  {
    id: 'physician-analytics-heatmap',
    name: 'Hourly Patterns',
    description: 'Explore discharge timing patterns with heat maps',
    category: 'Advanced Analytics'
  },
  {
    id: 'physician-analytics-insights',
    name: 'Performance Insights',
    description: 'Generate actionable insights and recommendations',
    category: 'Strategic Planning'
  }
];

export function CourseDashboard() {
  const { courses, loading, deleteCourse } = useCourseProgress();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-16 rounded bg-gray-200'></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCourses = courses.filter((c) => c.progress >= 100);
  const inProgressCourses = courses.filter(
    (c) => c.progress > 0 && c.progress < 100
  );
  const overallProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
        )
      : 0;

  return (
    <div className='space-y-6'>
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Trophy className='h-5 w-5' />
            Overall Learning Progress
          </CardTitle>
          <CardDescription>
            Your journey through the physician analytics platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex justify-between text-sm'>
              <span>Total Progress</span>
              <span className='font-medium'>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className='h-3' />
            <div className='text-muted-foreground flex justify-between text-sm'>
              <span>{completedCourses.length} completed</span>
              <span>{inProgressCourses.length} in progress</span>
              <span>
                {COURSE_DEFINITIONS.length - courses.length} not started
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Course Progress
          </CardTitle>
          <CardDescription>
            Track your progress through each learning module
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {COURSE_DEFINITIONS.map((courseDef) => {
              const courseProgress = courses.find(
                (c) => c.courseId === courseDef.id
              );
              const progress = courseProgress?.progress || 0;
              const isCompleted = progress >= 100;
              const isInProgress = progress > 0 && progress < 100;

              return (
                <div
                  key={courseDef.id}
                  className='space-y-3 rounded-lg border p-4'
                >
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1'>
                      <h3 className='font-medium'>{courseDef.name}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {courseDef.description}
                      </p>
                      <Badge variant='outline' className='text-xs'>
                        {courseDef.category}
                      </Badge>
                    </div>
                    <div className='flex items-center gap-2'>
                      {isCompleted ? (
                        <Badge
                          variant='default'
                          className='bg-green-100 text-green-800'
                        >
                          <CheckCircle className='mr-1 h-3 w-3' />
                          Completed
                        </Badge>
                      ) : isInProgress ? (
                        <Badge variant='secondary'>
                          <Clock className='mr-1 h-3 w-3' />
                          In Progress
                        </Badge>
                      ) : (
                        <Badge variant='outline'>Not Started</Badge>
                      )}
                    </div>
                  </div>

                  {courseProgress && (
                    <>
                      <div className='space-y-2'>
                        <div className='text-muted-foreground flex justify-between text-xs'>
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className='h-2' />
                        {courseProgress.currentStep &&
                          courseProgress.totalSteps && (
                            <div className='text-muted-foreground text-xs'>
                              Step {courseProgress.currentStep} of{' '}
                              {courseProgress.totalSteps}
                            </div>
                          )}
                      </div>

                      <div className='flex justify-end'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => deleteCourse(courseDef.id)}
                          className='text-muted-foreground text-xs'
                        >
                          <RotateCcw className='mr-1 h-3 w-3' />
                          Reset
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
