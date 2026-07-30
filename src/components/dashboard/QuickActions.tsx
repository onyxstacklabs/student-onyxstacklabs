'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  roles?: string[];
}

export default function QuickActions() {
  const { profile } = useAuth();
  const currentRole = profile?.role || 'STUDENT';

  const actions: QuickAction[] = [
    {
      title: 'Ask AI Study Assistant',
      description: 'Summarize notes, generate quizzes & flashcards',
      icon: '🤖',
      href: '/dashboard/ai-assistant',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 focus:ring-purple-500/40',
      roles: ['STUDENT', 'ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'Campus Map & Transit',
      description: 'Real-time routes & EV charging status',
      icon: '🗺️',
      href: '/dashboard/mobility',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 focus:ring-indigo-500/40',
      roles: ['STUDENT', 'PARENT', 'ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'Emergency SOS & Safety',
      description: 'Trigger alerts & active campus safety dispatch',
      icon: '🚨',
      href: '/dashboard/governance',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 focus:ring-rose-500/40',
      roles: ['STUDENT', 'PARENT', 'ADMIN', 'SUPER_ADMIN'],
    },
    {
      title: 'My Notes & Workspace',
      description: 'Access Firestore saved lecture notes',
      icon: '📝',
      href: '/dashboard/notes',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 focus:ring-emerald-500/40',
      roles: ['STUDENT', 'ADMIN', 'SUPER_ADMIN'],
    },
  ];

  // Filter shortcuts according to active user role
  const filteredActions = actions.filter(
    (action) => !action.roles || action.roles.includes(currentRole)
  );

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 shadow-sm select-none">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="text-sm font-bold text-white tracking-tight">Quick Navigation</h2>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {filteredActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`p-3 rounded-xl border transition-all flex items-center gap-3 group focus:outline-none focus:ring-1 ${action.color}`}
          >
            <span className="text-xl shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
              {action.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                {action.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {action.description}
              </p>
            </div>
            <span className="text-xs opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
