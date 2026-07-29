'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, error } = useAuth() as any;
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, profile, loading, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4 p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <div className="text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-4 max-w-full break-words">
          <div>loading: {String(loading)}</div>
          <div>user: {user ? user.uid : 'null'}</div>
          <div>profile: {profile ? 'loaded' : 'null'}</div>
          <div>error: {error ? String(error) : 'none'}</div>
          <div>elapsed: {elapsed}s</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
