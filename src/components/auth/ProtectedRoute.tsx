'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';
import { DEFAULT_ROLE_REDIRECTS } from '@/lib/rbac';
import { ShieldAlert } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/config/platform';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  const isSuspendedInstitution =
    profile?.role === 'INSTITUTION' && profile?.institutionDetails?.accountStatus === 'SUSPENDED';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Wrong dashboard for this role — bounce to their real home,
        // not a dead-end error page.
        const correctHome = DEFAULT_ROLE_REDIRECTS[profile.role] || '/dashboard';
        router.push(correctHome);
      }
    }
  }, [user, profile, loading, allowedRoles, router]);

  // Enterprise Loading Screen while checking identity state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute w-6 h-6 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin-slow" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Verifying Session
            </p>
            <p className="text-[10px] text-slate-500">
              Securing your dashboard access...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Suspended institution — block access with a clear reason, not a silent redirect.
  if (isSuspendedInstitution) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-sm w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Account Suspended</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Your institution's account has been suspended. Please contact platform support to resolve this.
            </p>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <p>{PLATFORM_CONFIG.supportEmail}</p>
            <p>{PLATFORM_CONFIG.whatsappNumber}</p>
          </div>
          <button
            onClick={logout}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Prevent UI flash during unauthorized or unauthenticated redirects
  if (!user || (allowedRoles && profile && !allowedRoles.includes(profile.role))) {
    return null;
  }

  return <>{children}</>;
}
