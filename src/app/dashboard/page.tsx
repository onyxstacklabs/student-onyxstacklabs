'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { profile, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h1 className="text-3xl font-bold text-indigo-400">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition text-sm font-medium"
            >
              Sign Out
            </button>
          </div>

          <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
            <h2 className="text-xl font-semibold">User Profile Details</h2>
            <div className="text-sm text-slate-300 space-y-1">
              <p><strong className="text-slate-100">Name:</strong> {profile?.displayName}</p>
              <p><strong className="text-slate-100">Email:</strong> {profile?.email}</p>
              <p><strong className="text-slate-100">Role:</strong> {profile?.role}</p>
              <p><strong className="text-slate-100">UID:</strong> {profile?.uid}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
