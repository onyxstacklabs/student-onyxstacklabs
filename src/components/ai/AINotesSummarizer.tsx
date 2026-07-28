'use client';

import React, { useState } from 'react';
import { AISummaryResponse } from '@/types/ai';

export function AINotesSummarizer() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<AISummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'summarizer',
          payload: { text: inputText },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setSummaryResult(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate summary.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during summarization.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    const formatted = `SUMMARY:\n${summaryResult.summary}\n\nKEY CONCEPTS:\n${summaryResult.keyConcepts
      .map((c) => `• ${c}`)
      .join('\n')}\n\nACTION ITEMS:\n${summaryResult.actionItems.map((a) => `• ${a}`).join('\n')}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Notes Summarizer</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Convert long study materials and lecture notes into concise actionable insights.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
          Gemini Powered
        </span>
      </div>

      <form onSubmit={handleSummarize} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Paste Lecture Notes / Content
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes, textbook chapter, or discussion prompt here..."
            rows={6}
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-sm rounded-lg p-4 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {inputText.trim() ? `${inputText.trim().split(/\s+/).length} words` : '0 words'}
          </span>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Summarizing...</span>
              </>
            ) : (
              <span>Generate Summary</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {summaryResult && (
        <div className="mt-6 border-t border-slate-800 pt-6 space-y-6 bg-slate-950/60 p-6 rounded-xl border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                ⏱ {summaryResult.readingTimeMinutes} min read
              </span>
              <h4 className="text-sm font-semibold text-slate-200">Summary Overview</h4>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy Summary'}
            </button>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-lg border border-slate-800/80">
            {summaryResult.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Concepts */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Key Concepts
              </h5>
              <ul className="space-y-1.5">
                {summaryResult.keyConcepts.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Study Action Items
              </h5>
              <ul className="space-y-1.5">
                {summaryResult.actionItems.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
