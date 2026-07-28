'use client';

import React, { useState } from 'react';
import { AIStudyPlannerResponse, AIStudyDayPlan } from '@/types/ai';

export function AIStudyPlanner() {
  const [subject, setSubject] = useState('');
  const [daysAvailable, setDaysAvailable] = useState<number>(7);
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<AIStudyPlannerResponse | null>(null);
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPlanResult(null);
    setCompletedDays({});

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'study_planner',
          payload: { subject, daysAvailable, hoursPerDay },
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setPlanResult(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate study plan.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDayCompletion = (dayNumber: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  const getProgressPercentage = () => {
    if (!planResult || planResult.schedule.length === 0) return 0;
    const doneCount = Object.values(completedDays).filter(Boolean).length;
    return Math.round((doneCount / planResult.schedule.length) * 100);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Study Schedule Planner</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate customized day-by-day revision timetables optimized for your exam timeline.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
          Smart Scheduling
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGeneratePlanner} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Subject / Exam Goal
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Calculus II Final, CS50 Exam..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Days Available
            </label>
            <select
              value={daysAvailable}
              onChange={(e) => setDaysAvailable(Number(e.target.value))}
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days (1 Week)</option>
              <option value={14}>14 Days (2 Weeks)</option>
              <option value={30}>30 Days (1 Month)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Hours per Day
            </label>
            <select
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            >
              <option value={1}>1 Hour/day</option>
              <option value={2}>2 Hours/day</option>
              <option value={3}>3 Hours/day</option>
              <option value={5}>5 Hours/day</option>
              <option value={8}>8 Hours/day</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !subject.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Schedule...</span>
              </>
            ) : (
              <span>Build Study Plan</span>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Plan Output */}
      {planResult && (
        <div className="mt-6 border-t border-slate-800 pt-6 space-y-6">
          {/* Summary & Progress Banner */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-slate-100">{planResult.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{planResult.overview}</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-slate-400 block font-semibold">Overall Progress</span>
                <span className="text-xl font-black text-indigo-400">
                  {getProgressPercentage()}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Schedule Days Grid */}
          <div className="space-y-4">
            {planResult.schedule.map((day: AIStudyDayPlan) => {
              const isDone = !!completedDays[day.day];

              return (
                <div
                  key={day.day}
                  className={`p-4 rounded-xl border transition-colors ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-800/60'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleDayCompletion(day.day)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-indigo-500'
                        }`}
                      >
                        {isDone ? '✓' : ''}
                      </button>
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Day {day.day}
                        </span>
                        <h5
                          className={`text-sm font-semibold ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {day.focusTopic}
                        </h5>
                      </div>
                    </div>

                    <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-full font-medium shrink-0">
                      ⏱ {day.estimatedHours} hrs
                    </span>
                  </div>

                  <div className="mt-3 pl-9 space-y-2">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Tasks & Modules:
                      </span>
                      <ul className="space-y-1">
                        {day.tasks.map((task, tIdx) => (
                          <li
                            key={tIdx}
                            className={`text-xs flex items-center space-x-2 ${
                              isDone ? 'text-slate-600' : 'text-slate-300'
                            }`}
                          >
                            <span className="text-indigo-500">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {day.milestone && (
                      <div className="mt-2 text-[11px] text-amber-400/90 font-medium bg-amber-950/30 border border-amber-900/50 px-3 py-1.5 rounded-lg inline-block">
                        🎯 Daily Goal: {day.milestone}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
