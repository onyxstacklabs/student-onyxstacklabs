'use client';

import React, { useState, useEffect } from 'react';
import { WeatherCondition } from '@/types/mobility';
import { getCampusWeather, evaluateTransitSafety } from '@/lib/mobility/weatherService';
import { Sun, Cloud, CloudRain, Wind, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

export function CampusWeatherWidget() {
  const [weather, setWeather] = useState<WeatherCondition | null>(null);

  useEffect(() => {
    // In production, this can poll real campus environmental sensors or weather APIs
    const data = getCampusWeather();
    setWeather(data);
  }, []);

  if (!weather) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse flex justify-between items-center">
        <div className="h-4 w-32 bg-slate-800 rounded"></div>
        <div className="h-4 w-16 bg-slate-800 rounded"></div>
      </div>
    );
  }

  const safetyEval = evaluateTransitSafety(weather);

  const getWeatherIcon = (condition: string) => {
    const condLower = condition.toLowerCase();
    if (condLower.includes('rain')) return <CloudRain className="w-6 h-6 text-sky-400" />;
    if (condLower.includes('cloud')) return <Cloud className="w-6 h-6 text-slate-300" />;
    if (condLower.includes('wind')) return <Wind className="w-6 h-6 text-teal-300" />;
    return <Sun className="w-6 h-6 text-amber-400" />;
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-200 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          {getWeatherIcon(weather.condition)}
          <div>
            <h4 className="text-sm font-semibold text-white">Campus Weather</h4>
            <span className="text-xs text-slate-400">{weather.condition}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Thermometer className="w-4 h-4 text-rose-400" />
          <span className="text-base font-bold text-white font-mono">{weather.temperatureCelsius}°C</span>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
          <span className="text-slate-400">Wind Speed</span>
          <span className="font-semibold text-slate-200 font-mono">{weather.windSpeedKmh} km/h</span>
        </div>
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
          <span className="text-slate-400">Precipitation</span>
          <span className="font-semibold text-slate-200 font-mono">{weather.precipitationProbability}%</span>
        </div>
      </div>

      {/* Transit Safety Warning / Status */}
      {!safetyEval.isSafe && safetyEval.warningMessage ? (
        <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-start space-x-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>{safetyEval.warningMessage}</p>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Optimal weather conditions for campus walking & EV scooter transit.</span>
        </div>
      )}
    </div>
  );
}
