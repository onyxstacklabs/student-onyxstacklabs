'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function TopNav() {
  const { profile, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between shrink-0 sticky top-0 backdrop-blur-md z-10">
      {/* Left: Search Placeholder */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search courses, tasks..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Right: User Menu & Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Icon Placeholder */}
        <button className="p-2 text-slate-400 hover:text-slate-200 transition rounded-lg hover:bg-slate-800/50 relative">
          <span className="text-sm">🔔</span>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800"></div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-tight">
              {profile?.displayName || 'Student User'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              {profile?.role || 'STUDENT'}
            </p>
          </div>

          <div className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
            {profile?.displayName?.charAt(0) || 'U'}
          </div>

          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-red-400 transition ml-1 px-2 py-1 rounded hover:bg-slate-800/50"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
