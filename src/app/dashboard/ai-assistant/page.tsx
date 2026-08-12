'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Bot, Send, Trash2, Sparkles, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

function AIAssistant() {
  const { profile } = useAuth();
  const studentName = profile?.displayName || 'Student';

  const initialGreeting: Message = {
    id: 'welcome-msg',
    sender: 'ai',
    text: `Hi ${studentName}! I'm your AI Study Assistant. I can help you summarize lecture notes, create quick revision quizzes, or explain tough topics in simple words. What are we studying today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isThinking) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: timeString,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);
    setError('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'chat',
          payload: {
            messages: updatedMessages
              .filter((m) => m.id !== 'welcome-msg')
              .map((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
              })),
            systemPrompt: `You are a friendly, encouraging AI study assistant for a student named ${studentName} on CampusOS. Help with summarizing notes, generating quizzes, and explaining concepts simply. Keep answers concise and student-friendly.`,
          },
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'The AI assistant could not respond right now.');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result.data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError('');
  };

  const quickPrompts = [
    { label: '📝 Summarize my notes', query: 'Can you summarize my study notes into clear bullet points?' },
    { label: '🧠 Generate a quiz', query: 'Generate a 5-question multiple choice revision quiz for me.' },
    { label: '💡 Explain simply', query: 'Explain the core concepts of my current lesson in simple everyday language.' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col gap-4 p-2 sm:p-0">
      <div className="p-4 bg-surface-raised/60 border border-surface-border rounded-card flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">AI Study Assistant</h1>
            <p className="text-xs text-slate-400">Personalized learning & study tutor • CampusOS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-base hover:bg-slate-800 text-slate-400 hover:text-white border border-surface-border text-xs font-medium transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[10px] font-mono font-bold text-brand-400 uppercase">
            <Sparkles className="w-3 h-3" /> Ready
          </span>
        </div>
      </div>

      <div className="flex-1 bg-surface-raised/60 border border-surface-border rounded-card p-4 flex flex-col justify-between overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-surface-base border border-surface-border text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[9px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-500 text-left'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2 bg-surface-base/50 rounded-xl w-fit border border-surface-border/60">
              <RefreshCw className="w-3.5 h-3.5 text-brand-400 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-accent-danger/10 border border-accent-danger text-accent-danger text-xs rounded-xl w-fit">
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 pt-3 border-t border-surface-border/80 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="text-xs bg-surface-base hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-surface-border hover:border-surface-borderHover transition font-medium flex items-center gap-1.5"
              >
                {item.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Type your study question or ask for a summary..."
              className="flex-1 bg-surface-base border border-surface-border focus:border-brand-500/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-xl transition shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <AIAssistant />
    </ProtectedRoute>
  );
}
