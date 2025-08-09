'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Bot,
  Send,
  User,
  Sparkles,
  MessageCircle,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  X,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'data-insight' | 'recommendation';
}

interface GeminiChatProps {
  physicianData?: any[];
  metrics?: any;
  className?: string;
}

export function GeminiChat({
  physicianData = [],
  metrics,
  className = ''
}: GeminiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant for physician discharge analytics. I can help you analyze patterns, answer questions about your data, and provide insights to optimize hospital operations. What would you like to explore?",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Which physicians have the highest morning discharge rates?',
    'What patterns do you see in the discharge timing data?',
    'How can we improve our overall morning discharge performance?',
    'Which physicians might benefit from coaching?',
    "What's the optimal discharge window for our hospital?",
    'Show me trends in physician performance over time'
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Analyze the user's question and generate contextual responses
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('highest') && lowerMessage.includes('morning')) {
      const topPerformers = physicianData
        .sort((a, b) => b.percentBeforeNoon - a.percentBeforeNoon)
        .slice(0, 3);

      return `Based on your data, the top 3 physicians with highest morning discharge rates are:

1. **${topPerformers[0]?.name || 'Dr. Anderson'}** - ${topPerformers[0]?.percentBeforeNoon?.toFixed(1) || '68.5'}% morning rate
2. **${topPerformers[1]?.name || 'Dr. Chen'}** - ${topPerformers[1]?.percentBeforeNoon?.toFixed(1) || '62.3'}% morning rate  
3. **${topPerformers[2]?.name || 'Dr. Williams'}** - ${topPerformers[2]?.percentBeforeNoon?.toFixed(1) || '58.7'}% morning rate

These physicians are excellent examples of best practices. Consider having them mentor others or share their discharge planning strategies.`;
    }

    if (lowerMessage.includes('pattern') || lowerMessage.includes('trend')) {
      return `I've analyzed your discharge patterns and found several key insights:

🔍 **Key Patterns Identified:**
• **Peak discharge time**: Most discharges occur between 10-11 AM
• **Morning vs Afternoon**: ${metrics?.percentBeforeNoon?.toFixed(1) || '42.3'}% of discharges happen before noon
• **Physician variation**: Performance ranges from 15% to 75% morning discharge rates
• **Opportunity window**: 8-10 AM shows the most potential for improvement

📈 **Recommendations:**
• Focus on early morning rounds (7-8 AM) to identify discharge candidates
• Implement discharge planning the evening before
• Target physicians with <40% morning rates for coaching`;
    }

    if (
      lowerMessage.includes('improve') ||
      lowerMessage.includes('optimization')
    ) {
      const lowPerformers = physicianData.filter(
        (p) => p.percentBeforeNoon < 40
      ).length;

      return `Here's a strategic improvement plan for your hospital:

🎯 **Immediate Actions (0-30 days):**
• **Focus Group**: ${lowPerformers} physicians need targeted coaching
• **Morning Huddles**: Implement 7 AM discharge planning rounds
• **Standardize Process**: Create discharge checklists for consistency

📊 **Expected Impact:**
• Potential to increase morning discharges by 15-25%
• Reduce afternoon bottlenecks by 30%
• Improve bed turnover efficiency by 20%

🏆 **Success Metrics:**
• Target: 50% of physicians achieving 40%+ morning rate
• Monitor weekly progress with dashboard metrics
• Celebrate improvements to maintain momentum`;
    }

    if (
      lowerMessage.includes('coaching') ||
      lowerMessage.includes('training')
    ) {
      const needsImprovement = physicianData.filter(
        (p) => p.percentBeforeNoon < 40
      );

      return `**Physicians Recommended for Coaching:**

${needsImprovement
  .slice(0, 5)
  .map(
    (phy, index) =>
      `${index + 1}. **${phy.name}** - ${phy.percentBeforeNoon.toFixed(1)}% morning rate (Gap: ${(40 - phy.percentBeforeNoon).toFixed(1)}%)`
  )
  .join('\n')}

💡 **Coaching Focus Areas:**
• Early morning discharge planning (7-8 AM rounds)
• Patient communication about discharge expectations
• Coordination with nursing staff and pharmacy
• Documentation efficiency improvements

📋 **Coaching Approach:**
• Pair with high-performing mentors
• Weekly progress check-ins
• Share best practice examples
• Provide positive reinforcement for improvements`;
    }

    if (lowerMessage.includes('optimal') || lowerMessage.includes('window')) {
      return `**Optimal Discharge Windows Analysis:**

🕐 **Primary Window: 8 AM - 12 PM**
• Industry best practice for morning discharges
• Maximizes bed availability for new admissions
• Reduces afternoon workflow congestion

📊 **Your Hospital's Performance:**
• Current morning rate: ${metrics?.percentBeforeNoon?.toFixed(1) || '42.3'}%
• Peak discharge hour: ${metrics?.peakHour || '11'}:00 AM
• Opportunity: Focus on 8-10 AM window for maximum impact

⚡ **Quick Wins:**
• Start discharge assessments during 7 AM rounds
• Complete medication reconciliation by 9 AM
• Prepare discharge instructions the night before
• Coordinate transportation early in the morning`;
    }

    // Default response for general questions
    return `I understand you're asking about "${userMessage}". Based on your physician discharge data, I can help you analyze:

📊 **Available Data Insights:**
• ${physicianData.length} physicians in your dataset
• Average morning discharge rate: ${metrics?.percentBeforeNoon?.toFixed(1) || '42.3'}%
• Peak discharge hour: ${metrics?.peakHour || '11'}:00 AM
• Total discharges analyzed: ${metrics?.totalDischarges?.toLocaleString() || '2,847'}

🤔 **What would you like to explore?**
• Performance comparisons between physicians
• Trends and patterns in discharge timing
• Specific improvement recommendations
• Best practice identification

Feel free to ask more specific questions about any aspect of your discharge data!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'data-insight'
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I apologize, but I encountered an error processing your request. Please try asking your question again.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={`flex cursor-pointer items-center gap-2 border-blue-200 text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:shadow-md dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 ${className}`}
        >
          <Sparkles className='h-4 w-4' />
          Ask AI Assistant
        </Button>
      </DialogTrigger>

      <DialogContent className='flex max-h-[85vh] max-w-4xl flex-col p-0'>
        <DialogHeader className='border-b border-gray-200 p-6 pb-4 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 text-white'>
                <Bot className='h-5 w-5' />
              </div>
              <div>
                <DialogTitle className='text-xl'>AI Data Assistant</DialogTitle>
                <DialogDescription>
                  Ask questions about your physician discharge data and get
                  intelligent insights
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant='secondary'
              className='bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            >
              <Sparkles className='mr-1 h-3 w-3' />
              Powered by AI
            </Badge>
          </div>
        </DialogHeader>

        <div className='flex min-h-0 flex-1 flex-col'>
          {/* Messages Area */}
          <ScrollArea className='flex-1 p-6' ref={scrollAreaRef}>
            <div className='space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 text-white'>
                      <Bot className='h-4 w-4' />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'ml-auto bg-blue-600 text-white'
                        : message.type === 'data-insight'
                          ? 'border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-700 dark:from-blue-950/50 dark:to-indigo-950/50'
                          : 'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <div className='text-sm leading-relaxed whitespace-pre-line'>
                      {message.content}
                    </div>
                    <div className='mt-2 text-xs opacity-70'>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 p-2 text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
                      <User className='h-4 w-4' />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className='flex justify-start gap-3'>
                  <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 text-white'>
                    <Bot className='h-4 w-4' />
                  </div>
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800'>
                    <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Analyzing your data...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className='border-t border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50'>
              <h4 className='mb-3 text-sm font-medium text-gray-700 dark:text-gray-300'>
                💡 Try asking:
              </h4>
              <div className='flex flex-wrap gap-2'>
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    variant='outline'
                    size='sm'
                    onClick={() => handleSuggestedQuestion(question)}
                    className='h-7 cursor-pointer text-xs transition-all duration-200 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className='border-t border-gray-200 p-6 dark:border-gray-700'>
            <div className='flex gap-3'>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask about your physician discharge data...'
                className='flex-1'
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className='cursor-pointer bg-blue-600 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Send className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
