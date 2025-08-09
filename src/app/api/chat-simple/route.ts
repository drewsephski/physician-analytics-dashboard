import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { physicianData } from '@/data/physician-data';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Simple Chat API Called

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // User message received

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Google AI API key not configured');
    }

    // Compute AI context from physician data (aggregated like index.html)
    const totalPhysicians = physicianData.length;
    const hourlyTotals = Array(24).fill(0);
    let totalDischarges = 0;
    let beforeNoonDischarges = 0;

    const physicianRates = physicianData.map((p) => {
      const total = p.discharges.reduce((a, b) => a + b, 0);
      const beforeNoon = p.discharges.slice(0, 12).reduce((a, b) => a + b, 0);
      p.discharges.forEach((v, i) => {
        hourlyTotals[i] += v;
      });
      totalDischarges += total;
      beforeNoonDischarges += beforeNoon;
      const rate = total > 0 ? (beforeNoon / total) * 100 : 0;
      return { name: p.name, rate };
    });

    const avgMorningRate =
      totalDischarges > 0 ? (beforeNoonDischarges / totalDischarges) * 100 : 0;
    const peakHour = hourlyTotals.indexOf(Math.max(...hourlyTotals));
    const topPerformersArr = [...physicianRates]
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5)
      .map((p) => `${p.name}: ${p.rate.toFixed(1)}%`);
    const topPerformers = topPerformersArr.join('\n- ');

    const context = `Context\n- Physicians: ${totalPhysicians}\n- Total discharges: ${totalDischarges.toLocaleString()}\n- Avg morning discharge rate: ${avgMorningRate.toFixed(1)}%\n- Peak discharge hour: ${peakHour}:00\n- Top performers:\n- ${topPerformers}`;

    // Initialize Google provider with API key and generate response
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY as string;
    const google = createGoogleGenerativeAI({ apiKey });
    const model = google('gemini-1.5-flash') as any;
    const result = await generateText({
      model,
      prompt: `You are a helpful AI assistant for physician discharge data analysis.\n\n${context}\n\nUser question: ${lastMessage.content}\n\nPlease provide a concise, actionable answer in markdown. Use bullet points and small tables when helpful.`
    });

    // Generated response created
    let text = (result.text || '').trim();

    // Fallback if model returns empty text
    if (!text) {
      const question = String(lastMessage.content || '').toLowerCase();
      if (question.includes('top') || question.includes('perform')) {
        text = `**Top 5 Performing Physicians (Morning Discharge Rate)**\n\n- ${topPerformers}`;
      } else if (
        question.includes('hourly') ||
        question.includes('8 am') ||
        question.includes('8am')
      ) {
        const slice = hourlyTotals.slice(8, 15); // 8:00 to 14:00
        text = `**Hourly Discharge Pattern (8:00–14:00)**\n\n| Hour | Discharges |\n|---|---:|\n${slice
          .map((v, i) => `| ${8 + i}:00 | ${v} |`)
          .join('\n')}`;
      } else if (question.includes('trend')) {
        const totalFirstHalf = hourlyTotals
          .slice(0, 12)
          .reduce((a, b) => a + b, 0);
        const totalSecondHalf = hourlyTotals
          .slice(12)
          .reduce((a, b) => a + b, 0);
        text = `**Daily Trend Overview**\n\n- Discharges before 12:00: ${totalFirstHalf}\n- Discharges after 12:00: ${totalSecondHalf}\n- Peak hour: ${peakHour}:00`;
      } else {
        text = `**Hospital Discharge Summary**\n\n- Physicians: ${totalPhysicians}\n- Total discharges: ${totalDischarges.toLocaleString()}\n- Avg morning rate: ${avgMorningRate.toFixed(1)}%\n- Peak hour: ${peakHour}:00\n- Top performers:\n- ${topPerformers}`;
      }
    }

    // Return as plain text response that can be converted to streaming format
    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    // Simple Chat API Error

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
