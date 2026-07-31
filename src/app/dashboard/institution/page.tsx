'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { InstitutionOverviewCard } from '@/components/institution/InstitutionOverviewCard';
import { EmergencyAlertsPanel } from '@/components/institution/EmergencyAlertsPanel';
import { LiveTripsPanel } from '@/components/institution/LiveTripsPanel';
import { Building2, Settings, Users, Shield, Plus, Sparkles } from 'lucide-react';

function InstitutionDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Institution Governance Portal
            </h1>
          </div>
          <p className="text-sm text-slate-400 pl-11">
            Manage multi-campus workspaces, tenant quotas, department hierarchies, and custom branding.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            disabled
            title="Department management is coming soon"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-medium rounded-lg cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department (Soon)</span>
          </button>
          <button
            disabled
            title="Workspace settings are coming soon"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold rounded-lg cursor-not-allowed"
          >
            <Settings className="w-4 h-4" />
            <span>Workspace Settings (Soon)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <EmergencyAlertsPanel />

        <LiveTripsPanel />

        <InstitutionOverviewCard />

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Faculty & Student Roster</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review active student enrollments, issue faculty invitations, and manage department access control roles.
            </p>
            <button
              disabled
              title="Roster management is coming soon"
              className="text-xs font-semibold text-slate-500 cursor-not-allowed inline-flex items-center space-x-1"
            >
              <span>View Active Members (Soon)</span>
            </button>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-violet-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Custom Branding & Domain</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure institutional primary/accent color themes, upload university logos, and manage SSL certificates.
            </p>
            <button
              disabled
              title="Branding configuration is coming soon"
              className="text-xs font-semibold text-slate-500 cursor-not-allowed inline-flex items-center space-x-1"
            >
              <span>Configure Branding (Soon)</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function InstitutionDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <InstitutionDashboard />
    </ProtectedRoute>
  );
}
