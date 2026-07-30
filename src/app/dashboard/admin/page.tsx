'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnalyticsDashboardCard } from '@/components/analytics/AnalyticsDashboardCard';
import { SeoManagerCard } from '@/components/seo/SeoManagerCard';
import { useAuth, UserRole } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  BookOpen, 
  PenSquare, 
  ArrowUpRight, 
  Globe, 
  Layers,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  UserCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

export default function AdminDashboardPage() {
  const { profile, role, loading, switchRole } = useAuth();
  const router = useRouter();

  // 🔒 STRICT ROLE GUARD & SECURITY CHECK
  useEffect(() => {
    if (!loading) {
      // Agar active role ADMIN nahi hai (jaise STUDENT hai), to instantly block karke normal dashboard par bhejo
      if (role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [role, loading, router]);

  // Mock SaaS system users state (Connects to Firestore in production)
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 'usr_1', name: 'Arhaam Admin', email: 'admin@onyxstacklabs.com', role: 'ADMIN', status: 'ACTIVE', joinedDate: '2026-01-15' },
    { id: 'usr_2', name: 'Sarah Tech', email: 'sarah@instructor.com', role: 'INSTRUCTOR', status: 'ACTIVE', joinedDate: '2026-03-10' },
    { id: 'usr_3', name: 'John Doe', email: 'john@student.edu', role: 'STUDENT', status: 'ACTIVE', joinedDate: '2026-05-22' },
  ]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-xs font-mono text-slate-400">Verifying Security Credentials...</p>
      </div>
    );
  }

  // 2. Block Render if User is NOT Admin (Prevents Security Flashes)
  if (role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
        <ShieldAlert className="w-10 h-10 text-rose-500" />
        <p className="text-sm font-semibold text-rose-400">Access Denied: Super Admin Privileges Required</p>
        <p className="text-xs text-slate-400">Redirecting to Student Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header & Live System Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Portal</span>
              </span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] rounded font-mono">
                Current Role: {role || profile?.role || 'ADMIN'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Operations & Governance
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Manage multi-tenant indexing, RBAC user access, SaaS telemetry, and SEO rules across OnyxStack Labs.
            </p>
          </div>

          {/* Quick Action Links & Dev Role Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={async () => {
                if (switchRole) {
                  await switchRole('STUDENT');
                  router.push('/dashboard');
                }
              }}
              className="px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
              title="Switch to Student View"
            >
              Test Student Portal
            </button>

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

        {/* Section: Key SaaS Telemetry & Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">Total SaaS Users</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">1,248</div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> +14% this month
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">Monthly Revenue (MRR)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">$4,850</div>
            <p className="text-[11px] text-slate-400">Active Paid Subscriptions</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">Active Workspaces</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">312</div>
            <p className="text-[11px] text-slate-400">Tenant Clusters Active</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-mono uppercase">System Health</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">99.9%</div>
            <p className="text-[11px] text-slate-400">Firestore & Auth Online</p>
          </div>
        </div>

        {/* Section: RBAC User Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              SaaS Identity & Role Access Control (RBAC)
            </h2>
            <span className="text-xs font-mono text-slate-400">3 Total Users Monitored</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">User</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right rounded-r-lg">Manage Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        u.role === 'ADMIN' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : u.role === 'INSTRUCTOR'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{u.joinedDate}</td>
                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 1: Analytics & Visitor Telemetry */}
        <section className="space-y-3">
          <AnalyticsDashboardCard />
        </section>

        {/* Section 2: SEO Engine & Content Controls */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* SEO Governance Engine */}
          <SeoManagerCard />

          {/* Content Management Studio Info Card */}
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
