'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import MobileNav from '@/components/dashboard/MobileNav';
import EmergencySOSButton from '@/components/dashboard/EmergencySOSButton';
import { PLATFORM_CONFIG } from '@/lib/config/platform';
import { Mail, MessageCircle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="h-screen w-full bg-surface-base text-slate-100 flex flex-col md:flex-row overflow-hidden antialiased selection:bg-brand-500/30 selection:text-brand-200">
          {/* Mobile View Navigation Header */}
          <MobileNav />

          {/* Desktop View Sidebar Navigation */}
          <Sidebar />

          {/* Core SaaS Content Container */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
            {/* Header & Workspace Navigation Controls */}
            <TopNav />

            {/* Scrollable Viewport Area */}
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 focus:outline-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              <div className="max-w-7xl mx-auto space-y-6">
                {children}
              </div>

              {/* Branding & Support Footer */}
              <footer className="max-w-7xl mx-auto mt-10 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <p>© {new Date().getFullYear()} {PLATFORM_CONFIG.companyName}. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <a
                    href={`mailto:${PLATFORM_CONFIG.supportEmail}`}
                    className="flex items-center gap-1.5 hover:text-slate-300 transition"
                  >
                    <Mail className="w-3.5 h-3.5" /> {PLATFORM_CONFIG.supportEmail}
                  </a>
                  <a
                    href={PLATFORM_CONFIG.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-slate-300 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {PLATFORM_CONFIG.whatsappNumber}
                  </a>
                </div>
              </footer>
            </main>
          </div>

          <EmergencySOSButton />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
