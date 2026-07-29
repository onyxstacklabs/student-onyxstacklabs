'use client';

import React, { useState, useEffect } from 'react';
import { EmergencyAlert, IncidentCategory } from '@/types/governance';
import { getActiveEmergencyAlerts, triggerSOSAlert, resolveEmergencyAlert } from '@/lib/governance/sosService';
import { AlertTriangle, ShieldAlert, CheckCircle2, PhoneCall, Radio, Flame, Stethoscope, Shield, AlertCircle } from 'lucide-react';

export function EmergencySOSButton() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('security');
  const [locationInput, setLocationInput] = useState('Central Campus Plaza - Near North Library Gate');

  useEffect(() => {
    setAlerts(getActiveEmergencyAlerts());
  }, []);

  const handleTriggerSOS = () => {
    const newAlert = triggerSOSAlert(
      'usr-current',
      'Student Account (Authenticated)',
      locationInput,
      selectedCategory,
      'critical',
      'Emergency SOS triggered directly from Smart Governance Portal.'
    );
    setAlerts([...getActiveEmergencyAlerts()]);
    setIsTriggering(false);
  };

  const handleResolveAlert = (id: string) => {
    resolveEmergencyAlert(id);
    setAlerts([...getActiveEmergencyAlerts()]);
  };

  const getCategoryIcon = (category: IncidentCategory) => {
    switch (category) {
      case 'medical':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-sky-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Campus Emergency Dispatch</h3>
            <span className="text-xs text-slate-400">1-Tap Rapid Response Protocol</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>Security Line 24/7</span>
        </span>
      </div>

      {/* SOS Button Box */}
      {!isTriggering ? (
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Require Immediate Emergency Assistance?</h4>
            <p className="text-xs text-slate-400">
              Pressing SOS immediately alerts Campus First Responders with your geotagged location.
            </p>
          </div>
          <button
            onClick={() => setIsTriggering(true)}
            className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center space-x-2 transition-all transform active:scale-95 shrink-0"
          >
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <span>TRIGGER SOS EMERGENCY</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-rose-950/30 border border-rose-500/50 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-rose-200 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Confirm Emergency SOS Broadcast</span>
            </h4>
            <button
              onClick={() => setIsTriggering(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Select Incident Type:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['security', 'medical', 'fire', 'facility'] as IncidentCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-2 rounded-lg text-xs font-semibold capitalize border flex items-center space-x-1.5 justify-center ${
                      selectedCategory === cat
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Confirm Incident Location:</label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              onClick={handleTriggerSOS}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-colors shadow-md"
            >
              CONFIRM & BROADCAST ALERT NOW
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts List */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Live Campus Safety Alerts Feed</h4>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(alert.category)}
                  <span className="text-xs font-bold text-white uppercase">{alert.category} Alert</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      alert.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : alert.status === 'dispatching'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{alert.location}</p>
                {alert.notes && <p className="text-[11px] text-slate-400 italic">{alert.notes}</p>}
              </div>

              {alert.status !== 'resolved' && (
                <button
                  onClick={() => handleResolveAlert(alert.id)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg shrink-0 flex items-center space-x-1 border border-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mark Resolved</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
