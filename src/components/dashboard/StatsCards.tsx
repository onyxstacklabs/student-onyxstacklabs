'use client';

import React from 'react';

interface StatItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const statsData: StatItem[] = [
  {
    title: 'Enrolled Courses',
    value: '6 Courses',
    change: '+2 this term',
    isPositive: true,
    icon: '📚',
  },
  {
    title: 'Hours Learned',
    value: '42.5 hrs',
    change: '+12% this week',
    isPositive: true,
    icon: '⏱️',
  },
  {
    title: 'Assignments',
    value: '18 / 20',
    change: '90% completion',
    isPositive: true,
    icon: '✅',
  },
  {
    title: 'Average Grade',
    value: '3.85 GPA',
    change: '+0.15 vs last sem',
    isPositive: true,
    icon: '🎯',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{stat.title}</span>
            <span className="text-xl p-2 bg-slate-950 rounded-lg border border-slate-800/60">
              {stat.icon}
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
            <p
              className={`text-xs mt-1 font-medium ${
                stat.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
