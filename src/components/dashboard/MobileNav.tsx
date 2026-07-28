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
  { label: 'Courses', href: '/dashboard/courses', icon: '📚' },
  { label: 'Progress', href: '/dashboard/progress', icon: '📈' },
  { label: 'AI Assistant', href: '/dashboard/ai-assistant', icon: '🤖' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar Toggle Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
            S
          </div>
          <span className="text-xs font-bold text-white">Student Portal</span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
          aria-label="Toggle Mobile Menu"
        >
          {isOpen ? '✕' : '☰ Menu'}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-4 z-40 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                S
              </div>
              <span className="text-sm font-bold text-white">OnyxStack Labs</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Mobile Navigation</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Responsive Active</p>
        </div>
      </div>
    </>
  );
}
