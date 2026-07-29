'use client';

import React, { useState } from 'react';
import { CampusRoute, TransportMode } from '@/types/mobility';
import { MOCK_CAMPUS_ROUTES } from '@/lib/mobility/routeService';
import { Navigation, Footprints, Bike, Zap, Bus, Clock, MapPin } from 'lucide-react';

interface RouteSelectorProps {
  onSelectRoute?: (route: CampusRoute) => void;
  selectedRouteId?: string;
}

export function RouteSelector({ onSelectRoute, selectedRouteId }: RouteSelectorProps) {
  const [activeFilter, setActiveFilter] = useState<TransportMode | 'all'>('all');

  const filteredRoutes = MOCK_CAMPUS_ROUTES.filter((route) =>
    activeFilter === 'all' ? true : route.transportMode === activeFilter
  );

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'walking':
        return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'cycling':
        return <Bike className="w-4 h-4 text-sky-400" />;
      case 'ev_scooter':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'shuttle':
        return <Bus className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Campus Route Planner</h3>
        </div>
        <span className="text-xs text-slate-400">Select a route for live map guidance</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'walking', 'cycling', 'ev_scooter', 'shuttle'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setActiveFilter(mode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors border ${
              activeFilter === mode
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {mode === 'all' ? 'All Modes' : mode.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Route List */}
      <div className="space-y-2.5">
        {filteredRoutes.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No campus routes available for this transport mode.</p>
        ) : (
          filteredRoutes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute && onSelectRoute(route)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-slate-800 rounded-md">{getModeIcon(route.transportMode)}</span>
                    <h4 className="text-sm font-medium text-white">{route.title}</h4>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 pl-8">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{route.distanceKm} km</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>~{route.estimatedDurationMinutes} min</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectRoute) onSelectRoute(route);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Active Route' : 'Select Route'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
