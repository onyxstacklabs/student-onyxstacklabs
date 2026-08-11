'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Navigation,
  ShieldCheck,
  Zap,
  Bus,
  BatteryCharging,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  SunMedium,
  PlayCircle,
} from 'lucide-react';
import { useLocationPermissions } from '@/lib/mobility/useLocationPermissions';
import { getCampusWeather, evaluateTransitSafety } from '@/lib/mobility/weatherService';
import { WeatherCondition } from '@/types/mobility';
import { PageHeader } from '@/components/ui/PageHeader';

interface RouteOption {
  id: string;
  name: string;
  eta: string;
  type: string;
  status: string;
  stops: string[];
}

interface Station {
  id: string;
  name: string;
  availableDocks: number;
  totalDocks: number;
  location: string;
  power: string;
}

export default function SmartMobilityDashboardPage() {
  // ⚠️ Routes & EV docks still mock — locked as next structural step
  // (Institution-side location/route management needed before this can be real).
  const routes: RouteOption[] = [
    {
      id: 'r1',
      name: 'North-South Express Shuttle',
      eta: '4 mins away',
      type: 'Campus Shuttle Bus',
      status: 'On Time',
      stops: ['Main Entrance', 'Library Gate', 'Science Complex', 'Hostels'],
    },
    {
      id: 'r2',
      name: 'Academic Quad Loop',
      eta: '8 mins away',
      type: 'Electric Cart',
      status: 'On Time',
      stops: ['Engineering Block', 'Student Union', 'Sports Complex'],
    },
    {
      id: 'r3',
      name: 'Hostel Night Cruiser',
      eta: '12 mins away',
      type: 'Shuttle Van',
      status: 'Delayed 3 mins',
      stops: ['Hostel Sector A', 'Cafeteria', 'Central Library'],
    },
  ];

  const [stations, setStations] = useState<Station[]>([
    {
      id: 'st1',
      name: 'Library Solar Hub',
      availableDocks: 4,
      totalDocks: 6,
      location: 'Behind Central Library',
      power: 'Fast Charging (22kW)',
    },
    {
      id: 'st2',
      name: 'Engineering Block Dock',
      availableDocks: 1,
      totalDocks: 4,
      location: 'Block C Parking',
      power: 'Standard (11kW)',
    },
    {
      id: 'st3',
      name: 'Student Center Station',
      availableDocks: 3,
      totalDocks: 5,
      location: 'Near Food Court',
      power: 'Fast Charging (22kW)',
    },
  ]);

  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(routes[0]);
  const [bookedPass, setBookedPass] = useState(false);
  const [reservedDockId, setReservedDockId] = useState<string | null>(null);

  const { permissionState, coordinates, error: locationError, isLoading: locationLoading, requestPermission } =
    useLocationPermissions();
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    if (permissionState === 'prompt') {
      requestPermission();
    }
  }, [permissionState, requestPermission]);

  useEffect(() => {
    if (!coordinates) return;
    let mounted = true;
    setWeatherLoading(true);
    setWeatherError('');
    getCampusWeather(coordinates.lat, coordinates.lng)
      .then((data) => {
        if (mounted) setWeather(data);
      })
      .catch(() => {
        if (mounted) setWeatherError('Could not load live weather.');
      })
      .finally(() => {
        if (mounted) setWeatherLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [coordinates]);

  const transitSafety = weather ? evaluateTransitSafety(weather) : null;

  const handleBookShuttle = () => {
    setBookedPass(true);
    setTimeout(() => setBookedPass(false), 4000);
  };

  const handleReserveDock = (stationId: string) => {
    if (reservedDockId === stationId) {
      setReservedDockId(null);
      setStations((prev) =>
        prev.map((s) =>
          s.id === stationId ? { ...s, availableDocks: s.availableDocks + 1 } : s
        )
      );
    } else {
      setReservedDockId(stationId);
      setStations((prev) =>
        prev.map((s) =>
          s.id === stationId && s.availableDocks > 0
            ? { ...s, availableDocks: s.availableDocks - 1 }
            : s
        )
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      <PageHeader
        icon={Navigation}
        title="Smart Campus Mobility Hub"
        description="Real-time shuttle tracking, eco-transit routes, and EV charging station reservations."
        actions={
          <>
            <Link
              href="/dashboard/mobility/trip"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition shadow-lg shadow-brand-600/20"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Start Commute</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-accent-success/10 text-accent-success border border-accent-success/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Shuttles Active</span>
            </span>
          </>
        }
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Selection & Live Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Selector */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Bus className="w-4 h-4 text-brand-400" />
                Select Campus Shuttle Route
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Live Updates Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    selectedRoute.id === route.id
                      ? 'bg-brand-600/10 border-brand-500 text-white'
                      : 'bg-surface-base/60 border-surface-border text-slate-400 hover:border-surface-borderHover hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {route.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{route.type}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-accent-success">
                      {route.eta}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        route.status.includes('Delayed')
                          ? 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20'
                          : 'bg-accent-success/10 text-accent-success border border-accent-success/20'
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Route Details & Pass Booking */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border/80">
              <div>
                <span className="text-[10px] font-mono text-brand-400 uppercase font-semibold">
                  Selected Route
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedRoute.name}
                </h3>
              </div>
              <button
                onClick={handleBookShuttle}
                disabled={bookedPass}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-accent-success text-white text-xs font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto"
              >
                {bookedPass ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Pass Confirmed!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request Priority Pass</span>
                  </>
                )}
              </button>
            </div>

            {/* Route Stops List */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400">Route Stops & Sequence:</p>
              <div className="flex flex-wrap items-center gap-2">
                {selectedRoute.stops.map((stop, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-base border border-surface-border text-xs text-slate-200">
                      <MapPin className="w-3 h-3 text-brand-400" />
                      <span>{stop}</span>
                    </div>
                    {idx < selectedRoute.stops.length - 1 && (
                      <span className="text-slate-600 text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Charging Stations List */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-accent-success" />
                EV & Scooter Charging Docks
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Solar Powered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="p-3.5 bg-surface-base/80 border border-surface-border rounded-xl flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{station.name}</p>
                    <p className="text-[10px] text-slate-400">{station.location}</p>
                    <p className="text-[10px] font-mono text-brand-400">{station.power}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-surface-border/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Available:</span>
                      <span className="font-mono font-bold text-accent-success">
                        {station.availableDocks} / {station.totalDocks}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReserveDock(station.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                        reservedDockId === station.id
                          ? 'bg-accent-danger/20 text-red-300 border border-accent-danger/30'
                          : 'bg-accent-success hover:opacity-90 text-white'
                      }`}
                    >
                      {reservedDockId === station.id ? 'Cancel Dock' : 'Reserve Dock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Campus Weather & Travel Stats */}
        <div className="space-y-6">
          {/* Weather Widget — REAL, GPS + Open-Meteo backed */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-accent-warning" />
                Campus Transit Weather
              </span>
              {transitSafety && (
                <span
                  className={`text-[10px] font-mono ${
                    transitSafety.isSafe ? 'text-accent-success' : 'text-accent-warning'
                  }`}
                >
                  {transitSafety.isSafe ? 'Ideal Conditions' : 'Caution Advised'}
                </span>
              )}
            </div>

            {permissionState === 'denied' ? (
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs text-slate-400">
                Location access denied. Enable location permissions to see live weather.
              </div>
            ) : locationLoading || weatherLoading ? (
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs text-slate-500 text-center">
                Loading weather...
              </div>
            ) : weatherError || locationError ? (
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs text-accent-danger">
                {weatherError || locationError}
              </div>
            ) : weather ? (
              <div className="flex items-center justify-between bg-surface-base p-3 rounded-xl border border-surface-border">
                <div>
                  <p className="text-xl font-bold text-white">{weather.temperatureCelsius}°C</p>
                  <p className="text-[10px] text-slate-400">
                    {weather.condition} • Wind {weather.windSpeedKmh} km/h
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-300">
                    {weather.precipitationProbability}% rain
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs text-slate-500 text-center">
                Weather unavailable.
              </div>
            )}

            {transitSafety && !transitSafety.isSafe && transitSafety.warningMessage && (
              <p className="text-[11px] text-accent-warning leading-relaxed">
                {transitSafety.warningMessage}
              </p>
            )}
          </div>

          {/* Travel Stats Summary */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" />
              Your Mobility Overview
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400">Shuttle Rides Saved</span>
                <span className="font-mono font-bold text-white">14 Trips</span>
              </div>
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400">Carbon Offset</span>
                <span className="font-mono font-bold text-accent-success">12.4 kg CO₂</span>
              </div>
              <div className="p-3 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400">EV Dock Reservations</span>
                <span className="font-mono font-bold text-brand-400">3 Total</span>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-accent-warning/10 border border-accent-warning/20 rounded-card flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-accent-warning shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-accent-warning">E-Scooter Speed Limit</p>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Campus speed limit for electric scooters is restricted to 15 km/h inside the Academic Quad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
