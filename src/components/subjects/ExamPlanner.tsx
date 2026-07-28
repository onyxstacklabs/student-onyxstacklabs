'use client';

import React from 'react';

interface Exam {
  id: string;
  title: string;
  subjectCode: string;
  date: string;
  time: string;
  room: string;
  weightage: number;
  daysRemaining: number;
}

const mockExams: Exam[] = [
  {
    id: 'e1',
    title: 'Midterm Practical Exam',
    subjectCode: 'CS-101',
    date: 'Aug 05, 2026',
    time: '10:00 AM - 12:00 PM',
    room: 'Lab 02',
    weightage: 25,
    daysRemaining: 8,
  },
  {
    id: 'e2',
    title: 'Cloud Security Quiz 2',
    subjectCode: 'CS-202',
    date: 'Aug 12, 2026',
    time: '11:30 AM - 12:30 PM',
    room: 'Hall A',
    weightage: 10,
    daysRemaining: 15,
  },
  {
    id: 'e3',
    title: 'Database Schema Design Final Evaluation',
    subjectCode: 'DB-401',
    date: 'Aug 20, 2026',
    time: '02:00 PM - 05:00 PM',
    room: 'Auditorium 1',
    weightage: 40,
    daysRemaining: 23,
  },
];

export default function ExamPlanner() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Exam & Evaluation Schedule</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Upcoming midterms, finals, and weightage tracking</p>
        </div>
        <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold rounded transition">
          + Add Exam
        </button>
      </div>

      <div className="space-y-3">
        {mockExams.map((exam) => (
          <div
            key={exam.id}
            className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {exam.subjectCode}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Weight: {exam.weightage}%
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">{exam.title}</h3>
              <p className="text-[10px] text-slate-400">
                Venue: <span className="text-slate-300 font-mono">{exam.room}</span> • {exam.time}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-500 block font-mono">{exam.date}</span>
                <span className="text-xs font-bold text-indigo-400">
                  In {exam.daysRemaining} days
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
