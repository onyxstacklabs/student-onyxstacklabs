'use client';

import React, { useState, useEffect } from 'react';
import { TravelAnalytics } from '@/types/mobility';
import { getTravelAnalytics } from '@/lib/mobility/travelAnalyticsService';
import { BarChart3, Leaf, Route, Footprints, Bike, Zap, Bus, TrendingUp } from 'lucide-react';

export function TravelAnalyticsCard() {
  const [analytics, setAnalytics] = useState<TravelAnalytics | null>(null);

  useEffect(() => {
    const data = getTravelAnalytics();
    setAnalytics(data);
  }, []);

  if (!analytics) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded"></div>
        <div className="h-24 w-full bg-slate-800 rounded"></div>
      </div>
    );
  }

  const maxWeeklyKm = Math.max(...analytics.weeklyDistanceKm);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Green Mobility Analytics</h3>
            <span className="text-xs text-slate-400">Sustainability & Commute Telemetry</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-400">
          <Leaf className="w-3.5 h-3.5" />
          <span>{analytics.co2SavedKg} kg CO₂ Offset</span>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Total Distance</span>
          <span className="text-lg font-bold text-white font-mono mt-0.5">{analytics.totalDistanceKm} km</span>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Total Trips</span>
          <span className="text-lg font-bold text-white font-mono mt-0.5">{analytics.totalTrips}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">Eco Efficiency</span>
          <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5">94%</span>
        </div>
      </div>

      {/* Mode Breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Transport Mode Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Walking</span>
              <span className="font-semibold text-white font-mono">{analytics.modeBreakdown.walking} km</span>
            </div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center space-x-2">
            <Bike className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Cycling</span>
              <span className="font-semibold text-white font-mono">{analytics.modeBreakdown.cycling} km</span>
            </div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">EV Scooter</span>
              <span className="font-semibold text-white font-mono">{analytics.modeBreakdown.ev_scooter} km</span>
            </div>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center space-x-2">
            <Bus className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Shuttle</span>
              <span className="font-semibold text-white font-mono">{analytics.modeBreakdown.shuttle} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Visualizer Bar Chart */}
      <div className="space-y-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Weekly Commute Pattern</h4>
          <span className="text-[11px] text-indigo-400 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Peak: {maxWeeklyKm} km</span>
          </span>
        </div>
        <div className="h-28 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-end justify-between gap-1.5">
          {analytics.weeklyDistanceKm.map((km, index) => {
            const heightPercent = Math.round((km / maxWeeklyKm) * 100);
            return (
              <div key={days[index]} className="flex-1 flex flex-col items-center h-full justify-end space-y-1">
                <span className="text-[9px] font-mono text-slate-400">{km}</span>
                <div className="w-full bg-slate-800 rounded-t-sm h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{days[index]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
