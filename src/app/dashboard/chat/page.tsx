'use client';

// import { useChat } from 'ai/react';
import { useCustomChat } from '@/hooks/use-custom-chat';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import PageContainer from '@/components/layout/page-container';
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Loader2,
  BarChart3,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Download,
  RefreshCw,
  Settings,
  Trash2,
  BookOpen,
  Filter,
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import { ChatTest } from '@/components/chat-test';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const suggestedQuestions = [
  {
    title: 'Overall Performance',
    question:
      "What's the overall morning discharge rate across all physicians?",
    icon: <BarChart3 className='h-4 w-4' />,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
    category: 'overview'
  },
  {
    title: 'Top Performers',
    question: 'Who are the top 5 performing physicians?',
    icon: <TrendingUp className='h-4 w-4' />,
    color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
    category: 'performance'
  },
  {
    title: 'Compare Physicians',
    question: 'Compare Ahmed, M and Baltag, E performance',
    icon: <Users className='h-4 w-4' />,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
    category: 'comparison'
  },
  {
    title: 'Peak Hours',
    question: 'What are the peak discharge hours?',
    icon: <Clock className='h-4 w-4' />,
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700',
    category: 'timing'
  },
  {
    title: 'Improvement Areas',
    question: 'Which physicians need improvement in morning discharges?',
    icon: <Sparkles className='h-4 w-4' />,
    color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700',
    category: 'improvement'
  },
  {
    title: 'Hourly Analysis',
    question: 'Show me hourly discharge patterns from 8 AM to 2 PM',
    icon: <BarChart3 className='h-4 w-4' />,
    color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
    category: 'analysis'
  },
  {
    title: 'Best Practices',
    question: 'What are the best practices from top-performing physicians?',
    icon: <BookOpen className='h-4 w-4' />,
    color: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700',
    category: 'insights'
  },
  {
    title: 'Trends Analysis',
    question: 'Show me discharge trends over the past month',
    icon: <TrendingUp className='h-4 w-4' />,
    color: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
    category: 'trends'
  }
];

const quickActions = [
  {
    label: 'Generate Report',
    action: 'generate',
    icon: <Download className='h-4 w-4' />
  },
  {
    label: 'Clear Chat',
    action: 'clear',
    icon: <Trash2 className='h-4 w-4' />
  },
  {
    label: 'Export Data',
    action: 'export',
    icon: <Download className='h-4 w-4' />
  },
  {
    label: 'Refresh Stats',
    action: 'refresh',
    icon: <RefreshCw className='h-4 w-4' />
  }
];

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    setMessages,
    error
  } = useCustomChat({
    api: '/api/chat',
    onError: (error) => {
      toast.error(`Failed to get AI response: ${error.message}`);
    },
    onFinish: () => {
      toast.success('Response received!');
    }
  });

  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatSettings] = useState({
    autoSpeak: false,
    showTimestamps: false,
    compactMode: false
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        setTimeout(() => {
          scrollAreaRef.current!.scrollTop =
            scrollAreaRef.current!.scrollHeight;
        }, 100);
      }
    };
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Filter suggested questions
  const filteredQuestions = suggestedQuestions.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSubmit(e);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'clear':
        setMessages([]);
        toast.success('Chat cleared');
        break;
      case 'refresh':
        toast.success('Stats refreshed');
        break;
      case 'generate':
        setInput(
          'Generate a comprehensive report of physician discharge performance'
        );
        break;
      case 'export':
        toast.info('Export functionality coming soon');
        break;
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className='mx-auto w-full max-w-7xl space-y-6'>
        {/* Header */}
        <div className='space-y-4 text-center'>
          <div className='flex items-center justify-center gap-3'>
            <div className='rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-3 text-white shadow-lg'>
              <MessageCircle className='h-8 w-8' />
            </div>
            <div>
              <h1 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent'>
                AI Data Assistant
              </h1>
              <p className='text-muted-foreground mt-2 text-lg'>
                Ask questions about physician discharge data and get intelligent
                insights
              </p>
            </div>
          </div>
        </div>

        {/* Debug Test Component */}
        <div className='mb-6 flex justify-center'>
          <ChatTest />
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-500/10 p-2'>
                  <Users className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                    Physicians
                  </p>
                  <p className='text-2xl font-bold text-blue-800 dark:text-blue-200'>
                    22
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-500/10 p-2'>
                  <BarChart3 className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-green-700 dark:text-green-300'>
                    Total Discharges
                  </p>
                  <p className='text-2xl font-bold text-green-800 dark:text-green-200'>
                    3.8K+
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-orange-500/10 p-2'>
                  <TrendingUp className='h-5 w-5 text-orange-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-orange-700 dark:text-orange-300'>
                    Avg Morning Rate
                  </p>
                  <p className='text-2xl font-bold text-orange-800 dark:text-orange-200'>
                    31.2%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-purple-500/10 p-2'>
                  <Clock className='h-5 w-5 text-purple-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                    Peak Hour
                  </p>
                  <p className='text-2xl font-bold text-purple-800 dark:text-purple-200'>
                    3 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Settings className='h-5 w-5' />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuickAction(action.action)}
                  className='flex items-center gap-2'
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Interface */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
          {/* Enhanced Suggested Questions Sidebar */}
          <Card className='lg:col-span-1'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Sparkles className='h-5 w-5' />
                Quick Start
              </CardTitle>
              <CardDescription>
                Browse and search suggested questions
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Search and Filter */}
              <div className='space-y-3'>
                <div className='relative'>
                  <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                  <Input
                    placeholder='Search questions...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-8'
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Filter by category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    <SelectItem value='overview'>Overview</SelectItem>
                    <SelectItem value='performance'>Performance</SelectItem>
                    <SelectItem value='comparison'>Comparison</SelectItem>
                    <SelectItem value='timing'>Timing</SelectItem>
                    <SelectItem value='improvement'>Improvement</SelectItem>
                    <SelectItem value='analysis'>Analysis</SelectItem>
                    <SelectItem value='insights'>Insights</SelectItem>
                    <SelectItem value='trends'>Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtered Questions */}
              <div className='max-h-96 space-y-3 overflow-y-auto'>
                {filteredQuestions.map((item, index) => (
                  <Button
                    key={index}
                    variant='outline'
                    className={`h-auto w-full justify-start p-4 text-left transition-all duration-200 ${item.color}`}
                    onClick={() => handleSuggestedQuestion(item.question)}
                    disabled={isLoading}
                  >
                    <div className='flex w-full items-start gap-3'>
                      <div className='mt-0.5 flex-shrink-0'>{item.icon}</div>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 text-sm font-medium'>
                          {item.title}
                        </div>
                        <div className='line-clamp-2 text-xs opacity-80'>
                          {item.question}
                        </div>
                      </div>
                      <ArrowRight className='mt-1 h-3 w-3 flex-shrink-0 opacity-50' />
                    </div>
                  </Button>
                ))}
              </div>

              {filteredQuestions.length === 0 && (
                <div className='text-muted-foreground py-4 text-center'>
                  <Filter className='mx-auto mb-2 h-8 w-8 opacity-50' />
                  <p className='text-sm'>No questions match your search</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Chat Messages Area */}
          <Card className='flex flex-col lg:col-span-3'>
            <CardHeader className='flex-shrink-0 pb-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <Bot className='h-5 w-5' />
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask questions about physician discharge patterns,
                    performance metrics, and insights
                  </CardDescription>
                </div>

                {/* Chat Controls */}
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={isSpeaking ? stopSpeaking : () => {}}
                    disabled={!isSpeaking}
                  >
                    {isSpeaking ? (
                      <VolumeX className='h-4 w-4' />
                    ) : (
                      <Volume2 className='h-4 w-4' />
                    )}
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={isListening ? () => {} : startListening}
                    disabled={isListening}
                    className={isListening ? 'text-red-500' : ''}
                  >
                    {isListening ? (
                      <MicOff className='h-4 w-4' />
                    ) : (
                      <Mic className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className='flex min-h-0 flex-1 flex-col'>
              {/* Messages Area */}
              <div
                ref={scrollAreaRef}
                className='mb-4 max-h-[600px] min-h-[400px] flex-1 overflow-y-auto rounded-md border p-4 pr-4'
              >
                <div className='space-y-6'>
                  {messages.length === 0 && (
                    <div className='text-muted-foreground py-12 text-center'>
                      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100'>
                        <Bot className='h-8 w-8 text-blue-600' />
                      </div>
                      <h3 className='mb-2 font-medium'>
                        Welcome to your AI Data Assistant!
                      </h3>
                      <p className='mb-4 text-sm'>
                        Start a conversation by asking a question about
                        physician discharge data, or click one of the suggested
                        questions.
                      </p>
                      {error && (
                        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20'>
                          <p className='text-sm text-red-600 dark:text-red-400'>
                            Error: {error.message}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex max-w-[85%] gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className='h-5 w-5' />
                          ) : (
                            <Bot className='h-5 w-5' />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className='min-w-0 flex-1'>
                          <div
                            className={`rounded-2xl p-4 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                : 'border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                            }`}
                          >
                            {message.role === 'assistant' ? (
                              <div className='prose prose-sm dark:prose-invert max-w-none'>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {message.content}
                              </div>
                            )}
                          </div>

                          {/* Message Actions */}
                          <div className='mt-2 flex items-center gap-2'>
                            {message.role === 'assistant' && (
                              <>
                                <Badge variant='secondary' className='text-xs'>
                                  AI Assistant
                                </Badge>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-6 px-2 text-xs'
                                  onClick={() =>
                                    copyToClipboard(message.content, message.id)
                                  }
                                >
                                  {copiedMessageId === message.id ? (
                                    <Check className='h-3 w-3' />
                                  ) : (
                                    <Copy className='h-3 w-3' />
                                  )}
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-6 px-2 text-xs'
                                  onClick={() => speakText(message.content)}
                                  disabled={isSpeaking}
                                >
                                  <Volume2 className='h-3 w-3' />
                                </Button>
                              </>
                            )}
                            {chatSettings.showTimestamps && (
                              <span className='text-muted-foreground text-xs'>
                                {new Date(
                                  message.createdAt || Date.now()
                                ).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className='flex justify-start gap-4'>
                      <div className='flex max-w-[85%] gap-4'>
                        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'>
                          <Bot className='h-5 w-5' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                            <div className='flex items-center gap-3'>
                              <Loader2 className='h-4 w-4 animate-spin' />
                              <span className='text-sm'>
                                AI is analyzing your question...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className='mb-4 flex-shrink-0' />

              {/* Enhanced Input Form */}
              <div className='flex-shrink-0'>
                <form onSubmit={handleFormSubmit} className='space-y-3'>
                  <div className='relative'>
                    <Textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder='Ask about physician discharge data... (Press Enter to send, Shift+Enter for new line)'
                      disabled={isLoading}
                      className='max-h-[120px] min-h-[60px] resize-none pr-20 text-sm leading-relaxed'
                      rows={2}
                    />

                    {/* Input Controls */}
                    <div className='absolute right-2 bottom-2 flex items-center gap-1'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={startListening}
                        disabled={isListening || isLoading}
                        className='h-8 w-8 p-0'
                      >
                        {isListening ? (
                          <MicOff className='h-4 w-4 text-red-500' />
                        ) : (
                          <Mic className='h-4 w-4' />
                        )}
                      </Button>

                      <Button
                        type='submit'
                        disabled={isLoading || !input.trim()}
                        size='sm'
                        className='h-8 w-8 p-0'
                      >
                        {isLoading ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Send className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='text-muted-foreground flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-4'>
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      {isListening && (
                        <span className='animate-pulse text-red-500'>
                          🎤 Listening...
                        </span>
                      )}
                    </div>
                    <span>{input.length}/2000</span>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
