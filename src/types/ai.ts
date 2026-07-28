/**
 * Phase 9 — Enterprise AI Study Assistant Types & Architecture Contracts
 * Scalable, modular, and multi-provider compliant definitions.
 */

export type AIFeatureType =
  | 'chat'
  | 'summarizer'
  | 'quiz_generator'
  | 'flashcard_generator'
  | 'study_planner'
  | 'assignment_explainer'
  | 'pdf_analyzer';

export type AIRole = 'system' | 'user' | 'assistant';

export interface AIChatMessage {
  id: string;
  role: AIRole;
  content: string;
  timestamp: string;
  tokensUsed?: number;
  metadata?: Record<string, unknown>;
}

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: AIChatMessage[];
  subjectId?: string;
}

export interface AISummaryRequest {
  text: string;
  format?: 'bullet_points' | 'paragraph' | 'key_takeaways';
  maxLength?: number;
}

export interface AISummaryResponse {
  summary: string;
  keyConcepts: string[];
  actionItems: string[];
  readingTimeMinutes: number;
}

export interface AIQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AIQuizResponse {
  title: string;
  questions: AIQuizQuestion[];
  estimatedTimeMinutes: number;
}

export interface AIFlashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface AIFlashcardsResponse {
  cards: AIFlashcard[];
  subject: string;
}

export interface AIUsageMetrics {
  totalTokensUsed: number;
  totalRequests: number;
  requestsRemaining: number;
  resetWindowTimestamp: string;
}

export interface AIServiceConfig {
  apiKey?: string;
  modelName: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AIProviderResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
