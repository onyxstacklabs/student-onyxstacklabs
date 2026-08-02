'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getGradesForStudent, calculateGPA, calculateOverallPercentage, GradeRecord } from '@/lib/academics/grades';
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
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{isParent ? `${displayName}'s Grades` : 'My Grades'}</h1>
            <p className="text-sm text-slate-400">Recorded academic assessments and GPA.</p>
          </div>
        </div>
        {records.length > 0 && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        )}
      </div>

      {/* Print-only header */}
      <div className="hidden print:block text-black">
        <h1 className="text-xl font-bold">{isParent ? `${displayName}'s Grade Report` : 'My Grade Report'}</h1>
        <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg print:hidden">{error}</div>
      )}

      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center print:hidden">
          <p className="text-slate-500 text-sm">Loading grades...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-2 print:hidden">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No grades recorded yet.</h3>
          <p className="text-slate-500 text-xs">The institution hasn't entered any assessment results yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between print:border print:border-gray-300 print:bg-white print:text-black">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">GPA</p>
                <span className="text-4xl font-extrabold text-white mt-1 block print:text-black">{gpa.toFixed(2)}</span>
                <span className="text-slate-500 text-xs print:text-gray-600">out of 4.0</span>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl print:hidden">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between print:border print:border-gray-300 print:bg-white print:text-black">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">Overall Average</p>
                <span className="text-4xl font-extrabold text-white mt-1 block print:text-black">{overallPercentage}%</span>
                <span className="text-slate-500 text-xs print:text-gray-600">across {records.length} assessments</span>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl print:hidden">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, subjectRecords]) => (
              <div
                key={subject}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 print:border print:border-gray-300 print:bg-white print:text-black print:break-inside-avoid"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white print:text-black">{subject}</h3>
                  <span className="text-xs font-mono text-indigo-400 print:text-black">
                    {calculateOverallPercentage(subjectRecords)}% avg
                  </span>
                </div>
                <div className="space-y-1.5">
                  {subjectRecords.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg print:border-gray-200 print:bg-gray-50"
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
