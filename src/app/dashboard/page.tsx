'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, {profile?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is what’s happening with your learning portal today.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-semibold text-indigo-400 shrink-0">
          Role: {profile?.role || 'STUDENT'}
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
