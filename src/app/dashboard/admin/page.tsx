'use client';

import React from 'react';
import Link from 'next/link';
import { AnalyticsDashboardCard } from '@/components/analytics/AnalyticsDashboardCard';
import { SeoManagerCard } from '@/components/seo/SeoManagerCard';
import { ShieldCheck, BookOpen, PenSquare, ArrowUpRight, Globe, Layers } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Super Admin Portal</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Operations & Governance
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Manage multi-tenant indexing, telemetry, SEO rules, and published content across Onyx Stack Labs.
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center space-x-3">
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Public Blog</span>
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
