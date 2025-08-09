'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const demoQuestions = [
  "What's the overall morning discharge rate?",
  'Who are the top 5 performing physicians?',
  'Compare Ahmed, M and Baltag, E performance',
  'What are the peak discharge hours?'
];

export function ChatDemo() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MessageCircle className='h-5 w-5' />
          AI Chat Demo
        </CardTitle>
        <CardDescription>
          Try asking questions about physician data
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {demoQuestions.map((question, index) => (
          <Button
            key={index}
            variant='outline'
            className='h-auto w-full justify-between p-3 text-left text-sm'
            onClick={() => setSelectedQuestion(question)}
          >
            <span className='truncate'>{question}</span>
            <ArrowRight className='h-3 w-3 flex-shrink-0' />
          </Button>
        ))}

        {selectedQuestion && (
          <div className='mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20'>
            <p className='mb-2 text-sm font-medium'>Selected Question:</p>
            <p className='text-muted-foreground mb-3 text-sm'>
              {selectedQuestion}
            </p>
            <Link href='/dashboard/chat'>
              <Button size='sm' className='w-full'>
                Ask in Chat
                <ArrowRight className='ml-2 h-3 w-3' />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
