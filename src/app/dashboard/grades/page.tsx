'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getGradesForStudent, calculateGPA, calculateOverallPercentage, GradeRecord } from '@/lib/academics/grades';
import { PageHeader } from '@/components/ui/PageHeader';
import { GraduationCap, TrendingUp, Printer } from 'lucide-react';

function MyGrades() {
  const { user, profile, role } = useAuth();

  const isParent = role === 'PARENT';
  const targetUid = isParent ? profile?.parentDetails?.linkedStudentUid : user?.uid;
  const displayName = isParent ? profile?.parentDetails?.linkedStudentName : 'Your';

  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!targetUid) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    getGradesForStudent(targetUid)
      .then((data) => {
        if (mounted) setRecords(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load grades.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [targetUid]);

  const gpa = calculateGPA(records);
  const overallPercentage = calculateOverallPercentage(records);

  const bySubject = records.reduce<Record<string, GradeRecord[]>>((acc, r) => {
    acc[r.subject] = acc[r.subject] || [];
    acc[r.subject].push(r);
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:max-w-none">
      <div className="print:hidden">
        <PageHeader
          icon={GraduationCap}
          title={isParent ? `${displayName}'s Grades` : 'My Grades'}
          description="Recorded academic assessments and GPA."
          actions={
            records.length > 0 ? (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Print-only header */}
      <div className="hidden print:block text-black">
        <h1 className="text-xl font-bold">{isParent ? `${displayName}'s Grade Report` : 'My Grade Report'}</h1>
        <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg print:hidden">{error}</div>
      )}

      {loading ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center print:hidden">
          <p className="text-slate-500 text-sm">Loading grades...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center space-y-2 print:hidden">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No grades recorded yet.</h3>
          <p className="text-slate-500 text-xs">The institution hasn't entered any assessment results yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            <div className="bg-surface-raised/80 border border-surface-border rounded-card p-6 flex items-center justify-between print:border print:border-gray-300 print:bg-white print:text-black">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">GPA</p>
                <span className="text-4xl font-extrabold text-white mt-1 block print:text-black">{gpa.toFixed(2)}</span>
                <span className="text-slate-500 text-xs print:text-gray-600">out of 4.0</span>
              </div>
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl print:hidden">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-surface-raised/80 border border-surface-border rounded-card p-6 flex items-center justify-between print:border print:border-gray-300 print:bg-white print:text-black">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">Overall Average</p>
                <span className="text-4xl font-extrabold text-white mt-1 block print:text-black">{overallPercentage}%</span>
                <span className="text-slate-500 text-xs print:text-gray-600">across {records.length} assessments</span>
              </div>
              <div className="p-3 bg-accent-success/10 border border-accent-success/20 text-accent-success rounded-xl print:hidden">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, subjectRecords]) => (
              <div
                key={subject}
                className="bg-surface-raised border border-surface-border rounded-card p-5 space-y-3 print:border print:border-gray-300 print:bg-white print:text-black print:break-inside-avoid"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white print:text-black">{subject}</h3>
                  <span className="text-xs font-mono text-brand-400 print:text-black">
                    {calculateOverallPercentage(subjectRecords)}% avg
                  </span>
                </div>
                <div className="space-y-1.5">
                  {subjectRecords.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between text-xs p-2.5 bg-surface-base border border-surface-border rounded-lg print:border-gray-200 print:bg-gray-50"
                    >
                      <span className="text-slate-300 print:text-black">{r.assessmentName}</span>
                      <span className="text-slate-400 font-mono print:text-black">
                        {r.marksObtained} / {r.totalMarks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GradesPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
      <MyGrades />
    </ProtectedRoute>
  );
}
