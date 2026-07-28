'use client';

import React, { useState } from 'react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  points: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  score?: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Build Enterprise App Shell & Auth Flow',
    subject: 'CS-101 (Next.js)',
    dueDate: 'Today, 11:59 PM',
    points: 100,
    status: 'pending',
  },
  {
    id: 'a2',
    title: 'Configure Firestore Security Rules & Indexes',
    subject: 'CS-202 (Cloud Systems)',
    dueDate: 'Jul 30, 2026',
    points: 50,
    status: 'pending',
  },
  {
    id: 'a3',
    title: 'Responsive Design System Documentation',
    subject: 'UI-301 (UI/UX Systems)',
    dueDate: 'Jul 25, 2026',
    points: 100,
    status: 'graded',
    score: '98 / 100',
  },
  {
    id: 'a4',
    title: 'Relational Schema Normalization Quiz',
    subject: 'DB-401 (Database)',
    dueDate: 'Jul 20, 2026',
    points: 20,
    status: 'overdue',
  },
];

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const filteredAssignments = mockAssignments.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Assignments & Submissions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track coursework deadlines, submissions, and grades</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['all', 'pending', 'graded'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments List Table/Card Grid */}
      <div className="space-y-3">
        {filteredAssignments.map((assignment) => {
          const isPending = assignment.status === 'pending';
          const isOverdue = assignment.status === 'overdue';
          const isGraded = assignment.status === 'graded';

          return (
            <div
              key={assignment.id}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {assignment.subject}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isPending
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : isOverdue
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{assignment.title}</h3>
                <p className="text-xs text-slate-400">Due Date: <span className="text-slate-300 font-mono">{assignment.dueDate}</span></p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Total Points</span>
                  <span className="text-xs font-bold text-slate-200">
                    {isGraded ? assignment.score : `${assignment.points} Pts`}
                  </span>
                </div>

                <button
                  disabled={isGraded}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isGraded
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  }`}
                >
                  {isGraded ? 'Graded' : 'Submit Work'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
