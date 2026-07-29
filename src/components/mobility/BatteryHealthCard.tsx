'use client';

import React, { useState, useEffect } from 'react';
import { EVScooterTelemetry } from '@/types/mobility';
import { getEVTelemetry } from '@/lib/mobility/evTelemetryService';
import { calculateTimeToFullMinutes, evaluateBatteryAlerts } from '@/lib/mobility/batteryService';
import { BatteryCharging, HeartPulse, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

export function BatteryHealthCard() {
  const [telemetry, setTelemetry] = useState<EVScooterTelemetry | null>(null);

  useEffect(() => {
    const data = getEVTelemetry();
    setTelemetry(data);
  }, []);

  if (!telemetry) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-3">
        <div className="h-5 w-36 bg-slate-800 rounded"></div>
        <div className="h-10 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  const alert = evaluateBatteryAlerts(telemetry);
  const timeToFull = calculateTimeToFullMinutes(telemetry.batteryLevelPercent);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Battery Health & Diagnostics</h3>
            <span className="text-xs text-slate-400">Cell Performance Telemetry</span>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          {telemetry.healthPercent}% Capacity
        </span>
      </div>

      {/* Charge Time Estimation */}
      <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <BatteryCharging className="w-5 h-5 text-sky-400" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Est. Full Charge Duration</span>
            <span className="text-sm font-bold text-white font-mono">
              {telemetry.batteryLevelPercent >= 100 ? 'Fully Charged' : `~${timeToFull} mins remaining`}
            </span>
          </div>
        </div>
        <Zap className="w-4 h-4 text-amber-400" />
      </div>

      {/* Dynamic Alert Banner */}
      {alert ? (
        <div
          className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs ${
            alert.level === 'critical'
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold">{alert.title}</h5>
            <p className="mt-0.5 text-slate-300">{alert.message}</p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Battery health optimal. No voltage instability or abnormal degradation detected.</span>
        </div>
      )}
    </div>
  );
}
