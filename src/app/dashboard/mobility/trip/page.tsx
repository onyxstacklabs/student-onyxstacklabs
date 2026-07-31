'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useTripTracking } from '@/lib/mobility/useTripTracking';
import { getTripHistoryForStudent } from '@/lib/mobility/tripService';
import { TripSession } from '@/types/mobility';
import { Navigation, Play, Square, Gauge, Route, Clock, BatteryMedium, History } from 'lucide-react';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function CommuteTracker() {
  const { user } = useAuth();
  const { activeTrip, isTracking, elapsedSeconds, error, startTrip, stopTrip } = useTripTracking();

  const [batteryInput, setBatteryInput] = useState('');
  const [history, setHistory] = useState<TripSession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadHistory = () => {
    if (!user?.uid) return;
    setHistoryLoading(true);
    getTripHistoryForStudent(user.uid)
      .then((data) => setHistory(data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [user?.uid]);

  const handleStart = async () => {
    const battery = batteryInput ? Number(batteryInput) : undefined;
    await startTrip(undefined, battery);
  };

  const handleStop = async () => {
    await stopTrip();
    setBatteryInput('');
    loadHistory();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
          <Navigation className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">EV Commute Tracker</h1>
          <p className="text-xs text-slate-400">Track your ride live — distance, speed, and duration.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}

      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5">
        {!isTracking && !activeTrip ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                Battery Level % (optional)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={batteryInput}
                onChange={(e) => setBatteryInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                placeholder="e.g., 85"
              />
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Play className="w-4 h-4" /> Start Commute
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                <Clock className="w-4 h-4 text-indigo-400 mx-auto" />
                <p className="text-lg font-bold text-white font-mono">{formatDuration(elapsedSeconds)}</p>
                <p className="text-[10px] text-slate-500">Duration</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                <Route className="w-4 h-4 text-emerald-400 mx-auto" />
                <p className="text-lg font-bold text-white font-mono">
                  {activeTrip?.distanceCoveredKm.toFixed(2) || '0.00'}
                </p>
                <p className="text-[10px] text-slate-500">km</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
                <Gauge className="w-4 h-4 text-amber-400 mx-auto" />
                <p className="text-lg font-bold text-white font-mono">
                  {activeTrip?.currentSpeedKmh?.toFixed(0) || '0'}
                </p>
                <p className="text-[10px] text-slate-500">km/h</p>
              </div>
            </div>

            {activeTrip?.batteryPercentage !== undefined && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <BatteryMedium className="w-3.5 h-3.5" />
                Started at {activeTrip.batteryPercentage}% battery
              </div>
            )}

            <button
              onClick={handleStop}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" /> End Commute
            </button>

            <p className="text-[11px] text-slate-500 text-center">
              Keep this page open while commuting for accurate tracking.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" /> Trip History
        </h2>
        {historyLoading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No completed trips yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((trip) => (
              <div
                key={trip.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <p className="text-slate-300 font-medium">
                    {new Date(trip.startTime).toLocaleDateString()}{' '}
                    {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-slate-500">{trip.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono">{trip.distanceCoveredKm.toFixed(2)} km</p>
                  <p className="text-slate-500 font-mono">{trip.averageSpeedKmh?.toFixed(0) || 0} km/h avg</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripTrackerPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'PARENT', 'TEACHER']}>
      <CommuteTracker />
    </ProtectedRoute>
  );
}
