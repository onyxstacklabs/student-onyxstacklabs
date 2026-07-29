'use client';

import React, { useState } from 'react';
import { EVChargingStation, EVChargingSession } from '@/types/mobility';
import { getChargingStations, getActiveChargingSession, startChargingSession, stopChargingSession } from '@/lib/mobility/chargingService';
import { Zap, MapPin, BatteryCharging, CheckCircle2, XCircle } from 'lucide-react';

export function ChargingStationList() {
  const [stations] = useState<EVChargingStation[]>(getChargingStations());
  const [activeSession, setActiveSession] = useState<EVChargingSession | null>(getActiveChargingSession());

  const handleToggleSession = (stationId: string) => {
    if (activeSession && activeSession.status === 'charging') {
      const ended = stopChargingSession(activeSession.id);
      setActiveSession(ended);
    } else {
      const started = startChargingSession(stationId);
      setActiveSession(started);
    }
  };

  const getChargerBadge = (type: EVChargingStation['chargerType']) => {
    switch (type) {
      case 'ultra_fast':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">Ultra Fast</span>;
      case 'fast':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">Fast Charge</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-full">Standard</span>;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Campus EV Charging Hubs</h3>
            <span className="text-xs text-slate-400">Solar & Grid Charging Docks</span>
          </div>
        </div>
        <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          Free Campus Fleet Charging
        </span>
      </div>

      {/* Active Charging Session Banner */}
      {activeSession && activeSession.status === 'charging' && (
        <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BatteryCharging className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <h4 className="text-xs font-semibold text-white">Active Charging Session</h4>
              <p className="text-[11px] text-slate-400">
                Added <span className="font-mono text-indigo-300 font-bold">{activeSession.energyAddedKwh} kWh</span> • Level: {activeSession.currentBatteryPercent}%
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleSession(activeSession.stationId)}
            className="px-3 py-1.5 bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900 rounded-lg text-xs font-semibold transition-colors"
          >
            Stop Session
          </button>
        </div>
      )}

      {/* Station Cards */}
      <div className="space-y-2.5">
        {stations.map((station) => {
          const isAvailable = station.availablePorts > 0;
          const isThisSessionActive = activeSession?.stationId === station.id && activeSession.status === 'charging';

          return (
            <div
              key={station.id}
              className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-white">{station.name}</h4>
                  {getChargerBadge(station.chargerType)}
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Station #{station.id}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    {isAvailable ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={isAvailable ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {station.availablePorts} / {station.totalPorts} ports open
                    </span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggleSession(station.id)}
                disabled={!isAvailable && !isThisSessionActive}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                  isThisSessionActive
                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                    : isAvailable
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isThisSessionActive ? 'Disconnect' : isAvailable ? 'Plug In & Charge' : 'Dock Full'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
