'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { getAttendanceForStudent, calculateAttendancePercentage } from '@/lib/academics/attendance';
import { getGradesForStudent, calculateGPA } from '@/lib/academics/grades';
import { Users, CalendarCheck, GraduationCap, ArrowRight } from 'lucide-react';

function ParentOverview() {
  const { profile } = useAuth();
  const parentDetails = profile?.parentDetails;

  const [attendancePercent, setAttendancePercent] = useState<number | null>(null);
  const [gpa, setGpa] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentDetails?.linkedStudentUid) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    Promise.all([
      getAttendanceForStudent(parentDetails.linkedStudentUid),
      getGradesForStudent(parentDetails.linkedStudentUid),
    ])
      .then(([attendance, grades]) => {
        if (!mounted) return;
        setAttendancePercent(calculateAttendancePercentage(attendance));
        setGpa(calculateGPA(grades));
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [parentDetails?.linkedStudentUid]);

  if (!parentDetails) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-sm text-slate-400">
        Your parent profile isn't linked to a student yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-2 sm:p-0">
      <PageHeader
        icon={Users}
        title={`${parentDetails.linkedStudentName}'s Overview`}
        description="A read-only view of your child's academic progress."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          label="Attendance"
          value={loading || attendancePercent === null ? '—' : attendancePercent}
          unit="%"
          icon={CalendarCheck}
          tone={attendancePercent !== null && attendancePercent >= 75 ? 'success' : 'danger'}
          loading={loading}
        />
        <StatCard
          label="GPA"
          value={loading || gpa === null ? '—' : gpa.toFixed(2)}
          unit="/ 4.0"
          icon={GraduationCap}
          tone="brand"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/attendance"
          className="block p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-rose-500/40 rounded-card transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">View detailed attendance</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>
        </Link>
        <Link
          href="/dashboard/grades"
          className="block p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-violet-500/40 rounded-card transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">View detailed grades</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['PARENT']}>
      <ParentOverview />
    </ProtectedRoute>
  );
}
