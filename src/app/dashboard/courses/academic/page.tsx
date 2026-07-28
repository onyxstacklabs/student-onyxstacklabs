'use client';

import React from 'react';
import GoalsTracker from '@/components/subjects/GoalsTracker';
import ExamPlanner from '@/components/subjects/ExamPlanner';
import AcademicCalendar from '@/components/subjects/AcademicCalendar';

export default function AcademicOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Academic Overview & Milestones</h2>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive view of goals, exam schedules, and academic events</p>
        </div>
      </div>

      {/* Goals Section */}
      <GoalsTracker />

      {/* Grid Section for Exams and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExamPlanner />
        <AcademicCalendar />
      </div>
    </div>
  );
}
