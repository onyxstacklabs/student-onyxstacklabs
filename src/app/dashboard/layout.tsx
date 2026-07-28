'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navigation Component */}
          <TopNav />

          {/* Main Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
