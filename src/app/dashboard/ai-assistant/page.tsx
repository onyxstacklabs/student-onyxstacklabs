'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIAssistantPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${profile?.displayName || 'Student'}! I'm your AI Study Assistant. How can I help you summarize notes, solve complex problems, or review course material today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isThinking) return;

    const userText = inputQuery;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: timeString,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    // Simulated AI Intelligence Engine Response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I've analyzed your prompt regarding "${userText}". As an enterprise study assistant, I've prepared a concise breakdown to accelerate your learning goals. Let me know if you need flashcards or practice questions for this topic!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1200);
  };

  const quickPrompts = [
    '📝 Summarize my recent lecture notes',
    '🧠 Generate a 5-question quiz for revision',
    '💡 Explain key concepts in simple terms',
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7rem)] flex flex-col gap-4">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl font-bold">
            🤖
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">AI Study Assistant</h1>
            <p className="text-xs text-slate-400">Enterprise AI Engine • Powered by OnyxStack Labs</p>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-400 font-bold uppercase">
          Live AI Agent
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-sm">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1.5 text-right font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>AI Engine is processing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts & Form Input */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputQuery(prompt.replace(/^[^\s]+\s/, ''));
                }}
                className="text-[11px] bg-slate-950/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your courses or request summaries..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-md shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
