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
import { PageHeader } from '@/components/ui/PageHeader';
import { CalendarCheck, Check, X, Clock, TrendingUp, Printer } from 'lucide-react';

function MyAttendance() {
  const { user, profile, role } = useAuth();

  const isParent = role === 'PARENT';
  const targetUid = isParent ? profile?.parentDetails?.linkedStudentUid : user?.uid;
  const displayName = isParent ? profile?.parentDetails?.linkedStudentName : 'Your';

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!targetUid) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    getAttendanceForStudent(targetUid)
      .then((data) => {
        if (mounted) setRecords(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load attendance record.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [targetUid]);

  const overallPercentage = calculateAttendancePercentage(records);

  const bySubject = records.reduce<Record<string, AttendanceRecord[]>>((acc, r) => {
    acc[r.subject] = acc[r.subject] || [];
    acc[r.subject].push(r);
    return acc;
  }, {});

  const statusIcon: Record<AttendanceStatus, React.ReactNode> = {
    PRESENT: <Check className="w-3.5 h-3.5 text-accent-success" />,
    LATE: <Clock className="w-3.5 h-3.5 text-accent-warning" />,
    ABSENT: <X className="w-3.5 h-3.5 text-accent-danger" />,
  };

  const statusLabel: Record<AttendanceStatus, string> = {
    PRESENT: 'Present',
    LATE: 'Late',
    ABSENT: 'Absent',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 print:max-w-none">
      <div className="print:hidden">
        <PageHeader
          icon={CalendarCheck}
          title={isParent ? `${displayName}'s Attendance` : 'My Attendance'}
          description="Recorded attendance across all subjects."
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
        <h1 className="text-xl font-bold">{isParent ? `${displayName}'s Attendance Report` : 'My Attendance Report'}</h1>
        <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg print:hidden">{error}</div>
      )}

      {loading ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center print:hidden">
          <p className="text-slate-500 text-sm">Loading attendance...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-surface-raised/40 border border-surface-border/80 rounded-card p-12 text-center space-y-2 print:hidden">
          <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No attendance recorded yet.</h3>
          <p className="text-slate-500 text-xs">The institution hasn't marked any sessions yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-surface-raised/80 border border-surface-border rounded-card p-6 flex items-center justify-between print:border print:border-gray-300 print:bg-white print:text-black">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider print:text-gray-600">Overall Attendance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-4xl font-extrabold print:text-black ${
                    overallPercentage >= 75 ? 'text-accent-success' : 'text-accent-danger'
                  }`}
                >
                  {overallPercentage}%
                </span>
                <span className="text-slate-400 text-sm print:text-gray-600">across {records.length} sessions</span>
              </div>
            </div>
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl print:hidden">
              <TrendingUp className="w-6 h-6" />
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
                    {calculateAttendancePercentage(subjectRecords)}%
                  </span>
                </div>
                <div className="space-y-1.5">
                  {subjectRecords.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 print:text-gray-600">{r.date}</span>
                      <span className="flex items-center gap-1.5 text-slate-300 print:text-black">
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
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT']}>
      <MyAttendance />
    </ProtectedRoute>
  );
}
