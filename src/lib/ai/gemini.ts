import {
  AIChatMessage,
  AIFlashcardsResponse,
  AIProviderResponse,
  AIQuizResponse,
  AISummaryResponse,
} from '@/types/ai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const DEFAULT_MODEL = 'gemini-1.5-flash';

/**
 * Helper to call Google Gemini API REST endpoint securely
 */
async function callGeminiApi(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction?: string,
  jsonOutput: boolean = false
): Promise<{ text: string; usage?: { promptTokens: number; completionTokens: number; totalTokens: number } }> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key is missing. Please set GEMINI_API_KEY in environment variables.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      ...(jsonOutput ? { responseMimeType: 'application/json' } : {}),
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  const usageMetadata = data.usageMetadata;
  const usage = usageMetadata
    ? {
        promptTokens: usageMetadata.promptTokenCount || 0,
        completionTokens: usageMetadata.candidatesTokenCount || 0,
        totalTokens: usageMetadata.totalTokenCount || 0,
      }
    : undefined;

  return { text, usage };
}

/**
 * Core Gemini Service Methods
 */
export const GeminiService = {
  /**
   * Generates a conversational response for the AI Chat Interface
   */
  async generateChatResponse(
    messages: AIChatMessage[],
    systemPrompt?: string
  ): Promise<AIProviderResponse<string>> {
    try {
      const formattedContents = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const defaultSystem =
        systemPrompt ||
        'You are an expert Enterprise AI Academic Tutor for OnyxStackLabs. Provide concise, clear, and actionable study assistance.';

      const { text, usage } = await callGeminiApi(formattedContents, defaultSystem);

      return {
        success: true,
        data: text,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate response from Gemini API',
      };
    }
  },

  /**
   * Generates a structured summary of notes or study text
   */
  async generateSummary(textInput: string): Promise<AIProviderResponse<AISummaryResponse>> {
    try {
      const systemInstruction = `You are an AI Text Summarizer. Analyze the provided study text and return a strict JSON object with this format:
{
  "summary": "High level overview of the text",
  "keyConcepts": ["Concept 1", "Concept 2"],
  "actionItems": ["Actionable study item 1", "Actionable study item 2"],
  "readingTimeMinutes": 3
}`;

      const contents = [{ role: 'user', parts: [{ text: textInput }] }];
      const { text, usage } = await callGeminiApi(contents, systemInstruction, true);

      const parsedData: AISummaryResponse = JSON.parse(text);

      return {
        success: true,
        data: parsedData,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate summary',
      };
    }
  },

  /**
   * Generates a multiple-choice quiz based on study content
   */
  async generateQuiz(topicOrText: string, questionCount: number = 3): Promise<AIProviderResponse<AIQuizResponse>> {
    try {
      const systemInstruction = `You are an Academic Quiz Generator. Generate a ${questionCount}-question quiz in strict JSON format matching this structure:
{
  "title": "Quiz Title",
  "estimatedTimeMinutes": 5,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Why Option A is correct."
    }
  ]
}`;

      const contents = [{ role: 'user', parts: [{ text: `Create a quiz about: ${topicOrText}` }] }];
      const { text, usage } = await callGeminiApi(contents, systemInstruction, true);

      const parsedData: AIQuizResponse = JSON.parse(text);

      return {
        success: true,
        data: parsedData,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate quiz',
      };
    }
  },

  /**
   * Generates revision flashcards
   */
  async generateFlashcards(subjectContent: string): Promise<AIProviderResponse<AIFlashcardsResponse>> {
    try {
      const systemInstruction = `You are a Flashcard Generator. Create 4 revision flashcards in strict JSON format matching this structure:
{
  "subject": "Subject Name",
  "cards": [
    {
      "id": "fc1",
      "front": "Question/Prompt",
      "back": "Detailed Answer",
      "difficulty": "medium"
    }
  ]
}`;

      const contents = [{ role: 'user', parts: [{ text: `Generate flashcards for: ${subjectContent}` }] }];
      const { text, usage } = await callGeminiApi(contents, systemInstruction, true);

      const parsedData: AIFlashcardsResponse = JSON.parse(text);

      return {
        success: true,
        data: parsedData,
        usage,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate flashcards',
      };
    }
  },
};
