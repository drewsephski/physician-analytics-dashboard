'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOnboarding as useCourseAwareOnboarding } from './course-aware-onboarding-provider';
import {
  X,
  Play,
  Target,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Hospital
} from 'lucide-react';

interface WelcomeModalProps {
  onClose?: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { startOnboarding } = useCourseAwareOnboarding();

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem(
      'physician-analytics-welcome-seen'
    );
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('physician-analytics-welcome-seen', 'true');
    setIsVisible(false);
    onClose?.();
  };

  const handleStartTour = (section?: string) => {
    handleClose();
    startOnboarding(section);
  };

  if (!isVisible) return null;

  const features = [
    {
      icon: <BarChart3 className='h-5 w-5' />,
      title: 'Comprehensive Analytics',
      description:
        'Advanced data visualization and performance metrics for discharge optimization',
      color:
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300'
    },
    {
      icon: <Target className='h-5 w-5' />,
      title: 'Performance Tracking',
      description:
        'Monitor physician performance against 40% morning discharge targets',
      color:
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-300'
    },
    {
      icon: <TrendingUp className='h-5 w-5' />,
      title: 'Trend Analysis',
      description:
        'Identify patterns and optimization opportunities across 24-hour periods',
      color:
        'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300'
    },
    {
      icon: <Lightbulb className='h-5 w-5' />,
      title: 'Strategic Insights',
      description:
        'Evidence-based recommendations for process improvement and resource allocation',
      color:
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50 text-yellow-700 dark:text-yellow-300'
    }
  ];

  const quickStartOptions = [
    {
      id: 'overview',
      title: 'Complete Tour',
      description: 'Full walkthrough of all features and capabilities',
      icon: <Play className='h-4 w-4' />,
      duration: '10-12 minutes',
      recommended: true
    },
    {
      id: 'insights',
      title: 'Executive Summary',
      description: 'High-level overview for hospital administrators',
      icon: <Target className='h-4 w-4' />,
      duration: '3-4 minutes',
      recommended: false
    },
    {
      id: 'charts',
      title: 'Visual Analytics',
      description: 'Focus on charts and data visualization features',
      icon: <TrendingUp className='h-4 w-4' />,
      duration: '4-5 minutes',
      recommended: false
    }
  ];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
      <Card className='animate-in fade-in-0 zoom-in-95 max-h-[90vh] w-full max-w-4xl overflow-y-auto border-2 border-blue-300 bg-white shadow-2xl duration-300 dark:border-blue-600 dark:bg-slate-900'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-3 text-white shadow-lg'>
                <Hospital className='h-6 w-6' />
              </div>
              <div>
                <CardTitle className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent'>
                  Welcome to Physician Analytics
                </CardTitle>
                <CardDescription className='text-base'>
                  Enterprise visual data analytics platform for hospital
                  discharge optimization
                </CardDescription>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClose}
              className='h-8 w-8 p-0'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Platform Overview */}
          <div className='rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50/70 to-purple-50/70 p-6 dark:border-blue-700/50 dark:from-blue-900/20 dark:to-purple-900/20'>
            <div className='flex items-start gap-3'>
              <Users className='mt-1 h-6 w-6 flex-shrink-0 text-blue-600' />
              <div>
                <h3 className='mb-2 text-lg font-semibold text-blue-800 dark:text-blue-300'>
                  Built for Hospital Administrators & Data Analysts
                </h3>
                <p className='leading-relaxed text-blue-700 dark:text-blue-400'>
                  This platform provides comprehensive insights into physician
                  discharge patterns, helping you optimize patient flow, reduce
                  wait times, and improve overall hospital efficiency. Our
                  analytics focus on the critical 8 AM - 12 PM discharge window
                  to maximize bed turnover and enhance patient satisfaction.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>
              Key Platform Features
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 transition-all hover:shadow-md ${feature.color}`}
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0'>{feature.icon}</div>
                    <div>
                      <h4 className='mb-1 font-medium'>{feature.title}</h4>
                      <p className='text-sm leading-relaxed opacity-90'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Options */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>
              Choose Your Learning Path
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {quickStartOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                    option.recommended
                      ? 'border-green-200 bg-green-50/70 dark:border-green-700/50 dark:bg-green-900/20'
                      : 'border-slate-200 bg-white/70 dark:border-slate-700/50 dark:bg-slate-800/70'
                  }`}
                  onClick={() => handleStartTour(option.id)}
                >
                  {option.recommended && (
                    <Badge className='mb-2 bg-green-600 hover:bg-green-700'>
                      Recommended
                    </Badge>
                  )}
                  <div className='flex items-start gap-3'>
                    <div
                      className={`rounded-full p-2 ${
                        option.recommended
                          ? 'bg-green-100 text-green-600 dark:bg-green-800/30'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-800/30'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className='flex-1'>
                      <h4 className='mb-1 font-medium'>{option.title}</h4>
                      <p className='text-muted-foreground mb-2 text-sm leading-relaxed'>
                        {option.description}
                      </p>
                      <div className='flex items-center justify-between'>
                        <Badge variant='outline' className='text-xs'>
                          <Clock className='mr-1 h-3 w-3' />
                          {option.duration}
                        </Badge>
                        <ArrowRight className='text-muted-foreground h-4 w-4' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Impact */}
          <div className='rounded-lg border border-green-200/50 bg-gradient-to-r from-green-50/70 to-teal-50/70 p-6 dark:border-green-700/50 dark:from-green-900/20 dark:to-teal-900/20'>
            <div className='flex items-start gap-3'>
              <CheckCircle className='mt-1 h-6 w-6 flex-shrink-0 text-green-600' />
              <div>
                <h3 className='mb-2 text-lg font-semibold text-green-800 dark:text-green-300'>
                  Expected Hospital Impact
                </h3>
                <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
                  <div>
                    <div className='font-medium text-green-700 dark:text-green-400'>
                      Improved Patient Flow
                    </div>
                    <div className='text-green-600 dark:text-green-500'>
                      Reduce afternoon bottlenecks by 25-40%
                    </div>
                  </div>
                  <div>
                    <div className='font-medium text-green-700 dark:text-green-400'>
                      Enhanced Bed Utilization
                    </div>
                    <div className='text-green-600 dark:text-green-500'>
                      Increase morning bed availability
                    </div>
                  </div>
                  <div>
                    <div className='font-medium text-green-700 dark:text-green-400'>
                      Data-Driven Decisions
                    </div>
                    <div className='text-green-600 dark:text-green-500'>
                      Evidence-based process improvements
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between border-t border-slate-200/50 pt-4 dark:border-slate-700/50'>
            <Button
              variant='outline'
              onClick={handleClose}
              className='flex items-center gap-2'
            >
              Skip for Now
            </Button>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => handleStartTour('insights')}
                className='flex items-center gap-2'
              >
                <Target className='h-4 w-4' />
                Executive Summary
              </Button>
              <Button
                onClick={() => handleStartTour('overview')}
                className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
              >
                <Play className='h-4 w-4' />
                Start Complete Tour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
