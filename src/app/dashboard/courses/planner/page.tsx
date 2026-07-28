'use client';

import React from 'react';
import HomeworkPlanner from '@/components/subjects/HomeworkPlanner';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationHours: number;
  timeSlot: string;
  status: 'planned' | 'completed' | 'in-progress';
}

const mockSessions: StudySession[] = [
  {
    id: 's1',
    subject: 'CS-101',
    topic: 'Server Components & Streaming SSR',
    durationHours: 2,
    timeSlot: '04:00 PM - 06:00 PM',
    status: 'completed',
  },
  {
    id: 's2',
    subject: 'CS-202',
    topic: 'Firebase Security Rules & RBAC Configuration',
    durationHours: 1.5,
    timeSlot: '07:30 PM - 09:00 PM',
    status: 'in-progress',
  },
  {
    id: 's3',
    subject: 'DB-401',
    topic: 'Database Indexing & Query Optimization',
    durationHours: 2,
    timeSlot: '10:00 PM - 12:00 AM',
    status: 'planned',
  },
];

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Study Planner & Focus Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Organize daily study blocks, tasks, and focus sessions</p>
        </div>

        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow-sm">
          + Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework Tasks Column (1 Col) */}
        <div className="lg:col-span-1">
          <HomeworkPlanner />
        </div>

        {/* Scheduled Focus Sessions Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Today&apos;s Focus Schedule</h3>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                Total Focus Target: 5.5 Hours
              </span>
            </div>

            <div className="space-y-3">
              {mockSessions.map((session) => {
                const statusStyle =
                  session.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : session.status === 'in-progress'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700';

                return (
                  <div
                    key={session.id}
                    className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-400">
                          {session.subject}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${statusStyle}`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">{session.topic}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                      <span className="font-mono text-slate-300">⏱ {session.durationHours} hrs</span>
                      <span className="font-mono text-slate-500">{session.timeSlot}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
