'use client';

import React from 'react';
import { useLocationPermissions } from '@/lib/mobility/useLocationPermissions';
import { MapPin, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react';

interface LocationPermissionBannerProps {
  onCoordinatesAcquired?: (coords: { lat: number; lng: number }) => void;
}

export function LocationPermissionBanner({ onCoordinatesAcquired }: LocationPermissionBannerProps) {
  const { permissionState, coordinates, error, isLoading, requestPermission } = useLocationPermissions();

  React.useEffect(() => {
    if (coordinates && onCoordinatesAcquired) {
      onCoordinatesAcquired(coordinates);
    }
  }, [coordinates, onCoordinatesAcquired]);

  if (permissionState === 'granted' && coordinates) {
    return (
      <div className="w-full bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between text-slate-200 shadow-md backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Location Access Active</h4>
            <p className="text-xs text-slate-400">
              Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          GPS Live
        </span>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className="w-full bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3 text-slate-200 shadow-md">
        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-200">Location Access Disabled</h4>
          <p className="text-xs text-slate-400 mt-1">
            {error || 'Location permissions are blocked in your browser. Please enable location access in your browser settings for accurate campus navigation and safety alerts.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-200 shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Enable Campus GPS Navigation</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Allow location access to detect nearby campus shuttle stops, route guidance, and safe arrival triggers.
          </p>
        </div>
      </div>
      <button
        onClick={requestPermission}
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 shrink-0 shadow-md"
      >
        <Navigation className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Acquiring Location...' : 'Enable Location'}</span>
      </button>
    </div>
  );
}
