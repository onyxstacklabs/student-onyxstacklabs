'use client';

import React from 'react';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

const actions: QuickAction[] = [
  {
    title: 'Submit Assignment',
    description: 'Upload pending coursework',
    icon: '📤',
    href: '/dashboard/courses',
    color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
  },
  {
    title: 'Join Live Session',
    description: 'Active virtual classroom',
    icon: '🎥',
    href: '/dashboard/courses',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  {
    title: 'Ask AI Tutor',
    description: 'Get instant study help',
    icon: '🤖',
    href: '/dashboard/ai-assistant',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  },
  {
    title: 'View Timetable',
    description: 'Check today’s schedule',
    icon: '📅',
    href: '/dashboard/progress',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
  },
];

export default function QuickActions() {
  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white tracking-tight">Quick Actions</h2>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`p-3 rounded-lg border transition-all flex items-center gap-3 ${action.color}`}
          >
            <span className="text-xl">{action.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{action.title}</p>
              <p className="text-[10px] text-slate-400 truncate">{action.description}</p>
            </div>
            <span className="text-xs opacity-60">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
