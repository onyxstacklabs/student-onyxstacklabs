'use client';

import React from 'react';
import SubjectCard, { SubjectProps } from '@/components/subjects/SubjectCard';
import SemesterSelector from '@/components/subjects/SemesterSelector';
import Timetable from '@/components/subjects/Timetable';
import AttendanceTracker from '@/components/subjects/AttendanceTracker';

const mockSubjects: SubjectProps[] = [
  {
    id: 'cs101',
    code: 'CS-101',
    title: 'Advanced Next.js Architecture',
    instructor: 'Dr. Alex Vance',
    credits: 4,
    progress: 75,
    color: 'bg-indigo-500',
    nextClass: 'Today, 2:00 PM',
  },
  {
    id: 'cs202',
    code: 'CS-202',
    title: 'Cloud Systems & Firebase Security',
    instructor: 'Prof. Sarah Jenkins',
    credits: 3,
    progress: 40,
    color: 'bg-emerald-500',
    nextClass: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'ui301',
    code: 'UI-301',
    title: 'Enterprise UI/UX Systems',
    instructor: 'Elena Rostova',
    credits: 3,
    progress: 90,
    color: 'bg-purple-500',
    nextClass: 'Thursday, 11:30 AM',
  },
  {
    id: 'db401',
    code: 'DB-401',
    title: 'Scalable Database Engineering',
    instructor: 'Michael Chen',
    credits: 4,
    progress: 20,
    color: 'bg-amber-500',
    nextClass: 'Friday, 4:00 PM',
  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Semester Management Header */}
      <SemesterSelector />

      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Enrolled Subjects</h2>
          <p className="text-xs text-slate-400 mt-0.5">Overview of active semester courses</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow-sm">
            + Add New Subject
          </button>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockSubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {/* Attendance Tracker Section */}
      <AttendanceTracker />

      {/* Timetable Section */}
      <Timetable />
    </div>
  );
}
