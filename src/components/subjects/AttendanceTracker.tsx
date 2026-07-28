'use client';

import React from 'react';

interface AttendanceSubject {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  attended: number;
  total: number;
  percentage: number;
}

const attendanceData: AttendanceSubject[] = [
  {
    id: '1',
    subjectCode: 'CS-101',
    subjectTitle: 'Advanced Next.js Architecture',
    attended: 18,
    total: 20,
    percentage: 90,
  },
  {
    id: '2',
    subjectCode: 'CS-202',
    subjectTitle: 'Cloud Systems & Firebase Security',
    attended: 12,
    total: 16,
    percentage: 75,
  },
  {
    id: '3',
    subjectCode: 'UI-301',
    subjectTitle: 'Enterprise UI/UX Systems',
    attended: 14,
    total: 15,
    percentage: 93,
  },
  {
    id: '4',
    subjectCode: 'DB-401',
    subjectTitle: 'Scalable Database Engineering',
    attended: 9,
    total: 14,
    percentage: 64, // Low attendance trigger
  },
];

export default function AttendanceTracker() {
  const totalAttended = attendanceData.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendanceData.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      {/* Header with Overall Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Attendance Tracker</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Subject-wise class attendance & eligibility</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400">Overall Attendance:</span>
          <span className={`text-xs font-bold ${overallPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Attendance List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {attendanceData.map((item) => {
          const isWarning = item.percentage < 75;
          return (
            <div
              key={item.id}
              className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {item.subjectCode}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isWarning
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {item.percentage}% {isWarning && '⚠️ Low'}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.subjectTitle}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Classes: {item.attended} / {item.total} Attended</span>
                <span>{item.total - item.attended} Absents</span>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWarning ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
