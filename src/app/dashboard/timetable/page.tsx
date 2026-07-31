'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getTimetableForClass, DAYS_OF_WEEK, TimetableEntry } from '@/lib/academics/timetable';
import { CalendarClock } from 'lucide-react';

function MyTimetable() {
  const { profile } = useAuth();
  const institutionId = profile?.studentDetails?.institutionId;
  const className = profile?.studentDetails?.className;

  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!institutionId || !className) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    getTimetableForClass(institutionId, className)
      .then((data) => {
        if (mounted) setEntries(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load your timetable.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [institutionId, className]);

  const byDay = DAYS_OF_WEEK.map((day) => ({
    day,
    periods: entries.filter((e) => e.day === day),
  })).filter((d) => d.periods.length > 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <CalendarClock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Timetable</h1>
          <p className="text-sm text-slate-400">
            {className ? `Weekly schedule for ${className}` : 'Your weekly class schedule.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}

      {!institutionId || !className ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-2">
          <CalendarClock className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">Institution not linked.</h3>
          <p className="text-slate-500 text-xs">Your profile isn't linked to an institution yet.</p>
        </div>
      ) : loading ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center">
          <p className="text-slate-500 text-sm">Loading your timetable...</p>
        </div>
      ) : byDay.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-2">
          <CalendarClock className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-base">No schedule published yet.</h3>
          <p className="text-slate-500 text-xs">Your institution hasn't set up the timetable for your class yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {byDay.map(({ day, periods }) => (
            <div key={day} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h3 className="text-sm font-bold text-white">{day}</h3>
              <div className="space-y-1.5">
                {periods.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg"
                  >
                    <span className="text-slate-300 font-mono">
                      {entry.startTime}–{entry.endTime}
                    </span>
                    <span className="text-white font-medium">{entry.subject}</span>
                    <span className="text-slate-500">
                      {entry.teacherName}
                      {entry.room ? ` · ${entry.room}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TimetablePage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT', 'TEACHER']}>
      <MyTimetable />
    </ProtectedRoute>
  );
}
