'use client';

import React from 'react';
import { BarChart3, Construction } from 'lucide-react';

export function AnalyticsDashboardCard() {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Platform Analytics & Telemetry</h2>
          <p className="text-xs text-slate-400">Visitor traffic, page performance, and device distribution</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
        <Construction className="w-10 h-10 text-slate-600" />
        <h3 className="text-slate-300 font-semibold text-sm">Analytics tracking not set up yet.</h3>
        <p className="text-slate-500 text-xs max-w-sm">
          Real visitor and page-view data will appear here once tracking is enabled across the platform.
        </p>
      </div>
    </div>
  );
}
