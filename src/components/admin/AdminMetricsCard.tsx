'use client';

import React, { useState, useEffect } from 'react';
import { SystemAdminMetrics, AdminActivityLog } from '@/lib/admin/adminService';
import { getSystemAdminMetrics, getAdminActivityLogs } from '@/lib/admin/adminService';
import { DollarSign, Users, Building2, Activity, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export function AdminMetricsCard() {
  const [metrics, setMetrics] = useState<SystemAdminMetrics | null>(null);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);

  useEffect(() => {
    setMetrics(getSystemAdminMetrics());
    setLogs(getAdminActivityLogs());
  }, []);

  if (!metrics) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="h-24 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Platform System Telemetry</h2>
            <p className="text-xs text-slate-400">Super-Admin Multi-Tenant Oversight & MRR Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Uptime: {metrics.systemHealthScore}%</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-white">
            ${metrics.monthlyRecurringRevenueUSD.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">Active Subscriptions: {metrics.activeSubscriptions}</p>
        </div>

        {/* Total Registered Users */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-white">
            {metrics.totalUsers.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">Across all institutions</p>
        </div>

        {/* Institution Tenants */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Institutions</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-white">
            {metrics.totalInstitutions}
          </p>
          <p className="text-[11px] text-indigo-400 font-medium">Multi-tenant active</p>
        </div>

        {/* AI Sessions Today */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Sessions</span>
            <Cpu className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-white">
            {metrics.activeAiSessionsToday.toLocaleString()}
          </p>
          <p className="text-[11px] text-violet-400 font-medium">Today's executions</p>
        </div>
      </div>

      {/* Admin Audit Logs Feed */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Super-Admin Operation Log Stream
          </h3>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-violet-300">{log.action}</span>
                  {log.targetTenantId && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                      Tenant: {log.targetTenantId}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px]">
                  Actor: <span className="text-slate-200">{log.adminEmail}</span>
                </p>
              </div>
              <div className="text-right shrink-0 text-[10px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
