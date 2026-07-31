'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getPlatformStats, PlatformStats } from '@/lib/academics/platformStats';
import { listInstitutions, InstitutionOption } from '@/lib/academics/institutions';
import { AnalyticsDashboardCard } from '@/components/analytics/AnalyticsDashboardCard';
import { SeoManagerCard } from '@/components/seo/SeoManagerCard';
import { 
  ShieldCheck, 
  BookOpen, 
  PenSquare, 
  ArrowUpRight, 
  Globe, 
  Layers,
  Users,
  Building2,
  ShieldAlert,
} from 'lucide-react';

function SuperAdminDashboard() {
  const { profile, role } = useAuth();

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    getPlatformStats()
      .then((data) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load platform statistics.');
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });

    listInstitutions()
      .then((data) => {
        if (mounted) setInstitutions(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load institutions list.');
      })
      .finally(() => {
        if (mounted) setInstitutionsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Portal</span>
              </span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] rounded font-mono">
                Current Role: {role || profile?.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Operations & Governance
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Manage institutions, platform-wide access, and SaaS telemetry across OnyxStack Labs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Public Blog</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            </Link>

            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Live Sitemap</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
        )}

        {/* Real Platform Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">Total Institutions</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {statsLoading ? '—' : stats?.totalInstitutions ?? 0}
            </div>
            <p className="text-[11px] text-slate-400">Registered on the platform</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">Total Students</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              {statsLoading ? '—' : stats?.totalStudents ?? 0}
            </div>
            <p className="text-[11px] text-slate-400">Across all institutions</p>
          </div>
        </div>

        {/* Institutions List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Registered Institutions
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {institutionsLoading ? '...' : `${institutions.length} Total`}
            </span>
          </div>

          {institutionsLoading ? (
            <p className="text-xs text-slate-500 py-4 text-center">Loading institutions...</p>
          ) : institutions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No institutions registered yet.</p>
          ) : (
            <div className="space-y-2">
              {institutions.map((inst) => (
                <div
                  key={inst.uid}
                  className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg"
                >
                  <span className="text-sm font-medium text-white">{inst.institutionName}</span>
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">{inst.uid}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics & Visitor Telemetry — not yet reviewed, keeping as-is */}
        <section className="space-y-3">
          <AnalyticsDashboardCard />
        </section>

        {/* SEO & Content Controls — SeoManagerCard not yet reviewed, keeping as-is */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SeoManagerCard />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5 text-slate-200">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Content Engine & Publishing</h2>
                <p className="text-xs text-slate-400">Article creation, schema mapping, and distribution</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                The content engine uses dynamic server-side rendering combined with static site generation for optimal search engine indexing and speed.
              </p>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span className="flex items-center space-x-2">
                    <PenSquare className="w-4 h-4 text-indigo-400" />
                    <span>Rich Text Markdown Editor</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Active
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Supports HTML sanitization, real-time word/reading time metrics, category tagging, and JSON-LD metadata generation.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-mono text-[11px]">Indexing Status: Published Articles Auto-Synced</span>
                <Link
                  href="/blog"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1"
                >
                  <span>Browse Articles</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
}
