'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  timestamp?: string;
  status: 'completed' | 'pending' | 'urgent';
  icon?: string;
}

export default function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUserActivities() {
      if (!user?.uid) {
        if (mounted) setLoading(false);
        return;
      }

      try {
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

          // Safe Timestamp Formatting (Firestore Timestamp vs raw String/Number)
          let formattedTime = 'Just now';
          if (data.timestamp?.toDate) {
            formattedTime = data.timestamp.toDate().toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          } else if (data.timestamp) {
            formattedTime = new Date(data.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
          }

          fetchedActivities.push({
            id: doc.id,
            title: data.title || 'Platform Event Logged',
            category: data.category || 'Academic',
            timestamp: formattedTime,
            status: data.status || 'pending',
            icon: data.icon || '📌',
          });
        });

        if (mounted) {
          setActivities(fetchedActivities);
        }
      } catch (error) {
        console.error('[RecentActivity] Error fetching live telemetry:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchUserActivities();

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="h-4 w-40 bg-slate-800 animate-pulse rounded"></div>
        <div className="h-14 bg-slate-950/50 animate-pulse rounded-xl"></div>
        <div className="h-14 bg-slate-950/50 animate-pulse rounded-xl"></div>
        <div className="h-14 bg-slate-950/50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Recent Activity & Telemetry</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Live student actions & platform log stream</p>
        </div>
        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
          Firestore Telemetry
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-6 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-center space-y-1">
          <p className="text-xs font-medium text-slate-300">No telemetry logs recorded yet.</p>
          <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
            Your dynamic note saves, AI chat history, campus safety dispatches, and course interactions will display here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activities.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-950/50 border border-slate-800/70 rounded-xl flex items-center justify-between gap-3 hover:border-slate-700 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-base p-2 bg-slate-900 border border-slate-800 rounded-lg shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                  {item.icon || '📌'}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-indigo-400 font-mono font-medium">{item.category}</span>
                    <span className="text-[10px] text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold tracking-wider shrink-0 uppercase border ${
                  item.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : item.status === 'urgent'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
