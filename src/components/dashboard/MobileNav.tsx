'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖' },
  { label: 'Notes Workspace', href: '/dashboard/notes', icon: '📝' },
  { label: 'Campus Mobility', href: '/dashboard/mobility', icon: '📍' },
  { label: 'Safety & Governance', href: '/dashboard/governance', icon: '🛡️' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar Navigation Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20">
            O
          </div>
          <span className="text-xs font-bold text-white tracking-wide">
            OnyxStack Labs
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-950/80 border border-slate-800 transition active:scale-95 flex items-center gap-1.5"
          aria-label="Toggle navigation drawer"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <span>✕</span> Close
            </>
          ) : (
            <>
              <span>☰</span> Menu
            </>
          )}
        </button>
      </div>

      {/* Backdrop Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-4 z-50 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-500/20">
                O
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-none">
                  OnyxStack Labs
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Student Portal
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-100 transition rounded-md"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2 font-mono">
              Workspaces
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-base" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Badge */}
        <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Mobile Context</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">v1.0.0 Enterprise</p>
        </div>
      </div>
    </>
  );
}
