'use client';

import { useState, useMemo } from 'react';
import { physicianData } from '@/data/physician-data';
import {
  processPhysicianData,
  calculateOverallMetrics
} from '@/lib/discharge-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PhysicianDataTable } from './physician-data-table';
import { ComprehensiveCharts } from './comprehensive-charts';
import { PerformanceInsights } from './performance-insights';
import { HourlyHeatmap } from './hourly-heatmap';
import {
  CourseAwareOnboardingProvider,
  OnboardingOverlay,
  OnboardingControls,
  HospitalTooltips,
  WelcomeModal,
  HospitalContextualHelp,
  CourseProgressIndicator,
  QuickReference
} from './onboarding';
import {
  Search,
  Download,
  TrendingUp,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

export function PhysicianAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('morningRate');
  const [filterBy, setFilterBy] = useState('all');

  const processedData = useMemo(() => processPhysicianData(physicianData), []);
  const metrics = useMemo(
    () => calculateOverallMetrics(processedData),
    [processedData]
  );

  const filteredData = useMemo(() => {
    let filtered = processedData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((phy) =>
        phy.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Performance filter
    const avgMorningRate =
      processedData.reduce((sum, phy) => sum + phy.percentBeforeNoon, 0) /
      processedData.length;
    if (filterBy === 'high-performers') {
      filtered = filtered.filter(
        (phy) => phy.percentBeforeNoon > avgMorningRate
      );
    } else if (filterBy === 'needs-improvement') {
      filtered = filtered.filter(
        (phy) => phy.percentBeforeNoon < avgMorningRate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'morningRate':
          return b.percentBeforeNoon - a.percentBeforeNoon;
        case 'totalDischarges':
          return b.total - a.total;
        case 'avgTime':
          return a.averageDischargeTime - b.averageDischargeTime;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [processedData, searchTerm, sortBy, filterBy]);

  const summaryStats = useMemo(() => {
    const earlyDischarges = metrics.hourlyTotals
      .slice(6, 12)
      .reduce((a, b) => a + b, 0);
    const earlyDischargeRate =
      metrics.totalDischarges > 0
        ? (earlyDischarges / metrics.totalDischarges) * 100
        : 0;

    return {
      totalPhysicians: processedData.length,
      totalDischarges: metrics.totalDischarges,
      avgMorningRate: metrics.percentBeforeNoon,
      earlyDischargeRate,
      avgDischargeTime: metrics.avgDischargeTime,
      peakHour: metrics.peakHour
    };
  }, [processedData, metrics]);

  return (
    <CourseAwareOnboardingProvider>
      <div className='space-y-6'>
        <WelcomeModal />
        <OnboardingOverlay />

        {/* Header */}
        <div className='flex flex-col space-y-6'>
          <div className='space-y-4 text-center' data-onboarding='main-header'>
            <div className='flex items-center justify-center gap-3'>
              <div className='rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-3 text-white shadow-lg'>
                <BarChart3 className='h-8 w-8' />
              </div>
              <div>
                <h1 className='bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent'>
                  Physician Discharge Analytics
                </h1>
                <p className='text-muted-foreground mt-2 text-lg'>
                  Enterprise visual data analytics platform for hospital
                  discharge optimization
                </p>
              </div>
            </div>
          </div>

          {/* Onboarding Controls */}
          <OnboardingControls />

          {/* Summary Stats Cards */}
          <div
            className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
            data-onboarding='summary-stats'
          >
            <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:shadow-lg dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    Total Physicians
                  </CardTitle>
                  {HospitalTooltips.DischargeVolume}
                </div>
                <BarChart3 className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-blue-800 dark:text-blue-200'>
                  {summaryStats.totalPhysicians}
                </div>
                <p className='text-xs text-blue-600 dark:text-blue-400'>
                  {summaryStats.totalDischarges.toLocaleString()} total
                  discharges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm font-medium'>
                    Avg Morning Rate
                  </CardTitle>
                  <HospitalContextualHelp.MorningDischarge />
                </div>
                <Target className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {summaryStats.avgMorningRate.toFixed(1)}%
                </div>
                <p className='text-muted-foreground text-xs'>
                  Target: 40%+ before noon
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm font-medium'>
                    Early Discharge Rate
                  </CardTitle>
                  <HospitalContextualHelp.OptimalWindow />
                </div>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {summaryStats.earlyDischargeRate.toFixed(1)}%
                </div>
                <p className='text-muted-foreground text-xs'>
                  6 AM - 12 PM optimal window
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-sm font-medium'>
                    Peak Hour
                  </CardTitle>
                  {HospitalTooltips.AverageDischargeTime}
                </div>
                <Clock className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {summaryStats.peakHour}:00
                </div>
                <p className='text-muted-foreground text-xs'>
                  {metrics.hourlyTotals[summaryStats.peakHour]} discharges
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='data-table' className='space-y-4'>
          <div className='flex items-center justify-between'>
            <TabsList data-onboarding='main-tabs'>
              <TabsTrigger value='data-table'>Data Analysis</TabsTrigger>
              <TabsTrigger value='charts'>Visual Analytics</TabsTrigger>
              <TabsTrigger value='heatmap'>Hourly Patterns</TabsTrigger>
              <TabsTrigger value='insights'>Performance Insights</TabsTrigger>
            </TabsList>

            <div className='flex items-center space-x-2'>
              <QuickReference />
              <CourseProgressIndicator />
              <Button variant='outline' size='sm'>
                <Download className='mr-2 h-4 w-4' />
                Export Data
              </Button>
            </div>
          </div>

          <TabsContent value='data-table' className='space-y-4'>
            {/* Filters and Search */}
            <Card data-onboarding='data-filters'>
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <CardTitle>Data Filters & Search</CardTitle>
                  <HospitalContextualHelp.PerformanceTiers />
                </div>
                <CardDescription>
                  Filter and search through physician discharge data to find
                  specific insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <div className='flex-1'>
                    <div className='relative'>
                      <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                      <Input
                        placeholder='Search physicians...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-8'
                      />
                    </div>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='morningRate'>Morning Rate</SelectItem>
                      <SelectItem value='totalDischarges'>
                        Total Discharges
                      </SelectItem>
                      <SelectItem value='avgTime'>Avg Time</SelectItem>
                      <SelectItem value='name'>Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Filter by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Physicians</SelectItem>
                      <SelectItem value='high-performers'>
                        High Performers
                      </SelectItem>
                      <SelectItem value='needs-improvement'>
                        Needs Improvement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div data-onboarding='physician-table'>
              <PhysicianDataTable data={filteredData} />
            </div>
          </TabsContent>

          <TabsContent value='charts'>
            <ComprehensiveCharts data={processedData} metrics={metrics} />
          </TabsContent>

          <TabsContent value='heatmap'>
            <HourlyHeatmap data={processedData} />
          </TabsContent>

          <TabsContent value='insights'>
            <PerformanceInsights data={processedData} metrics={metrics} />
          </TabsContent>
        </Tabs>
      </div>
    </CourseAwareOnboardingProvider>
  );
}
