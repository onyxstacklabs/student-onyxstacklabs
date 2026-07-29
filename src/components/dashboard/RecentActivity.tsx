'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config'; // Direct Firestore client instance
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  timestamp?: number | string;
  status: 'completed' | 'pending' | 'urgent';
  icon?: string;
}

export default function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserActivities() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        // Fetch real student activity telemetry/tasks from Firestore
        const q = query(
          collection(db, 'activity_telemetry'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const fetchedActivities: ActivityItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedActivities.push({
            id: doc.id,
            title: data.title || 'Platform Event Logged',
            category: data.category || 'Academic',
            timestamp: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'Just now',
            status: data.status || 'pending',
            icon: data.icon || '📌',
          });
        });

        setActivities(fetchedActivities);
      } catch (error) {
        console.error('[RecentActivity] Error fetching live telemetry:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserActivities();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="h-4 w-36 bg-slate-800 animate-pulse rounded"></div>
        <div className="h-12 bg-slate-800/50 animate-pulse rounded-lg"></div>
        <div className="h-12 bg-slate-800/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity & Tasks</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Live platform telemetry & upcoming deadlines</p>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
          Firestore Telemetry
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-6 bg-slate-950/30 border border-dashed border-slate-800 rounded-lg text-center">
          <p className="text-xs text-slate-400">No active activity logs found.</p>
          <p className="text-[10px] text-slate-500 mt-1">
            Your dynamic course updates, SOS triggers, and study history will stream here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg flex items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                  {item.icon || '📌'}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-indigo-400 font-medium">{item.category}</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 border ${
                  item.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : item.status === 'urgent'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
