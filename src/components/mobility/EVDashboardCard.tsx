'use client';

import React, { useState, useEffect } from 'react';
import { EVScooterTelemetry } from '@/types/mobility';
import { getEVTelemetry } from '@/lib/mobility/evTelemetryService';
import { Battery, BatteryCharging, Zap, Gauge, HeartPulse, Navigation } from 'lucide-react';

export function EVDashboardCard() {
  const [telemetry, setTelemetry] = useState<EVScooterTelemetry | null>(null);

  useEffect(() => {
    // Fetches live EV scooter telemetry state
    const data = getEVTelemetry();
    setTelemetry(data);
  }, []);

  if (!telemetry) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded"></div>
        <div className="h-12 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  const getBatteryColor = (percent: number) => {
    if (percent > 50) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (percent > 20) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getBatteryBarColor = (percent: number) => {
    if (percent > 50) return 'bg-emerald-500';
    if (percent > 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Smart EV Telemetry</h3>
            <span className="text-xs text-slate-400">Campus E-Scooter / Bike Unit</span>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center space-x-1 ${getBatteryColor(
            telemetry.batteryLevelPercent
          )}`}
        >
          {telemetry.isCharging ? (
            <>
              <BatteryCharging className="w-3.5 h-3.5 animate-pulse" />
              <span>Charging</span>
            </>
          ) : (
            <>
              <Battery className="w-3.5 h-3.5" />
              <span>{telemetry.batteryLevelPercent}%</span>
            </>
          )}
        </span>
      </div>

      {/* Battery Level Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Battery Level</span>
          <span className="text-white font-mono">{telemetry.batteryLevelPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getBatteryBarColor(
              telemetry.batteryLevelPercent
            )}`}
            style={{ width: `${telemetry.batteryLevelPercent}%` }}
          />
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center text-center">
          <Navigation className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[11px] text-slate-400 font-medium">Est. Range</span>
          <span className="text-base font-bold text-white font-mono mt-0.5">{telemetry.estimatedRangeKm} km</span>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center text-center">
          <HeartPulse className="w-4 h-4 text-rose-400 mb-1" />
          <span className="text-[11px] text-slate-400 font-medium">Health</span>
          <span className="text-base font-bold text-white font-mono mt-0.5">{telemetry.healthPercent}%</span>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 flex flex-col items-center text-center">
          <Gauge className="w-4 h-4 text-indigo-400 mb-1" />
          <span className="text-[11px] text-slate-400 font-medium">Odometer</span>
          <span className="text-base font-bold text-white font-mono mt-0.5">{telemetry.odometerTotalKm} km</span>
        </div>
      </div>
    </div>
  );
}
