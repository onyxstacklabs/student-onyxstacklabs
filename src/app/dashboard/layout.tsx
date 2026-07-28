'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
        {/* Desktop Sidebar Component */}
        <Sidebar />

        {/* Main Content Area Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header Placeholder (Step 7.3) */}
          <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between shrink-0">
            <span className="text-sm font-medium text-slate-400">Dashboard Layout Header</span>
          </header>

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
