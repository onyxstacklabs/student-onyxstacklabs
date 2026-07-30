'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  const { signInWithGoogle, switchRole } = useAuth();
  const router = useRouter();

  // Quick Role Fillers for Instant Testing
  const handleRoleSelect = (role: 'STUDENT' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setEmail('admin@onyxstacklabs.com');
    } else {
      setEmail('student@onyxstacklabs.com');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Sync Role in AuthContext if switcher exists
      if (switchRole) {
        await switchRole(selectedRole);
      }

      router.refresh();

      // 3. Smart Redirect based on Role or Email
      if (selectedRole === 'ADMIN' || email.includes('admin')) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.refresh();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl text-white">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-400">Sign In to OnyxStack</h2>

      {/* Quick Role Selection Tabs for Testing */}
      <div className="mb-6 space-y-1.5">
        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block text-center">
          Select Login Persona
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleSelect('STUDENT')}
            className={`py-1.5 rounded-md text-xs font-semibold transition ${
              selectedRole === 'STUDENT'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            className={`py-1.5 rounded-md text-xs font-semibold transition ${
              selectedRole === 'ADMIN'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Super Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
            placeholder={selectedRole === 'ADMIN' ? 'admin@onyxstacklabs.com' : 'student@onyxstacklabs.com'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-indigo-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 transition font-medium rounded-lg disabled:opacity-50 text-white ${
            selectedRole === 'ADMIN'
              ? 'bg-rose-600 hover:bg-rose-500'
              : 'bg-indigo-600 hover:bg-indigo-500'
          }`}
        >
          {loading ? 'Signing In...' : `Sign In as ${selectedRole === 'ADMIN' ? 'Super Admin' : 'Student'}`}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 transition font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-400 hover:underline font-medium">
          Register
        </Link>
      </p>
    </div>
  );
}
