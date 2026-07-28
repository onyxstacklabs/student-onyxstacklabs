import { AIConversation, AIChatMessage } from '@/types/ai';

const STORAGE_KEY = 'onyx_ai_conversations';

export const ChatHistoryService = {
  /**
   * Retrieves all saved conversations from localStorage
   */
  getConversations(): AIConversation[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  /**
   * Saves or updates a conversation session
   */
  saveConversation(id: string, title: string, messages: AIChatMessage[], subjectId?: string): AIConversation[] {
    if (typeof window === 'undefined') return [];
    const existing = this.getConversations();
    const now = new Date().toISOString();

    const existingIndex = existing.findIndex((c) => c.id === id);

    let updated: AIConversation[];

    if (existingIndex >= 0) {
      updated = [...existing];
      updated[existingIndex] = {
        ...updated[existingIndex],
        title: title || updated[existingIndex].title,
        messages,
        updatedAt: now,
      };
    } else {
      const newConv: AIConversation = {
        id,
        title: title || 'New Conversation',
        createdAt: now,
        updatedAt: now,
        messages,
        subjectId,
      };
      updated = [newConv, ...existing];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save conversation to localStorage', e);
    }

    return updated;
  },

  /**
   * Deletes a conversation by ID
   */
  deleteConversation(id: string): AIConversation[] {
    if (typeof window === 'undefined') return [];
    const existing = this.getConversations();
    const updated = existing.filter((c) => c.id !== id);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete conversation from localStorage', e);
    }

    return updated;
  },

  /**
   * Clears all AI conversation history
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
