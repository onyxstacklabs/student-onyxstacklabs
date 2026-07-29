'use client';

import React, { useState, useEffect } from 'react';
import { InstitutionWorkspace } from '@/types/institution';
import { getCurrentInstitutionWorkspace, checkQuotaStatus } from '@/lib/institution/institutionService';
import { Building2, Users, HardDrive, Cpu, ShieldCheck, Globe, ChevronRight } from 'lucide-react';

export function InstitutionOverviewCard() {
  const [workspace, setWorkspace] = useState<InstitutionWorkspace | null>(null);

  useEffect(() => {
    setWorkspace(getCurrentInstitutionWorkspace());
  }, []);

  if (!workspace) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="h-20 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  const quotaStatus = checkQuotaStatus(workspace);

  const studentPercent = Math.min(
    100,
    Math.round((workspace.quota.currentStudents / workspace.quota.maxStudents) * 100)
  );
  const storagePercent = Math.min(
    100,
    Math.round((workspace.quota.storageUsedGb / workspace.quota.maxStorageGb) * 100)
  );
  const aiPercent = Math.min(
    100,
    Math.round(
      (workspace.quota.aiCreditsUsedThisMonth / workspace.quota.maxAiCreditsPerMonth) * 100
    )
  );

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">{workspace.name}</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {workspace.tier} Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{workspace.branding.customDomain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="capitalize">{workspace.subscriptionStatus} Workspace</span>
          </span>
        </div>
      </div>

      {/* Quota Metrics Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Institutional Quotas & Telemetry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Seats Progress */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Student Seats</span>
              </span>
              <span className="font-mono text-white font-bold">{studentPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaStatus.isStudentQuotaFull ? 'bg-rose-500' : 'bg-sky-500'
                }`}
                style={{ width: `${studentPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 font-mono text-right">
              {workspace.quota.currentStudents.toLocaleString()} / {workspace.quota.maxStudents.toLocaleString()} Enrolled
            </p>
          </div>

          {/* Storage Progress */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Cloud Storage</span>
              </span>
              <span className="font-mono text-white font-bold">{storagePercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaStatus.isStorageFull ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${storagePercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 font-mono text-right">
              {workspace.quota.storageUsedGb} GB / {workspace.quota.maxStorageGb} GB
            </p>
          </div>

          {/* AI Compute Progress */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-violet-400" />
                <span>Monthly AI Compute</span>
              </span>
              <span className="font-mono text-white font-bold">{aiPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaStatus.isAiQuotaExhausted ? 'bg-rose-500' : 'bg-violet-500'
                }`}
                style={{ width: `${aiPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 font-mono text-right">
              {workspace.quota.aiCreditsUsedThisMonth.toLocaleString()} / {workspace.quota.maxAiCreditsPerMonth.toLocaleString()} Credits
            </p>
          </div>
        </div>
      </div>

      {/* Campus Departments Overview */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Campus Departments ({workspace.departments.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {workspace.departments.map((dept) => (
            <div
              key={dept.id}
              className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-[10px] text-indigo-400 font-bold block">{dept.code}</span>
                <span className="font-medium text-white truncate block max-w-[180px]">{dept.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-300 font-mono font-bold block">{dept.studentCount}</span>
                <span className="text-[10px] text-slate-500 block">Students</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
