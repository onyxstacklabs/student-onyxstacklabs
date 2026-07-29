'use client';

import React from 'react';
import { CampusRoute } from '@/types/mobility';
import { useTripTracking } from '@/lib/mobility/useTripTracking';
import { Play, Pause, Square, Navigation, Gauge, Clock, ShieldCheck } from 'lucide-react';

interface TripTrackerCardProps {
  selectedRoute?: CampusRoute | null;
}

export function TripTrackerCard({ selectedRoute }: TripTrackerCardProps) {
  const { activeTrip, isTracking, elapsedSeconds, startTrip, pauseTrip, stopTrip } =
    useTripTracking();

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Live Trip Companion</h3>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
            isTracking
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
              : activeTrip?.status === 'completed'
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isTracking ? 'Tracking Live' : activeTrip?.status === 'completed' ? 'Trip Completed' : 'Idle'}
        </span>
      </div>

      {/* Selected Route Info */}
      {selectedRoute ? (
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Route</span>
            <p className="text-sm font-medium text-white">{selectedRoute.title}</p>
          </div>
          <span className="text-xs text-indigo-400 font-medium">{selectedRoute.distanceKm} km</span>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No specific route selected. Tracking free-form transit.</p>
      )}

      {/* Live Metrics Display */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Duration</span>
            <span className="text-lg font-bold text-white font-mono">{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Covered</span>
            <span className="text-lg font-bold text-white font-mono">
              {activeTrip?.distanceCoveredKm.toFixed(2) || '0.00'} km
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 pt-2">
        {!isTracking ? (
          <button
            onClick={() => startTrip(selectedRoute || undefined)}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md"
          >
            <Play className="w-4 h-4" />
            <span>{activeTrip ? 'Resume Trip' : 'Start Trip'}</span>
          </button>
        ) : (
          <button
            onClick={pauseTrip}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md"
          >
            <Pause className="w-4 h-4" />
            <span>Pause Trip</span>
          </button>
        )}

        {(isTracking || activeTrip) && (
          <button
            onClick={stopTrip}
            className="inline-flex items-center justify-center p-2.5 bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded-lg text-xs font-semibold transition-colors"
            title="End Trip"
          >
            <Square className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center space-x-1.5 text-slate-400 text-[11px] pt-1 border-t border-slate-800/60">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Safe Arrival Detection active during tracking</span>
      </div>
    </div>
  );
}
