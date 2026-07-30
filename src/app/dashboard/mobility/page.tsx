'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
  // Routes Data State
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

  // Charging Stations State
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
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Navigation className="w-5 h-5" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Smart Campus Mobility Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400 pl-11">
            Real-time shuttle tracking, eco-transit routes, and EV charging station reservations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Shuttles Active</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>EV Docks Ready</span>
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Selection & Live Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Selector */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Bus className="w-4 h-4 text-indigo-400" />
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
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {route.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{route.type}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-emerald-400">
                      {route.eta}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        route.status.includes('Delayed')
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  Selected Route
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedRoute.name}
                </h3>
              </div>
              <button
                onClick={handleBookShuttle}
                disabled={bookedPass}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto"
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
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                      <MapPin className="w-3 h-3 text-indigo-400" />
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
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
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
                  className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">{station.name}</p>
                    <p className="text-[10px] text-slate-400">{station.location}</p>
                    <p className="text-[10px] font-mono text-indigo-400">{station.power}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Available:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {station.availableDocks} / {station.totalDocks}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReserveDock(station.id)}
                      className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
                        reservedDockId === station.id
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
          {/* Weather Widget */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-400" />
                Campus Transit Weather
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Ideal Walking</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <p className="text-xl font-bold text-white">26°C</p>
                <p className="text-[10px] text-slate-400">Clear Sky • Mild Breeze</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-300">AQI: 42</p>
                <p className="text-[10px] text-emerald-400 font-mono">Good Quality</p>
              </div>
            </div>
          </div>

          {/* Travel Stats Summary */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              Your Mobility Overview
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Shuttle Rides Saved</span>
                <span className="font-mono font-bold text-white">14 Trips</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Carbon Offset</span>
                <span className="font-mono font-bold text-emerald-400">12.4 kg CO₂</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">EV Dock Reservations</span>
                <span className="font-mono font-bold text-indigo-400">3 Total</span>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-300">E-Scooter Speed Limit</p>
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
