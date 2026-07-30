'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  Compass, 
  ShieldAlert, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const baseNavItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" /> },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: <Bot className="w-4 h-4 text-indigo-400" /> },
  { label: 'Notes Workspace', href: '/dashboard/notes', icon: <FileText className="w-4 h-4 text-emerald-400" /> },
  { label: 'Campus Mobility', href: '/dashboard/mobility', icon: <Compass className="w-4 h-4 text-amber-400" /> },
  { label: 'Safety & Portal', href: '/dashboard/governance', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, role } = useAuth(); // 👈 Directly extract active 'role' from AuthContext

  // Use reliable fallback to context role
  const userRole = role || profile?.role || 'STUDENT';
  const isAdmin = userRole === 'ADMIN';

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/60 p-4 shrink-0 justify-between h-full select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href={isAdmin ? "/dashboard/admin" : "/dashboard"} className="flex items-center gap-3 px-2 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            O
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none group-hover:text-indigo-400 transition-colors">
              OnyxStack Labs
            </h2>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide">
              {isAdmin ? 'Super Admin Portal' : 'Student Portal'}
            </span>
          </div>
        </Link>

        {/* Dynamic RBAC Navigation Items */}
        <nav className="space-y-1">
          {/* Super Admin Control Access Section (Only for ADMIN role) */}
          {isAdmin && (
            <div className="mb-4 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-rose-400 font-bold px-3 font-mono">
                Admin Control
              </div>
              <Link
                href="/dashboard/admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/dashboard/admin'
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm'
                    : 'text-rose-400/80 hover:text-rose-200 hover:bg-slate-800/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Admin Dashboard</span>
              </Link>
            </div>
          )}

          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 font-mono">
            Platform Workspaces
          </div>

          {baseNavItems.map((item) => {
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Dynamic Role Status Badge */}
      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">System Role</span>
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
            userRole === 'ADMIN' 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {userRole}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">v1.0.0 Production Ready</p>
      </div>
    </aside>
  );
}
