'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
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
    async function fetchStudentStats() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        // Fetch real aggregated student stats from Firestore
        const statsRef = doc(db, 'student_metrics', user.uid);
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          const data = statsSnap.data();
          setStats({
            enrolledCoursesCount: data.enrolledCoursesCount || 0,
            totalStudyHours: data.totalStudyHours || 0,
            completedAssignments: data.completedAssignments || 0,
            totalAssignments: data.totalAssignments || 0,
            currentGpa: data.currentGpa || 0.0,
          });
        } else {
          // Default fresh state for newly onboarded students
          setStats({
            enrolledCoursesCount: 0,
            totalStudyHours: 0,
            completedAssignments: 0,
            totalAssignments: 0,
            currentGpa: 0.0,
          });
        }
      } catch (error) {
        console.error('[StatsCards] Error fetching live student metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudentStats();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <div className="h-3 w-20 bg-slate-800 animate-pulse rounded"></div>
            <div className="h-7 w-28 bg-slate-800 animate-pulse rounded"></div>
            <div className="h-3 w-16 bg-slate-800 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Enrolled Courses',
      value: `${stats?.enrolledCoursesCount || 0} Courses`,
      subtext: stats?.enrolledCoursesCount ? 'Active semester' : 'No courses joined',
      isPositive: true,
      icon: '📚',
    },
    {
      title: 'Hours Learned',
      value: `${stats?.totalStudyHours || 0} hrs`,
      subtext: 'Tracked learning time',
      isPositive: true,
      icon: '⏱️',
    },
    {
      title: 'Assignments',
      value: `${stats?.completedAssignments || 0} / ${stats?.totalAssignments || 0}`,
      subtext:
        stats?.totalAssignments && stats.totalAssignments > 0
          ? `${Math.round((stats.completedAssignments / stats.totalAssignments) * 100)}% completion`
          : 'No active tasks',
      isPositive: true,
      icon: '✅',
    },
    {
      title: 'Cumulative GPA',
      value: stats?.currentGpa ? `${stats.currentGpa.toFixed(2)} GPA` : 'N/A',
      subtext: stats?.currentGpa ? 'Verified record' : 'Awaiting grade submission',
      isPositive: true,
      icon: '🎯',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
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
            <p className="text-xs mt-1 font-medium text-indigo-400">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
