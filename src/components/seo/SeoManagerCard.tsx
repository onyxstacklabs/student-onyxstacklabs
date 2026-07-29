'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/lib/seo/metadataEngine';
import { Search, Globe, Share2, AlertCircle, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

export function SeoManagerCard() {
  const [metaTitle, setMetaTitle] = useState('Introducing the Onyx Enterprise Student SaaS Platform');
  const [metaDescription, setMetaDescription] = useState(
    'An all-in-one multi-tenant campus governance and AI-assisted learning platform designed for modern academic institutions.'
  );
  const [slug, setSlug] = useState('introducing-onyx-student-saas-platform');
  const [noIndex, setNoIndex] = useState(false);

  // Simple SEO Health Scoring Logic
  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  const isTitleOk = titleLength >= 30 && titleLength <= 60;
  const isDescOk = descLength >= 80 && descLength <= 160;

  let seoScore = 100;
  if (!isTitleOk) seoScore -= 25;
  if (!isDescOk) seoScore -= 25;
  if (noIndex) seoScore -= 30;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Advanced SEO & Metadata Manager</h2>
            <p className="text-xs text-slate-400">Optimize meta tags, OpenGraph preview cards, and search engine visibility</p>
          </div>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">SEO Health:</span>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              seoScore >= 80
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {seoScore}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            Page Metadata Parameters
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-semibold text-slate-300">Meta Title</label>
              <span className={`font-mono ${isTitleOk ? 'text-emerald-400' : 'text-amber-400'}`}>
                {titleLength} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-semibold text-slate-300">Meta Description</label>
              <span className={`font-mono ${isDescOk ? 'text-emerald-400' : 'text-amber-400'}`}>
                {descLength} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL Slug</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-xs">
              <span className="px-2.5 py-2 text-slate-500 bg-slate-900 border-r border-slate-800 font-mono">
                /blog/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-slate-200 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Indexing Directive */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-300 block">Search Engine Indexing</span>
              <span className="text-[11px] text-slate-500 block">
                {noIndex ? 'Page is hidden from Google (noindex)' : 'Page is open for search crawlers (index, follow)'}
              </span>
            </div>
            <button
              onClick={() => setNoIndex(!noIndex)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                noIndex
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {noIndex ? 'NOINDEX' : 'INDEXABLE'}
            </button>
          </div>
        </div>

        {/* Live Search Engine Simulation */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-400" />
            Google Desktop Search Preview
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-400 truncate font-mono">
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{SITE_CONFIG.baseUrl} › blog › {slug}</span>
            </div>
            <h4 className="text-base font-semibold text-indigo-400 hover:underline cursor-pointer leading-snug truncate">
              {metaTitle || 'Page Title Placeholder'}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {metaDescription || 'Page description preview will appear here in Google search results.'}
            </p>
          </div>

          {/* Audit Checks */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Title Length Status:</span>
              {isTitleOk ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal</span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Adjust Length</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Meta Description Status:</span>
              {isDescOk ? (
                <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Optimal</span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Adjust Length</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
