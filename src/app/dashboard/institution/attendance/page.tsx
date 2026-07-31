'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { markAttendance, getAttendanceForClass, AttendanceStatus, AttendanceRecord } from '@/lib/academics/attendance';
import { CalendarCheck, Check, X, Clock } from 'lucide-react';

function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function AttendanceManager() {
  const { user, profile } = useAuth();
  const institutionClasses = profile?.institutionDetails?.classes || [];

  const [selectedClass, setSelectedClass] = useState(institutionClasses[0] || '');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(todayDateString());

  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loaded, setLoaded] = useState(false);

  const loadClassStudents = async () => {
    if (!user?.uid || !selectedClass || !subject.trim()) {
      setError('Select a class, enter a subject, and pick a date first.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const [allStudents, existingRecords] = await Promise.all([
        getStudentsForInstitution(user.uid),
        getAttendanceForClass(user.uid, selectedClass, date),
      ]);

      const classStudents = allStudents.filter((s) => s.className === selectedClass);
      setStudents(classStudents);

      const initialStatus: Record<string, AttendanceStatus> = {};
      classStudents.forEach((s) => {
        const existing = existingRecords.find(
          (r) => r.studentUid === s.uid && r.subject === subject.trim()
        );
        initialStatus[s.uid] = existing?.status || 'PRESENT';
      });
      setStatusMap(initialStatus);
      setLoaded(true);
    } catch (e) {
      setError('Could not load students for this class.');
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (uid: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [uid]: status }));
  };

  const handleSaveAll = async () => {
    if (!user?.uid) return;
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await Promise.all(
        students.map((s) =>
          markAttendance(user.uid, s.uid, selectedClass, subject.trim(), statusMap[s.uid] || 'PRESENT', date)
        )
      );
      setSuccessMsg(`Attendance saved for ${students.length} student(s).`);
    } catch (e) {
      setError('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const statusStyles: Record<AttendanceStatus, string> = {
    PRESENT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    ABSENT: 'bg-red-500/10 text-red-400 border-red-500/30',
    LATE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <CalendarCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Mark Attendance</h1>
          <p className="text-sm text-slate-400">Select a class and subject to record today's attendance.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select class</option>
              {institutionClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Physics"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={loadClassStudents}
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      {loaded && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          {students.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No students found in this class.</p>
          ) : (
            <>
              <div className="space-y-2">
                {students.map((s) => (
                  <div
                    key={s.uid}
                    className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{s.displayName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{s.rollNumber}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setStatus(s.uid, 'PRESENT')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                          statusMap[s.uid] === 'PRESENT' ? statusStyles.PRESENT : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        <Check className="w-3 h-3" /> Present
                      </button>
                      <button
                        onClick={() => setStatus(s.uid, 'LATE')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                          statusMap[s.uid] === 'LATE' ? statusStyles.LATE : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" /> Late
                      </button>
                      <button
                        onClick={() => setStatus(s.uid, 'ABSENT')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                          statusMap[s.uid] === 'ABSENT' ? statusStyles.ABSENT : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        <X className="w-3 h-3" /> Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : `Save Attendance for ${students.length} Student(s)`}
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default function AttendancePage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <AttendanceManager />
    </ProtectedRoute>
  );
}
