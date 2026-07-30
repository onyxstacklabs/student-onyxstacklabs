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
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖' },
  { label: 'Notes Workspace', href: '/dashboard/notes', icon: '📝' },
  { label: 'Campus Mobility', href: '/dashboard/mobility', icon: '📍' },
  { label: 'Safety & Governance', href: '/dashboard/governance', icon: '🛡️' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 p-4 shrink-0 justify-between h-full select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            O
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none group-hover:text-indigo-400 transition-colors">
              OnyxStack Labs
            </h2>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide">
              Student SaaS Portal
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 font-mono">
            Platform Workspaces
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-base" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Production System Badge */}
      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Enterprise Core</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Live
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">v1.0.0 Production Ready</p>
      </div>
    </aside>
  );
}
