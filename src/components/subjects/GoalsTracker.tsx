'use client';

import React from 'react';

interface Goal {
  id: string;
  title: string;
  category: 'GPA' | 'Certification' | 'Project' | 'Skill';
  targetDate: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'completed';
}

const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Achieve 3.8+ GPA in Fall 2026 Semester',
    category: 'GPA',
    targetDate: 'Dec 2026',
    progress: 85,
    status: 'on-track',
  },
  {
    id: 'g2',
    title: 'Complete Enterprise Next.js App Capstone',
    category: 'Project',
    targetDate: 'Aug 15, 2026',
    progress: 60,
    status: 'on-track',
  },
  {
    id: 'g3',
    title: 'Firebase Developer Professional Certification',
    category: 'Certification',
    targetDate: 'Sep 30, 2026',
    progress: 25,
    status: 'at-risk',
  },
];

export default function GoalsTracker() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Academic Goals & Targets</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Track long-term academic & skill benchmarks</p>
        </div>
        <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold rounded transition">
          + Set Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {mockGoals.map((goal) => {
          const statusBadge =
            goal.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : goal.status === 'at-risk'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

          return (
            <div
              key={goal.id}
              className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-lg space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {goal.category}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${statusBadge}`}>
                    {goal.status}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-slate-100 line-clamp-2">{goal.title}</h3>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">Target: {goal.targetDate}</span>
                  <span className="font-bold text-indigo-400">{goal.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
