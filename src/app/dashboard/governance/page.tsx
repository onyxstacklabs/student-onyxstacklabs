'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  UserCheck,
  Building,
  Bell,
  RefreshCw,
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  category: 'Security' | 'Medical' | 'Facilities';
  location: string;
  status: 'In Progress' | 'Resolved' | 'Active';
  time: string;
}

export default function SmartGovernanceDashboardPage() {
  const { profile } = useAuth();
  const studentName = profile?.displayName || 'Student User';

  // SOS Emergency Dispatch State
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);

  // Digital ID Verification State
  const [rfidVerified, setRfidVerified] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Incidents Filter State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [incidents] = useState<Incident[]>([
    {
      id: 'inc-1',
      title: 'Main Gate Access Control Maintenance',
      category: 'Facilities',
      location: 'Gate 01 - North Entrance',
      status: 'In Progress',
      time: '10 mins ago',
    },
    {
      id: 'inc-2',
      title: 'First Aid Kit Replenishment Complete',
      category: 'Medical',
      location: 'Student Union First Aid Post',
      status: 'Resolved',
      time: '45 mins ago',
    },
    {
      id: 'inc-3',
      title: 'Routine Night Patrol Clearance',
      category: 'Security',
      location: 'Library & Hostel Quad',
      status: 'Resolved',
      time: '2 hours ago',
    },
  ]);

  const handleTriggerSOS = () => {
    if (sosTriggered) {
      setSosTriggered(false);
      setSosCountdown(null);
      return;
    }

    setSosCountdown(3);
    const interval = setInterval(() => {
      setSosCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setSosTriggered(true);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const handleSimulateScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setRfidVerified(true);
    }, 1200);
  };

  const filteredIncidents = incidents.filter(
    (inc) => activeCategory === 'All' || inc.category === activeCategory
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      {/* Page Header Banner */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Smart Governance & Safety Portal
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Emergency SOS response dispatch, digital RFID identification, and campus alert tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>Gateway Ready</span>
          </span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Emergency SOS Button & Active Incidents (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SOS Dispatch Box */}
          <div
            className={`p-6 rounded-2xl border transition shadow-sm ${
              sosTriggered
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wide">
                  Emergency Protocol
                </span>
                <h2 className="text-base font-bold text-white mt-1">
                  Instant Campus Emergency SOS
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Pressing this button broadcasts your exact GPS coordinates directly to Campus Security & Medical teams.
                </p>
              </div>

              <button
                onClick={handleTriggerSOS}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 shrink-0 ${
                  sosTriggered
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {sosCountdown !== null
                    ? `Hold On... (${sosCountdown}s)`
                    : sosTriggered
                    ? 'Cancel SOS Emergency'
                    : 'Trigger SOS Alert'}
                </span>
              </button>
            </div>

            {/* Active SOS Confirmation State */}
            {sosTriggered && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SOS Broadcast Active • Campus Security Notified</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  Stay calm! A security team member has been dispatched to your current location. If this was a test or accident, tap the button above to cancel.
                </p>
              </div>
            )}
          </div>

          {/* Campus Incident Tracker */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                Campus Governance & Safety Log
              </h2>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {['All', 'Security', 'Medical', 'Facilities'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Cards */}
            <div className="space-y-3">
              {filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {inc.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {inc.time}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white">{inc.title}</p>
                    <p className="text-[11px] text-slate-400">{inc.location}</p>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded border shrink-0 ${
                      inc.status === 'Resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Digital ID Verification & Hotline Directory */}
        <div className="space-y-6">
          {/* Digital RFID Student Badge */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-400" />
                Digital Student RFID Badge
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Verified ID</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 text-xl font-bold">
                {studentName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{studentName}</p>
                <p className="text-[11px] text-slate-400">Student ID: OS-2026-908</p>
                <p className="text-[10px] font-mono text-indigo-400 mt-1">OnyxStack Labs Portal</p>
              </div>

              <button
                onClick={handleSimulateScan}
                disabled={isVerifying}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Verifying RFID Token...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{rfidVerified ? 'RFID Clearance Valid' : 'Verify RFID'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Helplines */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Campus Helpline Directory
            </h3>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Campus Control Room</span>
                <span className="font-mono font-bold text-indigo-400">+1 (800) 555-0199</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Medical Center</span>
                <span className="font-mono font-bold text-emerald-400">+1 (800) 555-0122</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Hostel Warden Office</span>
                <span className="font-mono font-bold text-slate-400">+1 (800) 555-0144</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
