'use client';

import React, { useState } from 'react';
import { AIQuizResponse, AIQuizQuestion } from '@/types/ai';

export function AIQuizGenerator() {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<AIQuizResponse | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setShowResults(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'quiz_generator',
          payload: { topic, questionCount },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setQuiz(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate quiz.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during quiz generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (showResults) return; // Prevent changing answers after submitting
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Quiz Generator</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your knowledge with auto-generated multiple-choice practice quizzes.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
          Interactive Assessment
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerateQuiz} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Topic or Content
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Data Structures, Cell Biology, Microeconomics..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <span>Create Practice Quiz</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Quiz Area */}
      {quiz && (
        <div className="mt-6 border-t border-slate-800 pt-6 space-y-6">
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-100">{quiz.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Estimated time: {quiz.estimatedTimeMinutes} mins • {quiz.questions.length} questions
              </p>
            </div>
            {showResults && (
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  Your Score
                </span>
                <span className="text-lg font-extrabold text-indigo-400">
                  {calculateScore()} / {quiz.questions.length}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q: AIQuizQuestion, index: number) => {
              const selectedIdx = userAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;

              return (
                <div
                  key={q.id || index}
                  className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl space-y-4"
                >
                  <h5 className="text-sm font-semibold text-slate-200">
                    <span className="text-indigo-400 mr-2">Q{index + 1}.</span>
                    {q.question}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((option: string, optIdx: number) => {
                      let btnStyle =
                        'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                      if (selectedIdx === optIdx) {
                        btnStyle = 'bg-indigo-950 border-indigo-600 text-indigo-300 font-medium';
                      }

                      if (showResults) {
                        if (optIdx === q.correctOptionIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                        } else if (selectedIdx === optIdx) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                        } else {
                          btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left p-3 text-xs rounded-lg border transition-colors flex items-center justify-between ${btnStyle}`}
                          disabled={showResults}
                        >
                          <span>{option}</span>
                          {showResults && optIdx === q.correctOptionIndex && (
                            <span className="text-emerald-400 text-xs font-bold">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {showResults && (
                    <div className="mt-3 p-3 bg-slate-900 border border-slate-800/80 rounded-lg text-xs text-slate-400">
                      <span className="font-bold text-slate-300 block mb-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setQuiz(null);
                setUserAnswers({});
                setShowResults(false);
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors"
            >
              Reset Quiz
            </button>

            {!showResults ? (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(userAnswers).length < quiz.questions.length}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Submit Answers
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-medium">
                Quiz Completed! Review explanations above.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
