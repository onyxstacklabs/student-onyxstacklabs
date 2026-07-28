'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage, AIConversation } from '@/types/ai';
import { ChatHistoryService } from '@/lib/ai/chatHistory';

interface AIChatInterfaceProps {
  initialSystemPrompt?: string;
  subjectContext?: string;
}

export function AIChatInterface({ initialSystemPrompt, subjectContext }: AIChatInterfaceProps) {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(`session-${Date.now()}`);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial load of history & welcome message
  useEffect(() => {
    const history = ChatHistoryService.getConversations();
    setConversations(history);

    if (history.length > 0) {
      setCurrentSessionId(history[0].id);
      setMessages(history[0].messages);
    } else {
      initNewChat();
    }
  }, []);

  const initNewChat = () => {
    const newId = `session-${Date.now()}`;
    const initialMsgs: AIChatMessage[] = [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: subjectContext
          ? `Hello! I am your AI Study Assistant for **${subjectContext}**. How can I assist with your studies today?`
          : 'Hello! I am your OnyxStackLabs AI Study Assistant. Ask me anything about your courses, topics, or assignments!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setCurrentSessionId(newId);
    setMessages(initialMsgs);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'chat',
          payload: {
            messages: updatedMessages,
            systemPrompt: initialSystemPrompt,
          },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const assistantMsg: AIChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: result.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const finalMessages = [...updatedMessages, assistantMsg];
        setMessages(finalMessages);

        // Auto-save session history
        const sessionTitle = userQuery.slice(0, 30) + (userQuery.length > 30 ? '...' : '');
        const updatedHistory = ChatHistoryService.saveConversation(
          currentSessionId,
          sessionTitle,
          finalMessages,
          subjectContext
        );
        setConversations(updatedHistory);
      } else {
        throw new Error(result.error || 'Failed to receive AI response');
      }
    } catch (error) {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error:** ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (session: AIConversation) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = ChatHistoryService.deleteConversation(id);
    setConversations(updated);
    if (id === currentSessionId) {
      if (updated.length > 0) {
        setCurrentSessionId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        initNewChat();
      }
    }
  };

  return (
    <div className="flex h-[600px] w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden relative">
      {/* Sidebar - History */}
      <div
        className={`absolute sm:relative z-20 w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          showHistory ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Chat History
          </h4>
          <button
            onClick={initNewChat}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-2.5 py-1 rounded transition-colors"
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-6">No previous chats</div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === currentSessionId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectSession(conv)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 font-medium'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate flex-1 pr-2">{conv.title}</span>
                  <button
                    onClick={(e) => handleDeleteSession(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="sm:hidden text-slate-400 hover:text-white p-1 text-xs border border-slate-800 rounded"
            >
              ☰ History
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-slate-100">AI Study Assistant</h3>
          </div>
          {subjectContext && (
            <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
              {subjectContext}
            </span>
          )}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/50">
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isAssistant ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-slate-400 flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <span className="ml-2 text-xs">Analyzing and generating response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-sm px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-colors shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
