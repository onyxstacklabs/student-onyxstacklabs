'use client';

import React, { useState, useEffect } from 'react';
import { DigitalIDVerification } from '@/types/governance';
import { getDigitalIDInfo, updateRFIDCardStatus } from '@/lib/governance/identityService';
import { ShieldCheck, Fingerprint, CreditCard, Lock, CheckCircle2, AlertOctagon, KeyRound } from 'lucide-react';

export function IDVerificationCard() {
  const [digitalId, setDigitalId] = useState<DigitalIDVerification | null>(null);

  useEffect(() => {
    setDigitalId(getDigitalIDInfo());
  }, []);

  if (!digitalId) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
        <div className="h-5 w-40 bg-slate-800 rounded"></div>
        <div className="h-24 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  const handleStatusChange = (status: DigitalIDVerification['rfidCardStatus']) => {
    const updated = updateRFIDCardStatus(status);
    setDigitalId(updated);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Digital Identity & Access Card</h3>
            <span className="text-xs text-slate-400">Encrypted RFID & Biometric Telemetry</span>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          {digitalId.clearanceLevel} Clearance
        </span>
      </div>

      {/* Identity Card Header */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-base font-bold text-white">{digitalId.fullName}</h4>
            {digitalId.isBiometricVerified && (
              <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Biometric Verified</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono">ID: {digitalId.studentId}</p>
        </div>

        {/* RFID Card Quick Controls */}
        <div className="flex items-center space-x-1.5 self-end sm:self-auto">
          <button
            onClick={() => handleStatusChange('active')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              digitalId.rfidCardStatus === 'active'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange('suspended')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              digitalId.rfidCardStatus === 'suspended'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Freeze
          </button>
          <button
            onClick={() => handleStatusChange('lost')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
              digitalId.rfidCardStatus === 'lost'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            Report Lost
          </button>
        </div>
      </div>

      {/* Card Status Alert Banner */}
      {digitalId.rfidCardStatus !== 'active' && (
        <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center space-x-2.5 text-xs text-amber-200">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>
            Physical RFID card status is currently set to <strong className="uppercase">{digitalId.rfidCardStatus}</strong>. Turnstile entry may require biometric authorization.
          </span>
        </div>
      )}

      {/* Authorized Zones List */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
          <span>Permitted Campus Access Zones</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {digitalId.accessZonesPermitted.map((zone) => (
            <div
              key={zone}
              className="p-2.5 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center space-x-2 text-slate-300"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{zone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
