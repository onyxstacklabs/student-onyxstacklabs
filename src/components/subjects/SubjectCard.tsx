'use client';

import React from 'react';
import Link from 'next/link';

export interface SubjectProps {
  id: string;
  code: string;
  title: string;
  instructor: string;
  credits: number;
  progress: number;
  color: string;
  nextClass?: string;
}

export default function SubjectCard({ subject }: { subject: SubjectProps }) {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
            {subject.code}
          </span>
          <span className="text-xs text-slate-400">{subject.credits} Credits</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">
          {subject.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Instructor: <span className="text-slate-300">{subject.instructor}</span>
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-400">Course Progress</span>
            <span className="font-semibold text-indigo-400">{subject.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${subject.color} rounded-full transition-all duration-500`}
              style={{ width: `${subject.progress}%` }}
            />
          </div>
        </div>

        {/* Card Footer / Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            {subject.nextClass || 'No upcoming class'}
          </span>
          <Link
            href={`/dashboard/courses/${subject.id}`}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
