'use client';

import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, Clock, Smartphone, Monitor, Tablet } from 'lucide-react';

export function AnalyticsDashboardCard() {
  const metrics = [
    { label: 'Total Page Views', value: '48,290', change: '+14.2%', icon: Eye, color: 'text-indigo-400' },
    { label: 'Unique Visitors', value: '12,840', change: '+8.7%', icon: Users, color: 'text-emerald-400' },
    { label: 'Avg. Session Duration', value: '3m 42s', change: '+5.1%', icon: Clock, color: 'text-amber-400' },
  ];

  const topPages = [
    { path: '/blog/introducing-onyx-student-saas-platform', views: '14,210', percentage: '29%' },
    { path: '/blog/scaling-multi-tenant-campus-architecture', views: '9,840', percentage: '20%' },
    { path: '/dashboard', views: '6,450', percentage: '13%' },
    { path: '/blog/ai-grading-assistance-workflow', views: '4,120', percentage: '8%' },
  ];

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Platform Analytics & Telemetry</h2>
            <p className="text-xs text-slate-400">Real-time visitor traffic, page performance, and device distribution</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-emerald-400">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Live Tracking Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{m.value}</span>
                <span className="text-[11px] font-bold text-emerald-400">{m.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content & Device Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Top Performing Pages
          </h3>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            {topPages.map((page) => (
              <div key={page.path} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 truncate max-w-[240px] sm:max-w-xs">
                    {page.path}
                  </span>
                  <span className="text-slate-400 font-mono">{page.views} views</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: page.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Device Distribution
          </h3>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-300">Mobile</span>
              </div>
              <span className="font-bold text-white font-mono">58%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Desktop</span>
              </div>
              <span className="font-bold text-white font-mono">34%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Tablet className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Tablet</span>
              </div>
              <span className="font-bold text-white font-mono">8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
