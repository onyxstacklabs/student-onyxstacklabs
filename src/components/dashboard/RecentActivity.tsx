'use client';

import React from 'react';

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  time: string;
  status: 'completed' | 'pending' | 'urgent';
  icon: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    title: 'Submitted Next.js Architecture Assignment',
    category: 'Web Development 101',
    time: '2 hours ago',
    status: 'completed',
    icon: '✅',
  },
  {
    id: '2',
    title: 'Upcoming Quiz: Firestore Security Rules',
    category: 'Database Systems',
    time: 'Tomorrow, 10:00 AM',
    status: 'urgent',
    icon: '⏰',
  },
  {
    id: '3',
    title: 'New Lecture Uploaded: Tailwind Grid Systems',
    category: 'UI/UX Design',
    time: 'Yesterday',
    status: 'pending',
    icon: '📹',
  },
  {
    id: '4',
    title: 'Joined Mentorship Channel on Discord',
    category: 'Community',
    time: '2 days ago',
    status: 'completed',
    icon: '💬',
  },
];

export default function RecentActivity() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity & Tasks</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Your recent updates and upcoming deadlines</p>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
          Live Feed
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg flex items-center justify-between gap-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-indigo-400 font-medium">{item.category}</span>
                  <span className="text-[10px] text-slate-600">•</span>
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                </div>
              </div>
            </div>

            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 border ${
                item.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : item.status === 'urgent'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {item.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
