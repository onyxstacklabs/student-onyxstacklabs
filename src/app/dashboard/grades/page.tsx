'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getGradesForStudent, calculateGPA, calculateOverallPercentage, GradeRecord } from '@/lib/academics/grades';
import { GraduationCap, TrendingUp } from 'lucide-react';

function MyGrades() {
  const { user } = useAuth();

  const [records, setRecords] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setLoading(true);
    getGradesForStudent(user.uid)
      .then((data) => {
        if (mounted) setRecords(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load your grades.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const gpa = calculateGPA(records);
  const overallPercentage = calculateOverallPercentage(records);

  const bySubject = records.reduce<Record<string, GradeRecord[]>>((acc, r) => {
    acc[r.subject] = acc[r.subject] || [];
    acc[r.subject].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Grades</h1>
          <p className="text-sm text-slate-400">Your recorded academic assessments and GPA.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm">Loading your grades...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No grades recorded yet.</h3>
          <p className="text-slate-500 text-xs">Your institution hasn't entered any assessment results yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">GPA</p>
                <span className="text-4xl font-extrabold text-white mt-1 block">{gpa.toFixed(2)}</span>
                <span className="text-slate-500 text-xs">out of 4.0</span>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Overall Average</p>
                <span className="text-4xl font-extrabold text-white mt-1 block">{overallPercentage}%</span>
                <span className="text-slate-500 text-xs">across {records.length} assessments</span>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, subjectRecords]) => (
              <div key={subject} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{subject}</h3>
                  <span className="text-xs font-mono text-indigo-400">
                    {calculateOverallPercentage(subjectRecords)}% avg
                  </span>
                </div>
                <div className="space-y-1.5">
                  {subjectRecords.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                      <span className="text-slate-300">{r.assessmentName}</span>
                      <span className="text-slate-400 font-mono">
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
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT', 'TEACHER']}>
      <MyGrades />
    </ProtectedRoute>
  );
}
