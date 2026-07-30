'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bot, Send, Trash2, Sparkles, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function AIAssistantPage() {
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Dynamic response generator for realistic interaction
  const generateAiResponse = (userPrompt: string): string => {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('quiz') || lower.includes('question')) {
      return `Here is a quick 3-question quiz based on your topic:\n\n1. What is the core purpose of this concept?\n2. Name two real-world applications.\n3. What is the main difference between this and alternative approaches?\n\nTry answering these in your head or type your answers here!`;
    }

    if (lower.includes('summarize') || lower.includes('summary') || lower.includes('notes')) {
      return `Here is a simplified summary:\n\n• Key Point 1: Main concept overview.\n• Key Point 2: Critical practical rules.\n• Key Point 3: Final exam takeaway.\n\nWould you like me to save these bullet points directly to your Notes workspace?`;
    }

    if (lower.includes('explain') || lower.includes('simple')) {
      return `In simple terms: Think of this like a post office. Data gets packed into small envelopes, labeled with an address, and sent through the fastest route. Once it arrives, it gets unpacked in order! Does that analogy make sense?`;
    }

    return `I reviewed your question about "${userPrompt}". Here is a helpful takeaway: focus on understanding the fundamental definitions first before jumping into advanced examples. Let me know if you want a step-by-step breakdown or practice flashcards!`;
  };

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

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    // Realistic processing delay
    setTimeout(() => {
      const aiResponseText = generateAiResponse(query);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        ...initialGreeting,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    { label: '📝 Summarize my notes', query: 'Can you summarize my study notes into clear bullet points?' },
    { label: '🧠 Generate a quiz', query: 'Generate a 5-question multiple choice revision quiz for me.' },
    { label: '💡 Explain simply', query: 'Explain the core concepts of my current lesson in simple everyday language.' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-7.5rem)] flex flex-col gap-4 p-2 sm:p-0">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">AI Study Assistant</h1>
            <p className="text-xs text-slate-400">Personalized learning & study tutor • OnyxStack Labs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-medium transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono font-bold text-purple-400 uppercase">
            <Sparkles className="w-3 h-3" /> Ready
          </span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-sm">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
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
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2 bg-slate-950/50 rounded-xl w-fit border border-slate-800/60">
              <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Buttons & Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.query)}
                className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition font-medium flex items-center gap-1.5"
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
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-purple-500/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-xl transition shadow-md shrink-0 flex items-center gap-1.5"
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
