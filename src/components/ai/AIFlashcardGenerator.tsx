'use client';

import React, { useState } from 'react';
import { AIFlashcard, AIFlashcardsResponse } from '@/types/ai';

export function AIFlashcardGenerator() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flashcardData, setFlashcardData] = useState<AIFlashcardsResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFlashcards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setFlashcardData(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'flashcard_generator',
          payload: { content },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setFlashcardData(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate flashcards.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during flashcard generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!flashcardData) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcardData.cards.length);
    }, 150);
  };

  const handlePrev = () => {
    if (!flashcardData) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcardData.cards.length) % flashcardData.cards.length);
    }, 150);
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'hard':
        return 'bg-red-950 text-red-400 border-red-800';
      case 'medium':
      default:
        return 'bg-amber-950 text-amber-400 border-amber-800';
    }
  };

  const currentCard: AIFlashcard | undefined = flashcardData?.cards[currentIndex];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Flashcard Deck</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Master complex concepts through AI-generated active recall flashcards.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
          Active Recall
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerateFlashcards} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Subject, Topic, or Study Notes
          </label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. Organic Chemistry Reactions, Operating System Deadlocks..."
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Cards...</span>
              </>
            ) : (
              <span>Create Flashcards</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Interactive Deck Area */}
      {flashcardData && currentCard && (
        <div className="mt-6 border-t border-slate-800 pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Subject: <span className="text-slate-200">{flashcardData.subject}</span>
            </span>
            <span className="text-xs font-bold text-indigo-400">
              Card {currentIndex + 1} of {flashcardData.cards.length}
            </span>
          </div>

          {/* 3D Card Display */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-64 cursor-pointer perspective-1000 group"
          >
            <div
              className={`relative w-full h-full rounded-2xl border transition-all duration-500 transform-style-3d shadow-xl p-8 flex flex-col justify-between ${
                isFlipped
                  ? 'bg-slate-950 border-indigo-600'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {isFlipped ? 'Answer / Back' : 'Question / Front'}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                    currentCard.difficulty
                  )}`}
                >
                  {currentCard.difficulty || 'medium'}
                </span>
              </div>

              <div className="my-auto text-center px-4">
                <p
                  className={`text-base sm:text-lg font-medium leading-relaxed ${
                    isFlipped ? 'text-indigo-200' : 'text-slate-100'
                  }`}
                >
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                  💡 Click to flip card
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              ← Previous
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Flip Card
            </button>

            <button
              onClick={handleNext}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
