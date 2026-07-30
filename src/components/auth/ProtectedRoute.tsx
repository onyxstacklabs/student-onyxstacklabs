'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        router.push('/unauthorized');
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
              Securing student portal access...
            </p>
          </div>
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
