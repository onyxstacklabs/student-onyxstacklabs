'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SubNavItem {
  label: string;
  href: string;
}

const subNavItems: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard/courses' },
  { label: 'Subjects', href: '/dashboard/courses/subjects' },
  { label: 'Assignments', href: '/dashboard/courses/assignments' },
  { label: 'Planner', href: '/dashboard/courses/planner' },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace Header & Sub-Navigation */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-slate-300">Productivity Workspace</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Academic & Productivity Hub
            </h1>
          </div>
        </div>

        {/* Workspace Sub-Nav Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2" aria-label="Workspace Sub-Navigation">
          {subNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Workspace Content Area */}
      <div className="min-h-[60vh]">{children}</div>
    </div>
  );
}
