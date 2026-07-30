'use client';

import React, { useState } from 'react';
import { CampusRoute } from '@/types/mobility';
import { CampusMap } from '@/components/mobility/CampusMap';
import { RouteSelector } from '@/components/mobility/RouteSelector';
import { TripTrackerCard } from '@/components/mobility/TripTrackerCard';
import { CampusWeatherWidget } from '@/components/mobility/CampusWeatherWidget';
import { EVDashboardCard } from '@/components/mobility/EVDashboardCard';
import { BatteryHealthCard } from '@/components/mobility/BatteryHealthCard';
import { ChargingStationList } from '@/components/mobility/ChargingStationList';
import { TravelAnalyticsCard } from '@/components/mobility/TravelAnalyticsCard';
import { Navigation, ShieldCheck, Zap } from 'lucide-react';

export default function SmartMobilityDashboardPage() {
  const [selectedRoute, setSelectedRoute] = useState<CampusRoute | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Navigation className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Smart Campus Mobility Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 pl-11 max-w-2xl">
            Real-time micro-mobility tracking, eco-transit route guidance, solar EV docks & sustainability telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Network Active</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
            <span>Solar Fleet Online</span>
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Map & Navigation Selector (2 Cols wide on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <CampusMap activeRoute={selectedRoute} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RouteSelector
              selectedRouteId={selectedRoute?.id}
              onSelectRoute={(route) => setSelectedRoute(route)}
            />
            <TripTrackerCard selectedRoute={selectedRoute} />
          </div>

          <ChargingStationList />
        </div>

        {/* Right Column: Telemetry, Weather & Analytics */}
        <div className="space-y-6">
          <CampusWeatherWidget />
          <EVDashboardCard />
          <BatteryHealthCard />
          <TravelAnalyticsCard />
        </div>
      </div>
    </main>
  );
}
