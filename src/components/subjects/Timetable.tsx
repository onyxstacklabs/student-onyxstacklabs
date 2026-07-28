'use client';

import React from 'react';

interface ScheduleSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subjectCode: string;
  subjectTitle: string;
  room: string;
  color: string;
}

const timetableData: ScheduleSlot[] = [
  {
    id: 't1',
    day: 'Monday',
    time: '09:00 AM - 10:30 AM',
    subjectCode: 'CS-101',
    subjectTitle: 'Advanced Next.js Architecture',
    room: 'Lab 04',
    color: 'border-l-indigo-500 bg-indigo-500/10 text-indigo-300',
  },
  {
    id: 't2',
    day: 'Monday',
    time: '11:00 AM - 12:30 PM',
    subjectCode: 'UI-301',
    subjectTitle: 'Enterprise UI/UX Systems',
    room: 'Hall B',
    color: 'border-l-purple-500 bg-purple-500/10 text-purple-300',
  },
  {
    id: 't3',
    day: 'Tuesday',
    time: '10:00 AM - 11:30 AM',
    subjectCode: 'CS-202',
    subjectTitle: 'Cloud Systems & Firebase Security',
    room: 'Online - Live',
    color: 'border-l-emerald-500 bg-emerald-500/10 text-emerald-300',
  },
  {
    id: 't4',
    day: 'Wednesday',
    time: '02:00 PM - 03:30 PM',
    subjectCode: 'DB-401',
    subjectTitle: 'Scalable Database Engineering',
    room: 'Room 202',
    color: 'border-l-amber-500 bg-amber-500/10 text-amber-300',
  },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Weekly Timetable</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Class schedule and lecture locations</p>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
          Weekly View
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {days.map((day) => {
          const daySlots = timetableData.filter((slot) => slot.day === day);
          return (
            <div key={day} className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 space-y-3">
              <span className="text-xs font-bold text-slate-300 block border-b border-slate-800 pb-2">
                {day}
              </span>

              {daySlots.length === 0 ? (
                <p className="text-[10px] text-slate-600 py-2">No classes scheduled</p>
              ) : (
                daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-2.5 rounded-lg border-l-4 space-y-1 ${slot.color}`}
                  >
                    <span className="text-[10px] font-mono font-bold block opacity-90">
                      {slot.subjectCode}
                    </span>
                    <p className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {slot.subjectTitle}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{slot.time}</span>
                      <span className="font-mono text-slate-500">{slot.room}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
