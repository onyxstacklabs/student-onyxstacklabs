'use client';

import React, { useState, useEffect } from 'react';
import {
  ManagedInstitution,
  getAllManagedInstitutions,
  updateInstitutionStatus,
  updateInstitutionTier,
} from '@/lib/institution/institutionManagementService';
import { SubscriptionTier, SubscriptionStatus } from '@/types/saas';
import { Building2, Globe, ShieldCheck, ShieldAlert, DollarSign, Layers, Check, AlertTriangle } from 'lucide-react';

export function InstitutionManagementCard() {
  const [institutions, setInstitutions] = useState<ManagedInstitution[]>([]);

  useEffect(() => {
    setInstitutions(getAllManagedInstitutions());
  }, []);

  const handleStatusChange = (id: string, newStatus: SubscriptionStatus) => {
    const updated = updateInstitutionStatus(id, newStatus);
    if (updated) {
      setInstitutions((prev) =>
        prev.map((inst) => (inst.id === id ? { ...inst, status: newStatus } : inst))
      );
    }
  };

  const handleTierChange = (id: string, newTier: SubscriptionTier) => {
    const updated = updateInstitutionTier(id, newTier);
    if (updated) {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === id
            ? { ...inst, tier: newTier, monthlyRevenueUSD: newTier === 'enterprise' ? 249 : newTier === 'pro' ? 12 : 0 }
            : inst
        )
      );
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Multi-Tenant Institution Control</h2>
            <p className="text-xs text-slate-400">Manage tenant accounts, quotas, tiers, and subscription states</p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
          Total Managed: <span className="text-white font-bold">{institutions.length}</span>
        </div>
      </div>

      {/* Institutions Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 px-2">Institution & Domain</th>
              <th className="pb-3 px-2">Current Tier</th>
              <th className="pb-3 px-2">Student Quota</th>
              <th className="pb-3 px-2">Est. Revenue</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {institutions.map((inst) => {
              const studentPercent = Math.min(
                100,
                Math.round((inst.currentStudents / inst.maxStudents) * 100)
              );

              return (
                <tr key={inst.id} className="hover:bg-slate-950/40 transition-colors">
                  {/* Institution & Domain */}
                  <td className="py-3 px-2">
                    <div className="font-semibold text-white">{inst.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="font-mono text-indigo-300">{inst.customDomain}</span>
                    </div>
                  </td>

                  {/* Tier Selector */}
                  <td className="py-3 px-2">
                    <select
                      value={inst.tier}
                      onChange={(e) => handleTierChange(inst.id, e.target.value as SubscriptionTier)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-bold uppercase text-violet-300 focus:outline-none focus:border-violet-500"
                    >
                      <option value="free">Free Starter</option>
                      <option value="pro">Pro Scholar</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </td>

                  {/* Student Quota Progress */}
                  <td className="py-3 px-2 space-y-1 min-w-[130px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{inst.currentStudents}</span>
                      <span>{inst.maxStudents} seats</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${studentPercent}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-2 font-mono text-emerald-400 font-bold text-xs">
                    ${inst.monthlyRevenueUSD}/mo
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-2">
                    {inst.status === 'active' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                    {inst.status === 'past_due' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Past Due</span>
                      </span>
                    )}
                    {inst.status === 'suspended' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-semibold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Suspended</span>
                      </span>
                    )}
                  </td>

                  {/* Action Controls */}
                  <td className="py-3 px-2 text-right">
                    <select
                      value={inst.status}
                      onChange={(e) => handleStatusChange(inst.id, e.target.value as SubscriptionStatus)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="past_due">Past Due</option>
                      <option value="canceled">Canceled</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
