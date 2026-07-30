'use client';

import React from 'react';
import { EmergencySOSButton } from '@/components/governance/EmergencySOSButton';
import { IDVerificationCard } from '@/components/governance/IDVerificationCard';
import { GovernanceAuditCard } from '@/components/governance/GovernanceAuditCard';
import { ShieldAlert, Lock, Activity } from 'lucide-react';

export default function SmartGovernanceDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Smart Governance & Safety Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 pl-11 max-w-2xl">
            Automated emergency SOS dispatch, digital RFID identity management, and security audit telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-4 h-4" />
            <span>Emergency Gateway Ready</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Lock className="w-4 h-4" />
            <span>Biometric Enforced</span>
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Primary Column: Emergency SOS Dispatch & Security Telemetry (2 Cols wide on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <EmergencySOSButton />
          <GovernanceAuditCard />
        </div>

        {/* Right Column: Digital Identity Verification & Access Control */}
        <div className="space-y-6">
          <IDVerificationCard />
        </div>
      </div>
    </main>
  );
}
