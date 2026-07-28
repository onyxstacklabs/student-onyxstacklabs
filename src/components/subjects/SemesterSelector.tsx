'use client';

import React, { useState } from 'react';

interface Semester {
  id: string;
  name: string;
  year: string;
  status: 'active' | 'completed' | 'upcoming';
  totalCredits: number;
  gpa?: number;
}

const mockSemesters: Semester[] = [
  { id: 'sem-fall-2026', name: 'Fall 2026', year: '2026', status: 'active', totalCredits: 14, gpa: 3.85 },
  { id: 'sem-spring-2026', name: 'Spring 2026', year: '2026', status: 'completed', totalCredits: 16, gpa: 3.70 },
  { id: 'sem-fall-2025', name: 'Fall 2025', year: '2025', status: 'completed', totalCredits: 15, gpa: 3.65 },
];

export default function SemesterSelector() {
  const [selectedSemester, setSelectedSemester] = useState<string>('sem-fall-2026');

  const currentSem = mockSemesters.find((s) => s.id === selectedSemester) || mockSemesters[0];

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-lg">
          🎓
        </div>
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Academic Term</span>
          <div className="flex items-center gap-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
            >
              {mockSemesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name} ({sem.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
        <div>
          <p className="text-[10px] text-slate-400">Total Credits</p>
          <p className="text-sm font-bold text-white">{currentSem.totalCredits} Cr</p>
        </div>
        <div className="h-8 w-px bg-slate-800" />
        <div>
          <p className="text-[10px] text-slate-400">Term GPA</p>
          <p className="text-sm font-bold text-emerald-400">{currentSem.gpa ? `${currentSem.gpa} / 4.0` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
