'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Search
} from 'lucide-react';

interface QuickReferenceProps {
  className?: string;
}

export function QuickReference({ className = '' }: QuickReferenceProps) {
  const [isOpen, setIsOpen] = useState(false);

  const keyMetrics = [
    {
      metric: 'Morning Discharge Rate',
      definition: 'Percentage of discharges completed before 12:00 PM',
      target: '40%+ (Excellence: 60%+)',
      importance: 'Critical for bed turnover and patient flow optimization',
      icon: <Target className='h-4 w-4 text-blue-600' />
    },
    {
      metric: 'Optimal Window',
      definition: 'Preferred discharge timeframe for maximum efficiency',
      target: '8:00 AM - 12:00 PM',
      importance: 'Maximizes bed availability for new admissions',
      icon: <Clock className='h-4 w-4 text-green-600' />
    },
    {
      metric: 'Performance Tiers',
      definition: 'Classification system based on morning discharge rates',
      target: 'Excellence (50%+), Target (40-49%), Focus (<40%)',
      importance:
        'Helps prioritize improvement efforts and resource allocation',
      icon: <BarChart3 className='h-4 w-4 text-purple-600' />
    },
    {
      metric: 'Peak Hour',
      definition: 'Hour with highest discharge volume for each physician',
      target: 'Ideally between 8:00 AM - 12:00 PM',
      importance: 'Indicates discharge timing patterns and workflow efficiency',
      icon: <TrendingUp className='h-4 w-4 text-orange-600' />
    }
  ];

  const navigationGuide = [
    {
      section: 'Data Analysis',
      description:
        'Detailed physician data with sorting and filtering capabilities',
      features: [
        'Search physicians by name',
        'Sort by multiple metrics',
        'Performance indicators',
        'Progress visualization'
      ],
      icon: <Target className='h-4 w-4' />
    },
    {
      section: 'Visual Analytics',
      description: 'Interactive charts and performance visualizations',
      features: [
        'Top performer rankings',
        'Hourly distribution patterns',
        'Volume vs performance analysis',
        'Trend comparisons'
      ],
      icon: <TrendingUp className='h-4 w-4' />
    },
    {
      section: 'Hourly Patterns',
      description: '24-hour heatmap showing discharge patterns',
      features: [
        'Individual physician patterns',
        'Optimal window highlighting',
        'Interactive tooltips',
        'Hospital-wide summaries'
      ],
      icon: <Clock className='h-4 w-4' />
    },
    {
      section: 'Performance Insights',
      description: 'Strategic analysis and improvement recommendations',
      features: [
        'Performance tier analysis',
        'Best practice identification',
        'Improvement planning',
        'Impact projections'
      ],
      icon: <Lightbulb className='h-4 w-4' />
    }
  ];

  const commonTasks = [
    {
      task: 'Find Top Performers',
      steps: [
        'Go to Data Analysis tab',
        'Sort by "Morning Rate"',
        'Look for physicians with 50%+ rates'
      ],
      icon: <CheckCircle className='h-4 w-4 text-green-600' />
    },
    {
      task: 'Identify Improvement Opportunities',
      steps: [
        'Navigate to Performance Insights',
        'Check Focus Tier (<40%)',
        'Review improvement recommendations'
      ],
      icon: <AlertCircle className='h-4 w-4 text-orange-600' />
    },
    {
      task: 'Analyze Discharge Patterns',
      steps: [
        'Open Hourly Patterns tab',
        'Examine heatmap colors',
        'Focus on 8 AM - 12 PM window'
      ],
      icon: <BarChart3 className='h-4 w-4 text-blue-600' />
    },
    {
      task: 'Filter Specific Physicians',
      steps: [
        'Use search box in Data Analysis',
        'Apply performance filters',
        'Sort by relevant metrics'
      ],
      icon: <Search className='h-4 w-4 text-purple-600' />
    }
  ];

  const bestPractices = [
    {
      category: 'Morning Discharge Optimization',
      practices: [
        'Start discharge planning during 7-8 AM rounds',
        'Complete medication reconciliation by 9 AM',
        'Coordinate with nursing staff early in the shift',
        'Prepare discharge paperwork the evening before'
      ]
    },
    {
      category: 'Team Coordination',
      practices: [
        'Establish clear communication protocols',
        'Use standardized discharge checklists',
        'Hold brief morning huddles for discharge planning',
        'Coordinate transportation arrangements early'
      ]
    },
    {
      category: 'Performance Monitoring',
      practices: [
        'Review monthly performance scorecards',
        'Track progress against 40% target',
        'Celebrate improvements and successes',
        'Share best practices across departments'
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`flex items-center gap-2 ${className}`}
        >
          <BookOpen className='h-4 w-4' />
          Quick Reference
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Physician Analytics Quick Reference Guide
          </DialogTitle>
          <DialogDescription>
            Comprehensive reference for hospital administrators and data
            analysts
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='metrics' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='metrics'>Key Metrics</TabsTrigger>
            <TabsTrigger value='navigation'>Navigation</TabsTrigger>
            <TabsTrigger value='tasks'>Common Tasks</TabsTrigger>
            <TabsTrigger value='practices'>Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value='metrics' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Key Performance Metrics
                </CardTitle>
                <CardDescription>
                  Essential metrics for hospital discharge optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {keyMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className='space-y-3 rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-2'>
                        {metric.icon}
                        <h3 className='font-semibold'>{metric.metric}</h3>
                      </div>
                      <div className='space-y-2 text-sm'>
                        <div>
                          <span className='font-medium'>Definition:</span>
                          <p className='text-muted-foreground'>
                            {metric.definition}
                          </p>
                        </div>
                        <div>
                          <span className='font-medium'>Target:</span>
                          <Badge variant='outline' className='ml-2'>
                            {metric.target}
                          </Badge>
                        </div>
                        <div>
                          <span className='font-medium'>Importance:</span>
                          <p className='text-muted-foreground'>
                            {metric.importance}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='navigation' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Platform Navigation Guide
                </CardTitle>
                <CardDescription>
                  Overview of each section and its key features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {navigationGuide.map((section, index) => (
                    <div key={index} className='rounded-lg border p-4'>
                      <div className='mb-3 flex items-center gap-2'>
                        {section.icon}
                        <h3 className='font-semibold'>{section.section}</h3>
                      </div>
                      <p className='text-muted-foreground mb-3 text-sm'>
                        {section.description}
                      </p>
                      <div className='grid grid-cols-2 gap-2'>
                        {section.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className='flex items-center gap-2 text-sm'
                          >
                            <ArrowRight className='h-3 w-3 text-blue-600' />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='tasks' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Common Tasks & Workflows
                </CardTitle>
                <CardDescription>
                  Step-by-step guides for frequent platform operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {commonTasks.map((task, index) => (
                    <div
                      key={index}
                      className='space-y-3 rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-2'>
                        {task.icon}
                        <h3 className='font-semibold'>{task.task}</h3>
                      </div>
                      <div className='space-y-2'>
                        {task.steps.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className='flex items-start gap-2 text-sm'
                          >
                            <Badge
                              variant='outline'
                              className='flex h-5 min-w-[20px] items-center justify-center text-xs'
                            >
                              {stepIndex + 1}
                            </Badge>
                            <span className='text-muted-foreground'>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='practices' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  Hospital Best Practices
                </CardTitle>
                <CardDescription>
                  Evidence-based recommendations for discharge optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {bestPractices.map((category, index) => (
                    <div key={index}>
                      <h3 className='mb-3 flex items-center gap-2 font-semibold'>
                        <Users className='h-4 w-4 text-blue-600' />
                        {category.category}
                      </h3>
                      <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                        {category.practices.map((practice, practiceIndex) => (
                          <div
                            key={practiceIndex}
                            className='flex items-start gap-2 rounded bg-slate-50 p-2 text-sm dark:bg-slate-800/50'
                          >
                            <CheckCircle className='mt-0.5 h-3 w-3 flex-shrink-0 text-green-600' />
                            <span>{practice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className='flex items-center justify-between border-t pt-4'>
          <div className='text-muted-foreground text-sm'>
            Need more help? Use the interactive tours or contextual help icons
            throughout the platform.
          </div>
          <Button variant='outline' size='sm' onClick={() => setIsOpen(false)}>
            Close Reference
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
