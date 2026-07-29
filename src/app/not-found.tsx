import React from 'react';
import Link from 'next/link';
import { Compass, Home, BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        {/* 404 Badge & Icon */}
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
            ERROR 404
          </span>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The resource or URL you requested could not be located on the Onyx Stack Labs platform. It may have been moved or removed.
          </p>
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Browse Blog</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
          Onyx Stack Labs • Multi-Tenant Enterprise Engine
        </div>
      </div>
    </div>
  );
}
