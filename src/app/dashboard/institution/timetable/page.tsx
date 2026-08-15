'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  addTimetableEntry,
  getTimetableForClass,
  deleteTimetableEntry,
  DAYS_OF_WEEK,
  DayOfWeek,
  TimetableEntry,
} from '@/lib/academics/timetable';
import { PageHeader } from '@/components/ui/PageHeader';
import { CalendarClock, Plus, Trash2 } from 'lucide-react';

function TimetableManager() {
  const { user, profile } = useAuth();
  const institutionClasses = profile?.institutionDetails?.classes || [];

  const [selectedClass, setSelectedClass] = useState(institutionClasses[0] || '');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [room, setRoom] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid || !selectedClass) {
      setEntries([]);
      return;
    }
    let mounted = true;
    setLoading(true);
    getTimetableForClass(user.uid, selectedClass)
      .then((data) => {
        if (mounted) setEntries(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load timetable.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid, selectedClass]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.uid || !selectedClass || !startTime || !endTime || !subject.trim()) {
      setError('Please fill class, day, time, and subject.');
      return;
    }
    if (startTime >= endTime) {
      setError('Start time must be before end time.');
      return;
    }

    setSaving(true);
    try {
      const created = await addTimetableEntry(
        user.uid,
        selectedClass,
        day,
        startTime,
        endTime,
        subject.trim(),
        teacherName.trim() || undefined,
        room.trim() || undefined
      );
      setEntries((prev) =>
        [...prev, created].sort((a, b) => {
          const dayDiff = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
          if (dayDiff !== 0) return dayDiff;
          return a.startTime.localeCompare(b.startTime);
        })
      );
      setStartTime('');
      setEndTime('');
      setSubject('');
      setTeacherName('');
      setRoom('');
    } catch (err) {
      setError('Failed to add timetable entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previous = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteTimetableEntry(id);
    } catch (err) {
      setError('Failed to delete entry.');
      setEntries(previous);
    }
  };

  const inputClass =
    'w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500';
  const labelClass = 'block text-xs font-mono text-slate-400 uppercase mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader icon={CalendarClock} title="Manage Timetable" description="Build the weekly class schedule." />

      <div>
        <label className={labelClass}>Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className={inputClass}
        >
          <option value="">Select class</option>
          {institutionClasses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>
      )}

      {selectedClass && (
        <>
          <form onSubmit={handleAddEntry} className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-400" /> Add Period
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Day</label>
                <select value={day} onChange={(e) => setDay(e.target.value as DayOfWeek)} className={inputClass}>
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Physics"
                />
              </div>
              <div>
                <label className={labelClass}>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Teacher (optional)</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Mr. Ahmed"
                />
              </div>
              <div>
                <label className={labelClass}>Room (optional)</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Room 204"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Period'}
            </button>
          </form>

          <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-2">
            <h2 className="text-sm font-bold text-white">Weekly Schedule — {selectedClass}</h2>
            {loading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No periods added yet.</p>
            ) : (
              <div className="space-y-2 pt-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-surface-base border border-surface-border rounded-xl"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">
                        {entry.day} · {entry.startTime}–{entry.endTime}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {entry.subject}
                        {entry.teacherName ? ` · ${entry.teacherName}` : ''}
                        {entry.room ? ` · ${entry.room}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-500 hover:text-accent-danger p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default function TimetablePage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <TimetableManager />
    </ProtectedRoute>
  );
}
