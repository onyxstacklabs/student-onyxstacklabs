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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden">
          {/* Mobile Navigation Drawer & Toggle */}
          <MobileNav />

          {/* Desktop Sidebar Component */}
          <Sidebar />

          {/* Main Content Area Container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Navigation Component */}
            <TopNav />

            {/* Main Scrollable Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 focus:outline-none">
              {children}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
