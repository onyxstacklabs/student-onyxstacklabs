'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function TopNav() {
  const { profile, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 backdrop-blur-md z-20">
      {/* Search Input Control */}
      <div className="flex items-center gap-3 w-full max-w-xs sm:max-w-sm">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, resources, or emergency actions..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Search platform resources"
          />
          <span className="absolute left-3 top-2 text-slate-500 text-xs">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* User Actions & Profile Control */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-slate-200 transition rounded-lg hover:bg-slate-800/60 relative focus:outline-none focus:ring-1 focus:ring-slate-700"
            title="System Notifications"
            aria-label="View notifications"
          >
            <span className="text-sm">🔔</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-500 rounded-full ring-2 ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-3 z-30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">System Alerts</span>
                <span className="text-[10px] text-indigo-400 font-mono">Live</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All security systems and dynamic modules are operational.
              </p>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-slate-800"></div>

        {/* Dynamic User Profile Identifier */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-200 leading-tight">
              {profile?.displayName || 'Active Member'}
            </p>
            <p className="text-[10px] text-indigo-400 font-mono tracking-wider">
              {profile?.role || 'STUDENT'}
            </p>
          </div>

          <div 
            className="h-8 w-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0"
            aria-hidden="true"
          >
            {profile?.displayName ? profile.displayName.charAt(0) : 'U'}
          </div>

          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-rose-400 transition px-2.5 py-1 rounded-lg border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10"
            title="Sign out of your session"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
