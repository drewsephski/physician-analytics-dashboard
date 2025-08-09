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
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function ChatTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [response, setResponse] = useState<string>('');
  const [testType, setTestType] = useState<'ai' | 'chat' | 'simple'>('ai');

  const testAI = async () => {
    setTesting(true);
    setResult(null);
    setResponse('');

    try {
      const res = await fetch('/api/test-ai');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
      }

      setResponse(JSON.stringify(data, null, 2));
      setResult('success');
    } catch (error) {
      console.error('AI Test failed:', error);
      setResponse(error instanceof Error ? error.message : 'Unknown error');
      setResult('error');
    } finally {
      setTesting(false);
    }
  };

  const testChat = async () => {
    setTesting(true);
    setResult(null);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'What is the overall morning discharge rate?'
            }
          ]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
      }

      setResponse(fullResponse);
      setResult('success');
    } catch (error) {
      setResponse(error instanceof Error ? error.message : 'Unknown error');
      setResult('error');
    } finally {
      setTesting(false);
    }
  };

  const testSimple = async () => {
    setTesting(true);
    setResult(null);
    setResponse('');

    try {
      const res = await fetch('/api/chat-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'What is the overall morning discharge rate?'
            }
          ]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const responseText = await res.text();
      setResponse(responseText);
      setResult('success');
    } catch (error) {
      setResponse(error instanceof Error ? error.message : 'Unknown error');
      setResult('error');
    } finally {
      setTesting(false);
    }
  };

  const runTest =
    testType === 'ai' ? testAI : testType === 'chat' ? testChat : testSimple;

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {result === 'success' && (
            <CheckCircle className='h-5 w-5 text-green-600' />
          )}
          {result === 'error' && <XCircle className='h-5 w-5 text-red-600' />}
          AI API Test
        </CardTitle>
        <CardDescription>Test the AI chat functionality</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-3 gap-2'>
          <Button
            variant={testType === 'ai' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTestType('ai')}
          >
            AI API
          </Button>
          <Button
            variant={testType === 'simple' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTestType('simple')}
          >
            Simple
          </Button>
          <Button
            variant={testType === 'chat' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setTestType('chat')}
          >
            Streaming
          </Button>
        </div>

        <Button onClick={runTest} disabled={testing} className='w-full'>
          {testing ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Testing{' '}
              {testType === 'ai'
                ? 'AI'
                : testType === 'simple'
                  ? 'Simple'
                  : 'Streaming'}
              ...
            </>
          ) : (
            `Test ${testType === 'ai' ? 'AI' : 'Chat'} Response`
          )}
        </Button>

        {response && (
          <div
            className={`rounded-lg p-3 text-sm ${
              result === 'success'
                ? 'border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
            }`}
          >
            <p className='mb-2 font-medium'>
              {result === 'success' ? 'Success!' : 'Error:'}
            </p>
            <p className='break-words whitespace-pre-wrap'>
              {response.length > 200
                ? `${response.substring(0, 200)}...`
                : response}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
