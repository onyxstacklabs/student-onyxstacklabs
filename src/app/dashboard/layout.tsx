'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import MobileNav from '@/components/dashboard/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden antialiased">
          {/* Mobile View Navigation Header */}
          <MobileNav />

          {/* Desktop View Sidebar Navigation */}
          <Sidebar />

          {/* Core Content Container */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Header & User Controls */}
            <TopNav />

            {/* Scrollable Viewport Area */}
            <main 
              id="main-content"
              tabIndex={-1}
              className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 focus:outline-none"
            >
              <div className="max-w-7xl mx-auto space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
