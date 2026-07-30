'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const { profile, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Syncing Portal Overview...</span>
      </div>
    );
  }

  const userRole = profile?.role || 'STUDENT';

  // Dedicated View for SUPER_ADMIN & ADMIN
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return (
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-4 max-w-4xl mx-auto my-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mx-auto text-xl">
          🛡️
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          System Administration & Governance Hub
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Logged in as <span className="text-indigo-400 font-semibold font-mono">{userRole}</span>. Manage workspace tenants, security policies, and access logs from the governance portal.
        </p>
      </div>
    );
  }

  // Dedicated View for PARENT
  if (userRole === 'PARENT') {
    return (
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-4 max-w-4xl mx-auto my-8">
        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mx-auto text-xl">
          👨‍👩‍👧
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Parent & Guardian Monitoring Hub
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Logged in as <span className="text-emerald-400 font-semibold font-mono">PARENT</span>. Academic performance, attendance records, and mobility logs are synced for your linked wards.
        </p>
      </div>
    );
  }

  // Time-based greeting helper
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Default STUDENT Dashboard Layout
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting}, {profile?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is your live academic overview and workspace summary for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-400 font-mono shrink-0">
            Role: {userRole}
          </div>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity />
        </div>

        {/* Right Column (1 Col wide on Desktop) */}
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
