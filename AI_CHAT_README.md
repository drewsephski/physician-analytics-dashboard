# AI Chat Feature for Physician Discharge Analytics

## Overview
The AI Chat feature provides an intelligent interface for querying and analyzing physician discharge data using Google's Gemini AI model through the Vercel AI SDK.

## Features

### 🤖 Intelligent Data Analysis
- Ask natural language questions about physician discharge patterns
- Get insights on performance metrics and trends
- Compare physicians and identify top performers
- Analyze hourly discharge patterns

### 🛠️ Available Tools
The AI assistant has access to several specialized tools:

1. **getPhysicianStats** - Get detailed statistics for specific physicians or overall metrics
2. **comparePhysicians** - Compare performance between multiple physicians
3. **getTopPerformers** - Identify top performing physicians based on morning discharge rates
4. **getHourlyAnalysis** - Analyze discharge patterns by hour

### 💬 Example Questions
- "What's the overall morning discharge rate across all physicians?"
- "Who are the top 5 performing physicians?"
- "Compare Ahmed, M and Baltag, E performance"
- "What are the peak discharge hours?"
- "Which physicians need improvement in morning discharges?"
- "Show me hourly discharge patterns from 8 AM to 2 PM"

## Setup Instructions

### 1. Install Dependencies
```bash
pnpm add ai @ai-sdk/google
```

### 2. Get Google AI API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. Access the Chat Interface
Navigate to `/dashboard/chat` in your application to start using the AI assistant.

## Technical Implementation

### API Route (`/api/chat`)
- Uses Vercel AI SDK with Google's Gemini 1.5 Flash model
- Implements streaming responses for real-time chat experience
- Provides specialized tools for physician data analysis

### Chat Interface (`/dashboard/chat`)
- Built with React and the `useChat` hook from AI SDK
- Responsive design with suggested questions
- Real-time streaming responses
- Message history and loading states

### Data Integration
- Directly integrates with existing physician discharge data
- Uses the same data processing utilities as the main analytics dashboard
- Provides contextual insights based on hospital discharge optimization goals

## Key Metrics Explained
- **Morning Discharge Rate**: Percentage of discharges before noon (target: 40%+)
- **Peak Hours**: Typically 10 AM - 4 PM for optimal patient flow
- **Early Discharges**: 6 AM - 12 PM window for best outcomes
- **Average Discharge Time**: Calculated from hourly distribution patterns

## Navigation
The AI Chat feature is accessible through the main navigation sidebar with the "AI Chat" menu item (shortcut: C+H).