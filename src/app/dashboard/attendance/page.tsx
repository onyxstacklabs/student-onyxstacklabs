'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  getAttendanceForStudent,
  calculateAttendancePercentage,
  AttendanceRecord,
  AttendanceStatus,
} from '@/lib/academics/attendance';
import { CalendarCheck, Check, X, Clock, TrendingUp } from 'lucide-react';

function MyAttendance() {
  const { user } = useAuth();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setLoading(true);
    getAttendanceForStudent(user.uid)
      .then((data) => {
        if (mounted) setRecords(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load your attendance record.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const overallPercentage = calculateAttendancePercentage(records);

  const bySubject = records.reduce<Record<string, AttendanceRecord[]>>((acc, r) => {
    acc[r.subject] = acc[r.subject] || [];
    acc[r.subject].push(r);
    return acc;
  }, {});

  const statusIcon: Record<AttendanceStatus, React.ReactNode> = {
    PRESENT: <Check className="w-3.5 h-3.5 text-emerald-400" />,
    LATE: <Clock className="w-3.5 h-3.5 text-amber-400" />,
    ABSENT: <X className="w-3.5 h-3.5 text-red-400" />,
  };

  const statusLabel: Record<AttendanceStatus, string> = {
    PRESENT: 'Present',
    LATE: 'Late',
    ABSENT: 'Absent',
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Attendance</h1>
          <p className="text-sm text-slate-400">Your recorded attendance across all subjects.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm">Loading your attendance...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-2">
          <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No attendance recorded yet.</h3>
          <p className="text-slate-500 text-xs">Your institution hasn't marked any sessions for you yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Overall Attendance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-4xl font-extrabold ${
                    overallPercentage >= 75 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {overallPercentage}%
                </span>
                <span className="text-slate-400 text-sm">across {records.length} sessions</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, subjectRecords]) => (
              <div key={subject} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{subject}</h3>
                  <span className="text-xs font-mono text-indigo-400">
                    {calculateAttendancePercentage(subjectRecords)}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {subjectRecords.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{r.date}</span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        {statusIcon[r.status]} {statusLabel[r.status]}
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

export default function AttendancePage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT', 'TEACHER']}>
      <MyAttendance />
    </ProtectedRoute>
  );
}
