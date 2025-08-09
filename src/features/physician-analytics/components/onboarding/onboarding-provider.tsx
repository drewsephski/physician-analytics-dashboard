'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  section: 'overview' | 'data-table' | 'charts' | 'heatmap' | 'insights';
  priority: number;
}

interface OnboardingContextType {
  isActive: boolean;
  currentStep: number;
  currentSection: string;
  steps: OnboardingStep[];
  startOnboarding: (section?: string) => void;
  stopOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  markStepCompleted: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  getStepsForSection: (section: string) => OnboardingStep[];
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const ONBOARDING_STEPS: OnboardingStep[] = [
  // Overview Section
  {
    id: 'welcome',
    title: 'Welcome to Your Analytics Dashboard',
    description:
      "This powerful platform transforms complex discharge data into actionable insights. You'll discover which physicians excel at morning discharges, identify improvement opportunities, and learn strategies to optimize patient flow throughout your hospital.",
    target: '[data-onboarding="main-header"]',
    position: 'right',
    section: 'overview',
    priority: 1
  },
  {
    id: 'summary-stats',
    title: "Your Hospital's Performance at a Glance",
    description:
      "These four key metrics tell the story of your discharge efficiency. The morning discharge rate shows how well you're meeting the 40% industry benchmark, while the peak hour reveals when your hospital is busiest. Use these numbers to track progress and set improvement goals.",
    target: '[data-onboarding="summary-stats"]',
    position: 'left',
    section: 'overview',
    priority: 2
  },
  {
    id: 'navigation-tabs',
    title: 'Four Ways to Explore Your Data',
    description:
      'Each tab offers a different lens for understanding discharge patterns. Start with Data Analysis for detailed physician information, then explore Visual Analytics for trends, Hourly Patterns for timing insights, and Performance Insights for strategic recommendations.',
    target: '[data-onboarding="main-tabs"]',
    position: 'right',
    section: 'overview',
    priority: 3
  },

  // Data Table Section
  {
    id: 'data-filters',
    title: "Find Exactly What You're Looking For",
    description:
      'Think of these tools as your data detective kit. Search for specific physicians by name, sort to find your top or bottom performers, and filter to focus on high achievers or those needing support. Try sorting by "Morning Rate" to see your champions first.',
    target: '[data-onboarding="data-filters"]',
    position: 'right',
    section: 'data-table',
    priority: 1
  },
  {
    id: 'physician-table',
    title: "Every Physician's Story in Numbers",
    description:
      "Each row tells a physician's discharge story. Look for patterns: Does Dr. Smith consistently discharge early? Is Dr. Jones handling a high volume? The colored badges instantly show who's excelling (green), meeting targets (blue), or needs coaching (orange).",
    target: '[data-onboarding="physician-table"]',
    position: 'left',
    section: 'data-table',
    priority: 2
  },
  {
    id: 'performance-badges',
    title: 'Instant Performance Recognition',
    description:
      'These color-coded badges are your quick visual guide. Green badges celebrate excellence (50%+ morning rate), blue shows solid performance (40-49%), and orange flags opportunities for improvement (<40%). Use these to quickly spot coaching opportunities.',
    target: '[data-onboarding="performance-badges"]',
    position: 'right',
    section: 'data-table',
    priority: 3
  },

  // Charts Section
  {
    id: 'chart-controls',
    title: 'Customize Your Visual Story',
    description:
      "These controls let you focus the charts on what matters most to you right now. Want to see only your top 10 performers? Adjust the limit. Curious about a specific department? Use the filters. Think of these as your chart's zoom and focus controls.",
    target: '[data-onboarding="chart-controls"]',
    position: 'left',
    section: 'charts',
    priority: 1
  },
  {
    id: 'performance-chart',
    title: 'Your Champions and Opportunities',
    description:
      "This chart is like a leaderboard for morning discharges. The colored bars instantly show who's crushing it (green), doing well (blue), or could use some support (orange). The reference lines help you see who's hitting industry benchmarks.",
    target: '[data-onboarding="performance-chart"]',
    position: 'right',
    section: 'charts',
    priority: 2
  },
  {
    id: 'hourly-distribution',
    title: 'When Does Your Hospital Come Alive?',
    description:
      "This flowing chart shows your hospital's discharge rhythm throughout the day. The highlighted golden zone (8AM-12PM) is when magic happens - early discharges that free up beds for new patients. Notice any surprising peaks or valleys?",
    target: '[data-onboarding="hourly-distribution"]',
    position: 'left',
    section: 'charts',
    priority: 3
  },
  {
    id: 'volume-performance',
    title: 'The Volume-Quality Balance',
    description:
      "This scatter plot reveals a fascinating story: Do your busiest physicians maintain quality morning discharge rates? Look for physicians in the top-right (high volume + high morning rate) - they're your efficiency superstars worth studying.",
    target: '[data-onboarding="volume-performance"]',
    position: 'right',
    section: 'charts',
    priority: 4
  },

  // Heatmap Section
  {
    id: 'heatmap-overview',
    title: "Every Physician's Daily Rhythm",
    description:
      "This heat map is like a fingerprint for each physician's discharge habits. Darker squares mean more discharges at that hour. Scan down the morning columns (8AM-12PM) to instantly spot your early-bird champions and night-owl physicians who might benefit from schedule adjustments.",
    target: '[data-onboarding="heatmap-main"]',
    position: 'right',
    section: 'heatmap',
    priority: 1
  },
  {
    id: 'heatmap-controls',
    title: 'Fine-Tune Your Heat Map View',
    description:
      "These controls help you dig deeper into the patterns. Adjust the color intensity to highlight subtle differences, or filter to focus on specific physicians. It's like adjusting the contrast on a photo to see details more clearly.",
    target: '[data-onboarding="heatmap-controls"]',
    position: 'left',
    section: 'heatmap',
    priority: 2
  },

  // Insights Section
  {
    id: 'executive-summary',
    title: "Your Hospital's Performance Snapshot",
    description:
      'This executive dashboard gives you the 30,000-foot view of your discharge performance. See at a glance how many physicians are excelling, meeting targets, or need focused attention. Perfect for board presentations and strategic planning discussions.',
    target: '[data-onboarding="executive-summary"]',
    position: 'left',
    section: 'insights',
    priority: 1
  },
  {
    id: 'performance-tiers',
    title: 'Three Groups, Three Strategies',
    description:
      'Your physicians naturally fall into three groups: Excellence tier (your mentors and champions), Target tier (solid performers with growth potential), and Focus tier (your biggest opportunity for impact). Each group needs a different approach to improvement.',
    target: '[data-onboarding="performance-tiers"]',
    position: 'right',
    section: 'insights',
    priority: 2
  },
  {
    id: 'best-practices',
    title: 'Learn from Your Champions',
    description:
      "Your top performers aren't just lucky - they have systems and habits worth copying. This section reveals the common patterns among your excellence tier physicians, giving you proven strategies to share with others.",
    target: '[data-onboarding="best-practices"]',
    position: 'left',
    section: 'insights',
    priority: 3
  },
  {
    id: 'improvement-plan',
    title: 'Your Roadmap to Better Performance',
    description:
      "This isn't just data - it's your action plan. See exactly which physicians to focus on first, what improvements would have the biggest impact, and how to prioritize your coaching efforts for maximum results.",
    target: '[data-onboarding="improvement-plan"]',
    position: 'right',
    section: 'insights',
    priority: 4
  },
  {
    id: 'recommendations',
    title: 'Evidence-Based Next Steps',
    description:
      "These aren't generic suggestions - they're specific recommendations based on your hospital's actual data. From quick wins you can implement this week to strategic initiatives for long-term improvement, your path forward is clear.",
    target: '[data-onboarding="recommendations"]',
    position: 'left',
    section: 'insights',
    priority: 5
  }
];

export function OnboardingProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSection, setCurrentSection] = useState('overview');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Load completed steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(
      'physician-analytics-onboarding-completed'
    );
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed steps to localStorage
  useEffect(() => {
    localStorage.setItem(
      'physician-analytics-onboarding-completed',
      JSON.stringify(Array.from(completedSteps))
    );
  }, [completedSteps]);

  const startOnboarding = (section: string = 'overview') => {
    setCurrentSection(section);
    const sectionSteps = ONBOARDING_STEPS.filter(
      (step) => step.section === section
    );
    if (sectionSteps.length > 0) {
      const firstStepIndex = ONBOARDING_STEPS.findIndex(
        (step) => step.id === sectionSteps[0].id
      );
      setCurrentStep(firstStepIndex);
      setIsActive(true);
    }
  };

  const stopOnboarding = () => {
    setIsActive(false);
  };

  const nextStep = () => {
    const sectionSteps = ONBOARDING_STEPS.filter(
      (step) => step.section === currentSection
    );
    const currentSectionStep = ONBOARDING_STEPS[currentStep];
    const currentIndexInSection = sectionSteps.findIndex(
      (step) => step.id === currentSectionStep.id
    );

    if (currentIndexInSection < sectionSteps.length - 1) {
      const nextSectionStep = sectionSteps[currentIndexInSection + 1];
      const nextGlobalIndex = ONBOARDING_STEPS.findIndex(
        (step) => step.id === nextSectionStep.id
      );
      setCurrentStep(nextGlobalIndex);
      markStepCompleted(currentSectionStep.id);
    } else {
      markStepCompleted(currentSectionStep.id);
      stopOnboarding();
    }
  };

  const previousStep = () => {
    const sectionSteps = ONBOARDING_STEPS.filter(
      (step) => step.section === currentSection
    );
    const currentSectionStep = ONBOARDING_STEPS[currentStep];
    const currentIndexInSection = sectionSteps.findIndex(
      (step) => step.id === currentSectionStep.id
    );

    if (currentIndexInSection > 0) {
      const prevSectionStep = sectionSteps[currentIndexInSection - 1];
      const prevGlobalIndex = ONBOARDING_STEPS.findIndex(
        (step) => step.id === prevSectionStep.id
      );
      setCurrentStep(prevGlobalIndex);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(stepIndex);
      setCurrentSection(ONBOARDING_STEPS[stepIndex].section);
    }
  };

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...Array.from(prev), stepId]));
  };

  const isStepCompleted = (stepId: string) => {
    return completedSteps.has(stepId);
  };

  const getStepsForSection = (section: string) => {
    return ONBOARDING_STEPS.filter((step) => step.section === section);
  };

  const value: OnboardingContextType = {
    isActive,
    currentStep,
    currentSection,
    steps: ONBOARDING_STEPS,
    startOnboarding,
    stopOnboarding,
    nextStep,
    previousStep,
    goToStep,
    markStepCompleted,
    isStepCompleted,
    getStepsForSection
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
