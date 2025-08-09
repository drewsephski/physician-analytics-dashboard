import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function GET() {
  try {
    console.log('Testing Google AI API...');

    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);

    if (!apiKey) {
      return Response.json(
        {
          error: 'Google AI API key not found',
          env: process.env.NODE_ENV
        },
        { status: 500 }
      );
    }

    // Test simple generation
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: 'Say hello and confirm you are working correctly.'
    });

    return Response.json({
      success: true,
      message: result.text,
      usage: result.usage
    });
  } catch (error) {
    console.error('AI Test Error:', error);
    return Response.json(
      {
        error: 'AI test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
