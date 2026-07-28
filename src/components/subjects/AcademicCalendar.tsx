'use client';

import React from 'react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'deadline' | 'milestone' | 'exam';
  description: string;
}

const mockEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'Mid-Semester Break',
    date: 'Aug 14, 2026',
    type: 'holiday',
    description: 'University closed for Independence Day & Mid-term Recess.',
  },
  {
    id: 'e2',
    title: 'Project Capstone Proposal Submission',
    date: 'Aug 25, 2026',
    type: 'deadline',
    description: 'Final date to submit enterprise project architecture documents.',
  },
  {
    id: 'e3',
    title: 'Fall Semester Final Exams Begin',
    date: 'Sep 10, 2026',
    type: 'exam',
    description: 'Comprehensive examinations start across all departments.',
  },
];

export default function AcademicCalendar() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Academic Calendar & Events</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Important term dates, holidays, and deadlines</p>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
          Fall 2026
        </span>
      </div>

      <div className="space-y-3">
        {mockEvents.map((event) => {
          const typeBadge =
            event.type === 'holiday'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : event.type === 'deadline'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

          return (
            <div
              key={event.id}
              className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${typeBadge}`}>
                    {event.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-100">{event.title}</h3>
                <p className="text-[11px] text-slate-400">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
