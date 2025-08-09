'use client';

import { useState } from 'react';
import { ProcessedPhysicianData, DischargeMetrics } from '@/types/discharge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Award,
  AlertCircle
} from 'lucide-react';

interface PerformanceInsightsProps {
  data: ProcessedPhysicianData[];
  metrics: DischargeMetrics;
}

export function PerformanceInsights({
  data,
  metrics
}: PerformanceInsightsProps) {
  // Performance categories
  const topPerformers = data
    .filter((phy) => phy.percentBeforeNoon >= 50)
    .sort((a, b) => b.percentBeforeNoon - a.percentBeforeNoon);

  const goodPerformers = data
    .filter((phy) => phy.percentBeforeNoon >= 40 && phy.percentBeforeNoon < 50)
    .sort((a, b) => b.percentBeforeNoon - a.percentBeforeNoon);

  const needsImprovement = data
    .filter((phy) => phy.percentBeforeNoon < 40)
    .sort((a, b) => a.percentBeforeNoon - b.percentBeforeNoon);

  // Calculate potential impact
  const potentialImpact = needsImprovement.reduce((sum, phy) => {
    const improvement = (40 - phy.percentBeforeNoon) / 100;
    return sum + phy.total * improvement;
  }, 0);

  // Best practices analysis
  const bestPractices = topPerformers.slice(0, 3).map((phy) => {
    const morningPeak =
      phy.discharges
        .slice(6, 12)
        .indexOf(Math.max(...phy.discharges.slice(6, 12))) + 6;
    return {
      ...phy,
      morningPeak,
      earlyStart: phy.discharges.slice(6, 9).reduce((a, b) => a + b, 0) > 0
    };
  });

  return (
    <div className='relative space-y-6'>
      {/* Executive Summary */}
      <Card
        className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'
        data-onboarding='executive-summary'
      >
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Performance Executive Summary
          </CardTitle>
          <CardDescription>
            Key insights and recommendations for optimizing physician discharge
            timing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='rounded-lg border border-green-200/50 bg-green-50/70 p-4 text-center backdrop-blur-sm dark:border-green-700/50 dark:bg-green-900/20'>
              <CheckCircle className='mx-auto mb-2 h-8 w-8 text-green-600' />
              <div className='text-2xl font-bold text-green-800 dark:text-green-300'>
                {topPerformers.length}
              </div>
              <div className='text-sm text-green-700 dark:text-green-400'>
                Excellent (50%+)
              </div>
            </div>

            <div className='rounded-lg border border-blue-200/50 bg-blue-50/70 p-4 text-center backdrop-blur-sm dark:border-blue-700/50 dark:bg-blue-900/20'>
              <Target className='mx-auto mb-2 h-8 w-8 text-blue-600' />
              <div className='text-2xl font-bold text-blue-800 dark:text-blue-300'>
                {goodPerformers.length}
              </div>
              <div className='text-sm text-blue-700 dark:text-blue-400'>
                Good (40-49%)
              </div>
            </div>

            <div className='rounded-lg border border-orange-200/50 bg-orange-50/70 p-4 text-center backdrop-blur-sm dark:border-orange-700/50 dark:bg-orange-900/20'>
              <AlertTriangle className='mx-auto mb-2 h-8 w-8 text-orange-600' />
              <div className='text-2xl font-bold text-orange-800 dark:text-orange-300'>
                {needsImprovement.length}
              </div>
              <div className='text-sm text-orange-700 dark:text-orange-400'>
                Needs Focus (&lt;40%)
              </div>
            </div>

            <div className='rounded-lg border border-purple-200/50 bg-purple-50/70 p-4 text-center backdrop-blur-sm dark:border-purple-700/50 dark:bg-purple-900/20'>
              <TrendingUp className='mx-auto mb-2 h-8 w-8 text-purple-600' />
              <div className='text-2xl font-bold text-purple-800 dark:text-purple-300'>
                {potentialImpact.toFixed(0)}
              </div>
              <div className='text-sm text-purple-700 dark:text-purple-400'>
                Potential Gain
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue='performance-tiers' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm dark:bg-slate-900/70'>
          <TabsTrigger
            value='performance-tiers'
            data-onboarding='performance-tiers'
          >
            Performance Tiers
          </TabsTrigger>
          <TabsTrigger value='best-practices' data-onboarding='best-practices'>
            Best Practices
          </TabsTrigger>
          <TabsTrigger
            value='improvement-plan'
            data-onboarding='improvement-plan'
          >
            Improvement Plan
          </TabsTrigger>
          <TabsTrigger
            value='recommendations'
            data-onboarding='recommendations'
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value='performance-tiers' className='space-y-4'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Top Performers */}
            <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-green-700 dark:text-green-400'>
                  <Award className='h-5 w-5' />
                  Excellence Tier (50%+)
                </CardTitle>
                <CardDescription>
                  Leading physicians in morning discharge optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {topPerformers.slice(0, 5).map((phy) => (
                    <div
                      key={phy.name}
                      className='flex items-center justify-between rounded-lg border border-green-200/50 bg-green-50/70 p-3 backdrop-blur-sm dark:border-green-700/50 dark:bg-green-900/20'
                    >
                      <div>
                        <div className='text-sm font-medium'>{phy.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {phy.total} discharges • Avg:{' '}
                          {Math.floor(phy.averageDischargeTime)}:
                          {Math.round((phy.averageDischargeTime % 1) * 60)
                            .toString()
                            .padStart(2, '0')}
                        </div>
                      </div>
                      <Badge
                        variant='default'
                        className='bg-green-600 hover:bg-green-700'
                      >
                        {phy.percentBeforeNoon.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                  {topPerformers.length === 0 && (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      No physicians currently in excellence tier
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Good Performers */}
            <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-blue-700 dark:text-blue-400'>
                  <Target className='h-5 w-5' />
                  Target Tier (40-49%)
                </CardTitle>
                <CardDescription>
                  Meeting minimum targets with room for growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {goodPerformers.slice(0, 5).map((phy) => (
                    <div
                      key={phy.name}
                      className='flex items-center justify-between rounded-lg border border-blue-200/50 bg-blue-50/70 p-3 backdrop-blur-sm dark:border-blue-700/50 dark:bg-blue-900/20'
                    >
                      <div>
                        <div className='text-sm font-medium'>{phy.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {phy.total} discharges • Avg:{' '}
                          {Math.floor(phy.averageDischargeTime)}:
                          {Math.round((phy.averageDischargeTime % 1) * 60)
                            .toString()
                            .padStart(2, '0')}
                        </div>
                      </div>
                      <Badge
                        variant='secondary'
                        className='bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                      >
                        {phy.percentBeforeNoon.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                  {goodPerformers.length === 0 && (
                    <p className='text-muted-foreground py-4 text-center text-sm'>
                      No physicians currently in target tier
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Needs Improvement */}
            <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-orange-700 dark:text-orange-400'>
                  <AlertCircle className='h-5 w-5' />
                  Focus Tier (&lt;40%)
                </CardTitle>
                <CardDescription>
                  Priority physicians for improvement initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {needsImprovement.slice(0, 5).map((phy) => (
                    <div
                      key={phy.name}
                      className='flex items-center justify-between rounded-lg border border-orange-200/50 bg-orange-50/70 p-3 backdrop-blur-sm dark:border-orange-700/50 dark:bg-orange-900/20'
                    >
                      <div>
                        <div className='text-sm font-medium'>{phy.name}</div>
                        <div className='text-muted-foreground text-xs'>
                          {phy.total} discharges • Gap:{' '}
                          {(40 - phy.percentBeforeNoon).toFixed(1)}%
                        </div>
                      </div>
                      <Badge variant='destructive'>
                        {phy.percentBeforeNoon.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='best-practices' className='space-y-4'>
          <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Lightbulb className='h-5 w-5 text-yellow-600' />
                Best Practice Analysis
              </CardTitle>
              <CardDescription>
                Learning from top performers to replicate success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div>
                  <h4 className='mb-4 font-semibold'>Top Performer Patterns</h4>
                  <div className='space-y-4'>
                    {bestPractices.map((phy) => (
                      <div
                        key={phy.name}
                        className='rounded-lg border border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50'
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span className='font-medium'>{phy.name}</span>
                          <Badge
                            variant='default'
                            className='bg-green-600 hover:bg-green-700'
                          >
                            {phy.percentBeforeNoon.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className='text-muted-foreground space-y-1 text-sm'>
                          <p>• Morning peak: {phy.morningPeak}:00</p>
                          <p>
                            •{' '}
                            {phy.earlyStart
                              ? 'Early starter (6-9 AM activity)'
                              : 'Standard morning pattern'}
                          </p>
                          <p>
                            • Average discharge:{' '}
                            {Math.floor(phy.averageDischargeTime)}:
                            {Math.round((phy.averageDischargeTime % 1) * 60)
                              .toString()
                              .padStart(2, '0')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='mb-4 font-semibold'>Success Factors</h4>
                  <div className='space-y-3'>
                    <div className='rounded-lg border border-green-200/50 bg-green-50/70 p-3 backdrop-blur-sm dark:border-green-700/50 dark:bg-green-900/20'>
                      <h5 className='font-medium text-green-800 dark:text-green-300'>
                        Early Morning Rounds
                      </h5>
                      <p className='text-sm text-green-700 dark:text-green-400'>
                        Top performers start discharge planning during 7-8 AM
                        rounds
                      </p>
                    </div>

                    <div className='rounded-lg border border-blue-200/50 bg-blue-50/70 p-3 backdrop-blur-sm dark:border-blue-700/50 dark:bg-blue-900/20'>
                      <h5 className='font-medium text-blue-800 dark:text-blue-300'>
                        Consistent Patterns
                      </h5>
                      <p className='text-sm text-blue-700 dark:text-blue-400'>
                        High performers maintain steady morning discharge rates
                      </p>
                    </div>

                    <div className='rounded-lg border border-purple-200/50 bg-purple-50/70 p-3 backdrop-blur-sm dark:border-purple-700/50 dark:bg-purple-900/20'>
                      <h5 className='font-medium text-purple-800 dark:text-purple-300'>
                        Team Coordination
                      </h5>
                      <p className='text-sm text-purple-700 dark:text-purple-400'>
                        Effective communication with nursing and support staff
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='improvement-plan' className='space-y-4'>
          <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Target className='h-5 w-5 text-blue-600' />
                Targeted Improvement Plan
              </CardTitle>
              <CardDescription>
                Specific action items for physicians needing support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='rounded-lg border border-red-200/50 bg-red-50/70 p-4 text-center backdrop-blur-sm dark:border-red-700/50 dark:bg-red-900/20'>
                    <AlertTriangle className='mx-auto mb-2 h-8 w-8 text-red-600' />
                    <div className='text-2xl font-bold text-red-800 dark:text-red-300'>
                      {
                        needsImprovement.filter((p) => p.percentBeforeNoon < 20)
                          .length
                      }
                    </div>
                    <div className='text-sm text-red-700 dark:text-red-400'>
                      Critical (&lt;20%)
                    </div>
                  </div>

                  <div className='rounded-lg border border-orange-200/50 bg-orange-50/70 p-4 text-center backdrop-blur-sm dark:border-orange-700/50 dark:bg-orange-900/20'>
                    <Clock className='mx-auto mb-2 h-8 w-8 text-orange-600' />
                    <div className='text-2xl font-bold text-orange-800 dark:text-orange-300'>
                      {
                        needsImprovement.filter(
                          (p) =>
                            p.percentBeforeNoon >= 20 &&
                            p.percentBeforeNoon < 30
                        ).length
                      }
                    </div>
                    <div className='text-sm text-orange-700 dark:text-orange-400'>
                      Moderate (20-29%)
                    </div>
                  </div>

                  <div className='rounded-lg border border-yellow-200/50 bg-yellow-50/70 p-4 text-center backdrop-blur-sm dark:border-yellow-700/50 dark:bg-yellow-900/20'>
                    <TrendingUp className='mx-auto mb-2 h-8 w-8 text-yellow-600' />
                    <div className='text-2xl font-bold text-yellow-800 dark:text-yellow-300'>
                      {
                        needsImprovement.filter(
                          (p) => p.percentBeforeNoon >= 30
                        ).length
                      }
                    </div>
                    <div className='text-sm text-yellow-700 dark:text-yellow-400'>
                      Close (30-39%)
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className='mb-4 font-semibold'>Priority Action Items</h4>
                  <div className='space-y-3'>
                    {needsImprovement.slice(0, 5).map((phy) => {
                      const gap = 40 - phy.percentBeforeNoon;
                      const potentialGain = (gap / 100) * phy.total;

                      return (
                        <div
                          key={phy.name}
                          className='rounded-lg border border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50'
                        >
                          <div className='mb-2 flex items-center justify-between'>
                            <span className='font-medium'>{phy.name}</span>
                            <div className='flex items-center gap-2'>
                              <Badge variant='destructive'>
                                {phy.percentBeforeNoon.toFixed(1)}%
                              </Badge>
                              <Badge
                                variant='outline'
                                className='bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                              >
                                +{potentialGain.toFixed(0)} potential
                              </Badge>
                            </div>
                          </div>
                          <Progress
                            value={phy.percentBeforeNoon}
                            className='mb-2'
                          />
                          <div className='text-muted-foreground text-sm'>
                            Gap to target: {gap.toFixed(1)}% • Current avg time:{' '}
                            {Math.floor(phy.averageDischargeTime)}:
                            {Math.round((phy.averageDischargeTime % 1) * 60)
                              .toString()
                              .padStart(2, '0')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='recommendations' className='space-y-4'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
              <CardHeader>
                <CardTitle className='text-orange-700 dark:text-orange-400'>
                  Immediate Actions (0-30 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='border-l-4 border-red-500 bg-red-50/70 p-3 backdrop-blur-sm dark:bg-red-900/20'>
                    <h5 className='font-medium text-red-800 dark:text-red-300'>
                      Critical Focus Group
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Meet with{' '}
                      {
                        needsImprovement.filter((p) => p.percentBeforeNoon < 20)
                          .length
                      }{' '}
                      physicians with &lt;20% morning rates for individual
                      coaching
                    </p>
                  </div>

                  <div className='border-l-4 border-orange-500 bg-orange-50/70 p-3 backdrop-blur-sm dark:bg-orange-900/20'>
                    <h5 className='font-medium text-orange-800 dark:text-orange-300'>
                      Morning Rounds Optimization
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Implement 7 AM discharge planning rounds for all
                      physicians
                    </p>
                  </div>

                  <div className='border-l-4 border-blue-500 bg-blue-50/70 p-3 backdrop-blur-sm dark:bg-blue-900/20'>
                    <h5 className='font-medium text-blue-800 dark:text-blue-300'>
                      Best Practice Sharing
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Organize peer learning sessions with top{' '}
                      {topPerformers.length} performers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
              <CardHeader>
                <CardTitle className='text-green-700 dark:text-green-400'>
                  Long-term Strategy (30-90 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='border-l-4 border-green-500 bg-green-50/70 p-3 backdrop-blur-sm dark:bg-green-900/20'>
                    <h5 className='font-medium text-green-800 dark:text-green-300'>
                      Performance Tracking
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Monthly scorecards with 40% morning discharge targets
                    </p>
                  </div>

                  <div className='border-l-4 border-purple-500 bg-purple-50/70 p-3 backdrop-blur-sm dark:bg-purple-900/20'>
                    <h5 className='font-medium text-purple-800 dark:text-purple-300'>
                      Workflow Standardization
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Implement discharge checklists and nursing coordination
                      protocols
                    </p>
                  </div>

                  <div className='border-l-4 border-teal-500 bg-teal-50/70 p-3 backdrop-blur-sm dark:bg-teal-900/20'>
                    <h5 className='font-medium text-teal-800 dark:text-teal-300'>
                      Recognition Program
                    </h5>
                    <p className='text-muted-foreground text-sm'>
                      Monthly recognition for physicians achieving 50%+ morning
                      rates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className='border-slate-200/50 bg-white/70 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/70'>
            <CardHeader>
              <CardTitle className='text-purple-700 dark:text-purple-400'>
                Expected Impact
              </CardTitle>
              <CardDescription>
                Projected improvements from implementing these recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                <div className='rounded-lg border border-green-200/50 bg-green-50/70 p-4 text-center backdrop-blur-sm dark:border-green-700/50 dark:bg-green-900/20'>
                  <div className='text-2xl font-bold text-green-800 dark:text-green-300'>
                    +{potentialImpact.toFixed(0)}
                  </div>
                  <div className='text-sm text-green-700 dark:text-green-400'>
                    Additional Morning Discharges
                  </div>
                </div>

                <div className='rounded-lg border border-blue-200/50 bg-blue-50/70 p-4 text-center backdrop-blur-sm dark:border-blue-700/50 dark:bg-blue-900/20'>
                  <div className='text-2xl font-bold text-blue-800 dark:text-blue-300'>
                    +
                    {(
                      (potentialImpact / metrics.totalDischarges) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className='text-sm text-blue-700 dark:text-blue-400'>
                    Overall Morning Rate Increase
                  </div>
                </div>

                <div className='rounded-lg border border-purple-200/50 bg-purple-50/70 p-4 text-center backdrop-blur-sm dark:border-purple-700/50 dark:bg-purple-900/20'>
                  <div className='text-2xl font-bold text-purple-800 dark:text-purple-300'>
                    {Math.ceil(needsImprovement.length * 0.7)}
                  </div>
                  <div className='text-sm text-purple-700 dark:text-purple-400'>
                    Physicians Expected to Improve
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
