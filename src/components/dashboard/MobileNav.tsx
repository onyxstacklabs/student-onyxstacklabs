'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { DEFAULT_ROLE_REDIRECTS } from '@/lib/rbac';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'Student Portal',
  PARENT: 'Parent Portal',
  TEACHER: 'Teacher Portal',
  INSTITUTION: 'Institution Portal',
  ADMIN: 'Super Admin Portal',
  SUPER_ADMIN: 'Super Admin Portal',
};

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'STUDENT':
    case 'PARENT':
      return [
        { label: 'Overview', href: '/dashboard', icon: '📊' },
        { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖' },
        { label: 'Notes Workspace', href: '/dashboard/notes', icon: '📝' },
        { label: 'Attendance', href: '/dashboard/attendance', icon: '✅' },
        { label: 'Grades', href: '/dashboard/grades', icon: '🎓' },
        { label: 'Timetable', href: '/dashboard/timetable', icon: '🗓️' },
        { label: 'Campus Mobility', href: '/dashboard/mobility', icon: '📍' },
        { label: 'Safety & Portal', href: '/dashboard/governance', icon: '🛡️' },
        { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      ];
    case 'TEACHER':
      return [
        { label: 'Overview', href: '/dashboard/teacher', icon: '📊' },
        { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      ];
    case 'INSTITUTION':
      return [
        { label: 'Overview', href: '/dashboard/institution', icon: '🏫' },
        { label: 'Invite Teachers', href: '/dashboard/institution/teachers', icon: '➕' },
        { label: 'Campus Locations', href: '/dashboard/institution/locations', icon: '📍' },
        { label: 'Timetable', href: '/dashboard/institution/timetable', icon: '🗓️' },
        { label: 'Attendance', href: '/dashboard/institution/attendance', icon: '✅' },
        { label: 'Grades', href: '/dashboard/institution/grades', icon: '🎓' },
        { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      ];
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: '🛡️' },
        { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      ];
    default:
      return [];
  }
}

export default function MobileNav() {
  const pathname = usePathname();
  const { profile, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const userRole: UserRole = role || profile?.role || 'STUDENT';
  const homeHref = DEFAULT_ROLE_REDIRECTS[userRole] || '/dashboard';
  const navItems = getNavItems(userRole);

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-raised/90 backdrop-blur-md border-b border-surface-border sticky top-0 z-30">
        <Link href={homeHref} className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-brand-500/20">
            O
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            OnyxStack Labs
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-surface-base/80 border border-surface-border transition active:scale-95 flex items-center gap-1.5"
          aria-label="Toggle navigation drawer"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <span>✕</span> Close
            </>
          ) : (
            <>
              <span>☰</span> Menu
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-base/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-surface-raised border-r border-surface-border p-4 z-50 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-brand-500/20">
                O
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-none">
                  OnyxStack Labs
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  {ROLE_LABELS[userRole]}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-100 transition rounded-md"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 font-mono">
              Workspaces
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
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

        <div className="p-3 bg-surface-base/70 border border-surface-border rounded-xl text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">System Role</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {userRole}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">v1.0.0 Enterprise</p>
        </div>
      </div>
    </>
  );
}
