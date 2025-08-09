'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOnboarding as useCourseAwareOnboarding } from './course-aware-onboarding-provider';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface OnboardingOverlayProps {
  className?: string;
}

export function OnboardingOverlay({}: OnboardingOverlayProps) {
  const {
    isActive,
    currentStep,
    currentSection,
    steps,
    stopOnboarding,
    nextStep,
    previousStep,
    getStepsForSection
  } = useCourseAwareOnboarding();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 });

  const currentStepData = steps[currentStep];
  const sectionSteps = getStepsForSection(currentSection);
  const currentStepInSection =
    sectionSteps.findIndex((step) => step.id === currentStepData?.id) + 1;

  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const findAndPositionTarget = () => {
      const element = document.querySelector(
        currentStepData.target
      ) as HTMLElement;
      if (element) {
        setTargetElement(element);

        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft =
          window.scrollX || document.documentElement.scrollLeft;

        const overlayWidth = 480;
        const overlayHeight = Math.min(window.innerHeight * 0.85, 500);
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 20;

        // Smart positioning to avoid overlaps
        let top = rect.top + scrollTop;
        let left = rect.left + scrollLeft;
        let finalPosition = currentStepData.position;

        // Calculate available space in each direction
        const spaceTop = rect.top;
        const spaceBottom = viewportHeight - rect.bottom;
        const spaceLeft = rect.left;
        const spaceRight = viewportWidth - rect.right;

        // Override position if there's not enough space or if it would overlap
        if (
          currentStepData.position === 'top' &&
          spaceTop < overlayHeight + margin
        ) {
          // Not enough space above, try right, left, or bottom
          if (spaceRight >= overlayWidth + margin) {
            finalPosition = 'right';
          } else if (spaceLeft >= overlayWidth + margin) {
            finalPosition = 'left';
          } else {
            finalPosition = 'bottom';
          }
        } else if (
          currentStepData.position === 'bottom' &&
          spaceBottom < overlayHeight + margin
        ) {
          // Not enough space below, try right, left, or top
          if (spaceRight >= overlayWidth + margin) {
            finalPosition = 'right';
          } else if (spaceLeft >= overlayWidth + margin) {
            finalPosition = 'left';
          } else {
            finalPosition = 'top';
          }
        } else if (
          currentStepData.position === 'right' &&
          spaceRight < overlayWidth + margin
        ) {
          // Not enough space to the right, try left, bottom, or top
          if (spaceLeft >= overlayWidth + margin) {
            finalPosition = 'left';
          } else if (spaceBottom >= overlayHeight + margin) {
            finalPosition = 'bottom';
          } else {
            finalPosition = 'top';
          }
        } else if (
          currentStepData.position === 'left' &&
          spaceLeft < overlayWidth + margin
        ) {
          // Not enough space to the left, try right, bottom, or top
          if (spaceRight >= overlayWidth + margin) {
            finalPosition = 'right';
          } else if (spaceBottom >= overlayHeight + margin) {
            finalPosition = 'bottom';
          } else {
            finalPosition = 'top';
          }
        }

        // Apply the final position
        switch (finalPosition) {
          case 'bottom':
            top = rect.bottom + scrollTop + margin;
            left = rect.left + scrollLeft + rect.width / 2 - overlayWidth / 2;
            break;
          case 'top':
            top = rect.top + scrollTop - overlayHeight - margin;
            left = rect.left + scrollLeft + rect.width / 2 - overlayWidth / 2;
            break;
          case 'right':
            top = rect.top + scrollTop + rect.height / 2 - overlayHeight / 2;
            left = rect.right + scrollLeft + margin;
            break;
          case 'left':
            top = rect.top + scrollTop + rect.height / 2 - overlayHeight / 2;
            left = rect.left + scrollLeft - overlayWidth - margin;
            break;
        }

        // Final viewport constraints
        left = Math.max(
          margin,
          Math.min(left, viewportWidth - overlayWidth - margin)
        );

        const minTop = scrollTop + margin;
        const maxTop = scrollTop + viewportHeight - overlayHeight - margin;

        if (maxTop < minTop) {
          // If there's really no space, position it in the center of viewport
          top = scrollTop + (viewportHeight - overlayHeight) / 2;
          left = (viewportWidth - overlayWidth) / 2;
        } else {
          top = Math.max(minTop, Math.min(top, maxTop));
        }

        setOverlayPosition({ top, left });

        // Scroll element into view with better positioning
        // First scroll the element into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        // Add a small delay to ensure scrolling is complete before positioning overlay
        setTimeout(() => {
          // Recalculate position after scroll
          const newRect = element.getBoundingClientRect();
          const newScrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const newScrollLeft =
            window.scrollX || document.documentElement.scrollLeft;

          // Update position based on new scroll position
          let newTop = newRect.top + newScrollTop;
          let newLeft = newRect.left + newScrollLeft;

          switch (finalPosition) {
            case 'bottom':
              newTop = newRect.bottom + newScrollTop + margin;
              newLeft =
                newRect.left +
                newScrollLeft +
                newRect.width / 2 -
                overlayWidth / 2;
              break;
            case 'top':
              newTop = newRect.top + newScrollTop - overlayHeight - margin;
              newLeft =
                newRect.left +
                newScrollLeft +
                newRect.width / 2 -
                overlayWidth / 2;
              break;
            case 'right':
              newTop =
                newRect.top +
                newScrollTop +
                newRect.height / 2 -
                overlayHeight / 2;
              newLeft = newRect.right + newScrollLeft + margin;
              break;
            case 'left':
              newTop =
                newRect.top +
                newScrollTop +
                newRect.height / 2 -
                overlayHeight / 2;
              newLeft = newRect.left + newScrollLeft - overlayWidth - margin;
              break;
          }

          // Apply final constraints
          newLeft = Math.max(
            margin,
            Math.min(newLeft, viewportWidth - overlayWidth - margin)
          );
          const newMinTop = newScrollTop + margin;
          const newMaxTop =
            newScrollTop + viewportHeight - overlayHeight - margin;

          if (newMaxTop < newMinTop) {
            newTop = newScrollTop + (viewportHeight - overlayHeight) / 2;
            newLeft = (viewportWidth - overlayWidth) / 2;
          } else {
            newTop = Math.max(newMinTop, Math.min(newTop, newMaxTop));
          }

          setOverlayPosition({ top: newTop, left: newLeft });
        }, 300);

        // Add enhanced highlight effect
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.boxShadow =
          '0 0 0 3px rgba(59, 130, 246, 0.6), 0 0 0 6px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
        element.style.borderRadius = '12px';
        element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'scale(1.02)';
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(findAndPositionTarget, 150);

    return () => {
      clearTimeout(timer);
      // Remove highlight effect
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        targetElement.style.transition = '';
        targetElement.style.transform = '';
      }
    };
  }, [isActive, currentStep, currentStepData, targetElement]);

  if (!isActive || !currentStepData) return null;

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'overview':
        return <BarChart3 className='h-4 w-4' />;
      case 'data-table':
        return <Target className='h-4 w-4' />;
      case 'charts':
        return <TrendingUp className='h-4 w-4' />;
      case 'heatmap':
        return <BarChart3 className='h-4 w-4' />;
      case 'insights':
        return <Lightbulb className='h-4 w-4' />;
      default:
        return <Circle className='h-4 w-4' />;
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'overview':
        return 'Dashboard Overview';
      case 'data-table':
        return 'Data Analysis';
      case 'charts':
        return 'Visual Analytics';
      case 'heatmap':
        return 'Hourly Patterns';
      case 'insights':
        return 'Performance Insights';
      default:
        return 'Analytics Tour';
    }
  };

  const progressPercentage = (currentStepInSection / sectionSteps.length) * 100;

  return (
    <>
      {/* Enhanced Backdrop */}
      <div className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm' />

      {/* Onboarding Card with proper sizing and scrolling */}
      <Card
        className='animate-in fade-in-0 zoom-in-95 hover:shadow-3xl fixed z-50 flex max-h-[85vh] w-[480px] flex-col border border-gray-300 bg-white shadow-2xl transition-all duration-300 dark:border-gray-600 dark:bg-slate-900'
        style={{
          top: overlayPosition.top,
          left: overlayPosition.left
        }}
      >
        <CardHeader className='flex-shrink-0 rounded-t-lg border-b border-gray-200 bg-gray-50 pb-3 dark:border-gray-700 dark:bg-gray-800/50'>
          <div className='flex items-center justify-between'>
            <div className='flex min-w-0 flex-1 items-center gap-2'>
              <div className='flex-shrink-0 rounded-full bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'>
                {getSectionIcon(currentSection)}
              </div>
              <div className='min-w-0 flex-1'>
                <CardTitle className='truncate text-sm font-semibold text-gray-900 dark:text-gray-100'>
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className='truncate text-xs text-gray-600 dark:text-gray-400'>
                  {getSectionTitle(currentSection)} • Step{' '}
                  {currentStepInSection} of {sectionSteps.length}
                </CardDescription>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={stopOnboarding}
              className='ml-2 h-6 w-6 flex-shrink-0 cursor-pointer p-0 text-gray-500 transition-all duration-200 hover:scale-110 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            >
              <X className='h-3 w-3' />
            </Button>
          </div>

          <div className='mt-2 flex items-center justify-between'>
            <Progress
              value={progressPercentage}
              className='mr-3 h-1.5 flex-1'
            />
            <span className='flex-shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400'>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </CardHeader>

        <div className='flex-1 overflow-y-auto'>
          <CardContent className='space-y-4 p-4'>
            {/* Main description with better typography */}
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300'>
              {currentStepData.description}
            </div>

            {/* Compact step completion indicators */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                  Section Progress
                </span>
                <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                  {currentStepInSection} of {sectionSteps.length}
                </span>
              </div>
              <div className='flex flex-wrap gap-1'>
                {sectionSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
                      index < currentStepInSection - 1
                        ? 'bg-green-500 text-white'
                        : index === currentStepInSection - 1
                          ? 'bg-blue-500 text-white ring-1 ring-blue-300 dark:ring-blue-600'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {index < currentStepInSection - 1 ? (
                      <CheckCircle className='h-3 w-3' />
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compact contextual insights */}
            {currentStepData.section === 'overview' &&
              currentStepData.id === 'welcome' && (
                <div className='rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 dark:border-blue-700 dark:from-blue-950/50 dark:to-indigo-950/50'>
                  <div className='flex items-start gap-2'>
                    <div className='flex-shrink-0 rounded-full bg-blue-100 p-1 dark:bg-blue-900/50'>
                      <Lightbulb className='h-3 w-3 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='text-xs'>
                      <div className='mb-1 font-semibold text-blue-800 dark:text-blue-200'>
                        Why This Matters
                      </div>
                      <p className='leading-relaxed text-blue-700 dark:text-blue-300'>
                        Optimizing morning discharges can reduce patient wait
                        times by up to 30% and improve bed turnover efficiency.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {currentStepData.section === 'insights' && (
              <div className='rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 dark:border-green-700 dark:from-green-950/50 dark:to-emerald-950/50'>
                <div className='flex items-start gap-2'>
                  <div className='flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/50'>
                    <Target className='h-3 w-3 text-green-600 dark:text-green-400' />
                  </div>
                  <div className='text-xs'>
                    <div className='mb-1 font-semibold text-green-800 dark:text-green-200'>
                      Strategic Impact
                    </div>
                    <p className='leading-relaxed text-green-700 dark:text-green-300'>
                      These insights enable data-driven decisions for process
                      improvement and resource allocation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStepData.section === 'data-table' && (
              <div className='rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-3 dark:border-purple-700 dark:from-purple-950/50 dark:to-violet-950/50'>
                <div className='flex items-start gap-2'>
                  <div className='flex-shrink-0 rounded-full bg-purple-100 p-1 dark:bg-purple-900/50'>
                    <BarChart3 className='h-3 w-3 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div className='text-xs'>
                    <div className='mb-1 font-semibold text-purple-800 dark:text-purple-200'>
                      Data Analysis Tips
                    </div>
                    <p className='leading-relaxed text-purple-700 dark:text-purple-300'>
                      Use filters and sorting to identify patterns and
                      opportunities for targeted interventions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStepData.section === 'charts' && (
              <div className='rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-3 dark:border-orange-700 dark:from-orange-950/50 dark:to-amber-950/50'>
                <div className='flex items-start gap-2'>
                  <div className='flex-shrink-0 rounded-full bg-orange-100 p-1 dark:bg-orange-900/50'>
                    <TrendingUp className='h-3 w-3 text-orange-600 dark:text-orange-400' />
                  </div>
                  <div className='text-xs'>
                    <div className='mb-1 font-semibold text-orange-800 dark:text-orange-200'>
                      Visual Insights
                    </div>
                    <p className='leading-relaxed text-orange-700 dark:text-orange-300'>
                      Charts reveal trends and correlations that might not be
                      obvious in raw data tables.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        {/* Fixed navigation footer */}
        <div className='flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {currentStepInSection > 1 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={previousStep}
                  className='flex h-8 cursor-pointer items-center gap-1 border-gray-300 px-3 text-xs transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
                >
                  <ChevronLeft className='h-3 w-3' />
                  Previous
                </Button>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={stopOnboarding}
                className='h-8 cursor-pointer px-3 text-xs text-gray-500 transition-all duration-200 hover:scale-105 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              >
                Skip Tour
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              {currentStepInSection < sectionSteps.length ? (
                <Button
                  size='sm'
                  onClick={nextStep}
                  className='flex h-8 cursor-pointer items-center gap-1 bg-blue-600 px-4 text-xs text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg'
                >
                  Continue
                  <ChevronRight className='h-3 w-3' />
                </Button>
              ) : (
                <Button
                  size='sm'
                  onClick={stopOnboarding}
                  className='flex h-8 cursor-pointer items-center gap-1 bg-green-600 px-4 text-xs text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-green-700 hover:shadow-lg'
                >
                  <CheckCircle className='h-3 w-3' />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
