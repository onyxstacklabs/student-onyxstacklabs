'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getActiveSOSForInstitution, updateSOSStatus, SOSAlert } from '@/lib/academics/emergency';
import { AlertTriangle, Check, Eye } from 'lucide-react';

export function EmergencyAlertsPanel() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlerts = async () => {
    if (!user?.uid) return;
    try {
      const data = await getActiveSOSForInstitution(user.uid);
      setAlerts(data);
    } catch (e) {
      setError('Could not load emergency alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    // Poll every 15s for new alerts — simple, reliable, no extra infra needed.
    const interval = setInterval(loadAlerts, 15000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  const handleAcknowledge = async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a)));
    try {
      await updateSOSStatus(id, 'ACKNOWLEDGED');
    } catch (e) {
      setError('Failed to update alert status.');
    }
  };

  const handleResolve = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await updateSOSStatus(id, 'RESOLVED');
    } catch (e) {
      setError('Failed to resolve alert.');
    }
  };

  if (loading) return null;
  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-6 space-y-4 animate-pulse-slow">
      <h3 className="text-base font-bold text-red-300 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Active Emergency Alerts ({alerts.length})
      </h3>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 bg-slate-950 border border-red-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{alert.studentName}</p>
                <p className="text-xs text-slate-400">
                  {alert.className} · Roll No. {alert.rollNumber}
                </p>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-1 rounded-full uppercase ${
                  alert.status === 'ACTIVE'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {alert.status}
              </span>
            </div>
            {alert.message && (
              <p className="text-sm text-slate-300 bg-slate-900 p-2.5 rounded-lg">{alert.message}</p>
            )}
            <div className="flex gap-2 pt-1">
              {alert.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Acknowledge
                </button>
              )}
              <button
                onClick={() => handleResolve(alert.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
