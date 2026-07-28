'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'Courses', href: '/dashboard/courses', icon: '📚' },
  { label: 'Progress', href: '/dashboard/progress', icon: '📈' },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 p-4 shrink-0 justify-between h-full">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            S
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">Student Portal</h2>
            <span className="text-[10px] text-slate-400 font-mono">OnyxStack Labs</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Badge */}
      <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Enterprise Edition</p>
        <p className="text-[10px] text-slate-500 mt-0.5">v1.0.0 Phase 7 Active</p>
      </div>
    </aside>
  );
}
