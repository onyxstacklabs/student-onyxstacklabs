'use client';

import React from 'react';
import { AdminMetricsCard } from '@/components/admin/AdminMetricsCard';
import { ShieldAlert, Building2, CreditCard, Activity, Database, KeyRound } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Super-Admin SaaS Console
            </h1>
          </div>
          <p className="text-sm text-slate-400 pl-11">
            Global platform governance, multi-tenant provisioning, revenue telemetry, and system-wide overrides.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start md:self-auto">
          <button
            onClick={() => alert('Opening Tenant Provisioning Portal...')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Provision Tenant</span>
          </button>
          <button
            onClick={() => alert('Accessing System Telemetry...')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-violet-950/50"
          >
            <Activity className="w-4 h-4" />
            <span>System Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="space-y-6">
        {/* Core System Metrics & Logs */}
        <AdminMetricsCard />

        {/* Platform Control Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Building2 className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Tenant & Institution Control</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provision new institutional workspaces, freeze/unfreeze tenant access, and inspect per-tenant resource usage.
            </p>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center space-x-1">
              <span>Manage Institutions</span>
              <span>→</span>
            </button>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Subscription & Tier Overrides</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manually upgrade/downgrade subscription tiers, grant custom trial periods, and issue enterprise feature flags.
            </p>
            <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center space-x-1">
              <span>Manage Subscriptions</span>
              <span>→</span>
            </button>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Global Audit & API Keys</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review platform-wide security audit logs, manage API developer tokens, and enforce zero-trust authentication policies.
            </p>
            <button className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center space-x-1">
              <span>Inspect Security Stream</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
