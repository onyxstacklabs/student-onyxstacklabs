'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getActiveTripsForInstitution } from '@/lib/mobility/tripService';
import { TripSession } from '@/types/mobility';
import { Navigation, Gauge, Route } from 'lucide-react';

export function LiveTripsPanel() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = () => {
    if (!user?.uid) return;
    getActiveTripsForInstitution(user.uid)
      .then((data) => setTrips(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrips();
    const interval = setInterval(loadTrips, 15000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  if (loading) return null;
  if (trips.length === 0) return null;

  return (
    <div className="bg-surface-raised border border-surface-border rounded-card p-6 space-y-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Navigation className="w-4 h-4 text-brand-400" />
        Students Currently Commuting ({trips.length})
      </h3>
      <div className="space-y-2">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="flex items-center justify-between p-3.5 bg-surface-base border border-surface-border rounded-xl"
          >
            <div>
              <p className="text-sm font-semibold text-white">{trip.studentName}</p>
              <p className="text-[11px] text-slate-500">
                Started {new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {trip.batteryPercentage !== undefined ? ` · ${trip.batteryPercentage}% battery` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-accent-success font-mono">
                <Route className="w-3.5 h-3.5" /> {trip.distanceCoveredKm.toFixed(1)} km
              </span>
              <span className="flex items-center gap-1 text-accent-warning font-mono">
                <Gauge className="w-3.5 h-3.5" /> {trip.currentSpeedKmh?.toFixed(0) || 0} km/h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
