'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { DEFAULT_ROLE_REDIRECTS } from '@/lib/rbac';
import {
  LayoutDashboard,
  Bot,
  FileText,
  Compass,
  ShieldAlert,
  Settings,
  ShieldCheck,
  UserPlus,
  MapPin,
  CalendarClock,
  CalendarCheck,
  GraduationCap,
  Building2,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
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
        { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 text-brand-400" /> },
        { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: <Bot className="w-4 h-4 text-brand-400" /> },
        { label: 'Notes Workspace', href: '/dashboard/notes', icon: <FileText className="w-4 h-4 text-accent-success" /> },
        { label: 'Attendance', href: '/dashboard/attendance', icon: <CalendarCheck className="w-4 h-4 text-rose-400" /> },
        { label: 'Grades', href: '/dashboard/grades', icon: <GraduationCap className="w-4 h-4 text-violet-400" /> },
        { label: 'Timetable', href: '/dashboard/timetable', icon: <CalendarClock className="w-4 h-4 text-sky-400" /> },
        { label: 'Campus Mobility', href: '/dashboard/mobility', icon: <Compass className="w-4 h-4 text-accent-warning" /> },
        { label: 'Safety & Portal', href: '/dashboard/governance', icon: <ShieldAlert className="w-4 h-4 text-accent-danger" /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
      ];
    case 'TEACHER':
      return [
        { label: 'Overview', href: '/dashboard/teacher', icon: <LayoutDashboard className="w-4 h-4 text-brand-400" /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
      ];
    case 'INSTITUTION':
      return [
        { label: 'Overview', href: '/dashboard/institution', icon: <Building2 className="w-4 h-4 text-brand-400" /> },
        { label: 'Invite Teachers', href: '/dashboard/institution/teachers', icon: <UserPlus className="w-4 h-4 text-accent-success" /> },
        { label: 'Campus Locations', href: '/dashboard/institution/locations', icon: <MapPin className="w-4 h-4 text-accent-warning" /> },
        { label: 'Timetable', href: '/dashboard/institution/timetable', icon: <CalendarClock className="w-4 h-4 text-sky-400" /> },
        { label: 'Attendance', href: '/dashboard/institution/attendance', icon: <CalendarCheck className="w-4 h-4 text-rose-400" /> },
        { label: 'Grades', href: '/dashboard/institution/grades', icon: <GraduationCap className="w-4 h-4 text-violet-400" /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
      ];
    case 'ADMIN':
    case 'SUPER_ADMIN':
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: <ShieldCheck className="w-4 h-4 text-brand-400" /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
      ];
    default:
      return [];
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, role } = useAuth();

  const userRole: UserRole = role || profile?.role || 'STUDENT';
  const homeHref = DEFAULT_ROLE_REDIRECTS[userRole] || '/dashboard';
  const navItems = getNavItems(userRole);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-surface-border bg-surface-raised/60 p-4 shrink-0 justify-between h-full select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href={homeHref} className="flex items-center gap-3 px-2 group">
          <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center font-black text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            O
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none group-hover:text-brand-400 transition-colors">
              OnyxStack Labs
            </h2>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide">
              {ROLE_LABELS[userRole]}
            </span>
          </div>
        </Link>

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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon}</span>
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
        <p className="text-[10px] text-slate-500 font-mono">v1.0.0 Production</p>
      </div>
    </aside>
  );
}
