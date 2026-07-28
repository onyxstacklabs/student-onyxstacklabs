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
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl text-white">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400">Sign In to OnyxStack</h2>
      
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
            placeholder="student@onyxstacklabs.com"
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
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 transition font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
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
        onClick={handleGoogleSignIn}
        className="w-full py-2.5 border border-slate-700 hover:bg-slate-800 transition font-medium rounded-lg flex items-center justify-center gap-2"
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
