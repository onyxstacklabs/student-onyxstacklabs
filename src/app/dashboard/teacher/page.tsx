'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { GraduationCap, Users, BookOpen, CalendarCheck } from 'lucide-react';

function TeacherOverview() {
  const { profile } = useAuth();
  const teacherDetails = profile?.teacherDetails;

  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teacherDetails?.institutionId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    getStudentsForInstitution(teacherDetails.institutionId)
      .then((data) => {
        if (mounted) {
          const myStudents = data.filter((s) => teacherDetails.assignedClasses.includes(s.className));
          setStudents(myStudents);
        }
      })
      .catch(() => {
        if (mounted) setError('Could not load your students.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [teacherDetails]);

  const studentsByClass = (teacherDetails?.assignedClasses || []).map((className) => ({
    className,
    count: students.filter((s) => s.className === className).length,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      <PageHeader
        icon={GraduationCap}
        title={`Welcome, ${profile?.displayName || 'Teacher'}`}
        description="Here's an overview of your classes and students."
      />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">
          {error}
        </div>
      )}

      {!teacherDetails ? (
        <div className="p-8 bg-surface-raised/60 border border-surface-border rounded-card text-center">
          <p className="text-sm text-slate-400">Your teacher profile isn't fully set up yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              label="Your Classes"
              value={teacherDetails.assignedClasses.length}
              icon={BookOpen}
              tone="brand"
              loading={loading}
            />
            <StatCard
              label="Total Students"
              value={students.length}
              icon={Users}
              tone="success"
              loading={loading}
            />
            <StatCard
              label="Subjects"
              value={teacherDetails.subjects.length || 0}
              icon={GraduationCap}
              tone="info"
              loading={loading}
            />
          </div>

          <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Your Classes</h2>
            {loading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
            ) : studentsByClass.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No classes assigned yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentsByClass.map((c) => (
                  <div
                    key={c.className}
                    className="p-4 bg-surface-base border border-surface-border rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{c.className}</p>
                      <p className="text-xs text-slate-500">{c.count} students</p>
                    </div>
                    <CalendarCheck className="w-5 h-5 text-brand-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <TeacherOverview />
    </ProtectedRoute>
  );
}
