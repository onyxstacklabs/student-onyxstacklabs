import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/gemini';
import { AIFeatureType } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feature, payload } = body as { feature: AIFeatureType; payload: any };

    if (!feature || !payload) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: feature or payload' },
        { status: 400 }
      );
    }

    switch (feature) {
      case 'chat': {
        const { messages, systemPrompt } = payload;
        if (!messages || !Array.isArray(messages)) {
          return NextResponse.json(
            { success: false, error: 'Invalid payload for chat' },
            { status: 400 }
          );
        }
        const response = await GeminiService.generateChatResponse(messages, systemPrompt);
        return NextResponse.json(response, { status: response.success ? 200 : 500 });
      }

      case 'summarizer': {
        const { text } = payload;
        if (!text || typeof text !== 'string') {
          return NextResponse.json(
            { success: false, error: 'Invalid payload for summarizer' },
            { status: 400 }
          );
        }
        const response = await GeminiService.generateSummary(text);
        return NextResponse.json(response, { status: response.success ? 200 : 500 });
      }

      case 'quiz_generator': {
        const { topic, questionCount } = payload;
        if (!topic || typeof topic !== 'string') {
          return NextResponse.json(
            { success: false, error: 'Invalid payload for quiz generator' },
            { status: 400 }
          );
        }
        const response = await GeminiService.generateQuiz(topic, questionCount || 3);
        return NextResponse.json(response, { status: response.success ? 200 : 500 });
      }

      case 'flashcard_generator': {
        const { content } = payload;
        if (!content || typeof content !== 'string') {
          return NextResponse.json(
            { success: false, error: 'Invalid payload for flashcard generator' },
            { status: 400 }
          );
        }
        const response = await GeminiService.generateFlashcards(content);
        return NextResponse.json(response, { status: response.success ? 200 : 500 });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unsupported AI feature: ${feature}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
