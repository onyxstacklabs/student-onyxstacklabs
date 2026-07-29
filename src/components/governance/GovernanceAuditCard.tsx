'use client';

import React, { useState, useEffect } from 'react';
import { SecurityAuditLog } from '@/types/governance';
import { getSecurityAuditLogs } from '@/lib/governance/auditService';
import { ShieldCheck, ShieldAlert, ShieldX, Terminal, Filter, Globe } from 'lucide-react';

export function GovernanceAuditCard() {
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'allowed' | 'denied' | 'flagged'>('all');

  useEffect(() => {
    setLogs(getSecurityAuditLogs());
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusBadge = (status: SecurityAuditLog['status']) => {
    switch (status) {
      case 'allowed':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>ALLOWED</span>
          </span>
        );
      case 'denied':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full flex items-center space-x-1">
            <ShieldX className="w-3 h-3" />
            <span>DENIED</span>
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>FLAGGED</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Security Audit & Event Log</h3>
            <span className="text-xs text-slate-400">Governance Telemetry & API Audit Stream</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {(['all', 'allowed', 'denied', 'flagged'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                filter === mode
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-white">{log.action}</span>
                {getStatusBadge(log.status)}
              </div>
              <p className="text-xs text-slate-400">
                Resource: <span className="text-slate-200">{log.resource}</span> • Actor: <span className="text-indigo-300 font-mono">{log.actorId}</span> ({log.actorRole})
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-xs text-slate-400 border-t sm:border-t-0 border-slate-800/80 pt-1.5 sm:pt-0 shrink-0">
              <span className="flex items-center space-x-1 text-[11px]">
                <Globe className="w-3 h-3 text-slate-500" />
                <span className="font-mono">{log.ipAddress}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
