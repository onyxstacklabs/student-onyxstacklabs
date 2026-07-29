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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userRole = profile?.role || 'STUDENT';

  // Dedicated Views according to Role (No mixed layout)
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    return (
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">System Administration & Multi-Tenant Portal</h2>
        <p className="text-sm text-slate-400">
          Logged in as <span className="text-indigo-400 font-semibold">{userRole}</span>. Manage tenants, users, and security logs from governance settings.
        </p>
      </div>
    );
  }

  if (userRole === 'PARENT') {
    return (
      <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Parent Guardian Portal</h2>
        <p className="text-sm text-slate-400">
          Logged in as <span className="text-indigo-400 font-semibold">PARENT</span>. Student performance and attendance metrics will be mapped to linked wards.
        </p>
      </div>
    );
  }

  // Default STUDENT Dashboard Layout
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
          Role: {userRole}
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
