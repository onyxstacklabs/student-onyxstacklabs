'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface StudentStats {
  enrolledCoursesCount: number;
  totalStudyHours: number;
  completedAssignments: number;
  totalAssignments: number;
  currentGpa: number;
}

export default function StatsCards() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchStudentStats() {
      if (!user?.uid) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const statsRef = doc(db, 'student_metrics', user.uid);
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists() && mounted) {
          const data = statsSnap.data();
          setStats({
            enrolledCoursesCount: Number(data.enrolledCoursesCount) || 0,
            totalStudyHours: Number(data.totalStudyHours) || 0,
            completedAssignments: Number(data.completedAssignments) || 0,
            totalAssignments: Number(data.totalAssignments) || 0,
            currentGpa: Number(data.currentGpa) || 0.0,
          });
        } else if (mounted) {
          setStats({
            enrolledCoursesCount: 0,
            totalStudyHours: 0,
            completedAssignments: 0,
            totalAssignments: 0,
            currentGpa: 0.0,
          });
        }
      } catch (error) {
        console.error('[StatsCards] Error synchronizing live student metrics:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStudentStats();

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="h-3 w-24 bg-slate-800 animate-pulse rounded"></div>
            <div className="h-7 w-28 bg-slate-800 animate-pulse rounded"></div>
            <div className="h-3 w-20 bg-slate-800 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage =
    stats?.totalAssignments && stats.totalAssignments > 0
      ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100)
      : 0;

  const statItems = [
    {
      title: 'Enrolled Courses',
      value: `${stats?.enrolledCoursesCount || 0}`,
      unit: 'Courses',
      subtext: stats?.enrolledCoursesCount ? 'Active semester' : 'No courses joined',
      icon: '📚',
    },
    {
      title: 'Hours Learned',
      value: `${stats?.totalStudyHours || 0}`,
      unit: 'hrs',
      subtext: 'Tracked study time',
      icon: '⏱️',
    },
    {
      title: 'Assignments',
      value: `${stats?.completedAssignments || 0} / ${stats?.totalAssignments || 0}`,
      unit: '',
      subtext:
        stats?.totalAssignments && stats.totalAssignments > 0
          ? `${completionPercentage}% completion`
          : 'No active tasks',
      icon: '✅',
    },
    {
      title: 'Cumulative GPA',
      value: stats?.currentGpa ? stats.currentGpa.toFixed(2) : 'N/A',
      unit: stats?.currentGpa ? 'GPA' : '',
      subtext: stats?.currentGpa ? 'Verified transcript' : 'Pending submission',
      icon: '🎯',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {stat.title}
            </span>
            <span className="text-lg p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 group-hover:scale-110 transition-transform">
              {stat.icon}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </h3>
              {stat.unit && (
                <span className="text-xs font-medium text-slate-400 font-mono">
                  {stat.unit}
                </span>
              )}
            </div>
            <p className="text-xs mt-1 font-medium text-indigo-400">
              {stat.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
