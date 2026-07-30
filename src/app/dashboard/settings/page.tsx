'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Shield,
  Bell,
  BookOpen,
  CheckCircle2,
  Save,
  Key,
  Mail,
  Building,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile } = useAuth();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'security'>('general');

  // Form States
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || 'Student User');
  const [bio, setBio] = useState('Passionate about web development, computer science, and micro-SaaS projects.');
  const [major, setMajor] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('3rd Year (Junior)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-0">
      {/* Header Banner & Profile Summary */}
      <div className="p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {displayName}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email || 'student@onyxstacklabs.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Student Account</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>General Info</span>
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'academic'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Preferences & Security</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <form onSubmit={handleSaveProfile} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5 shadow-sm">
        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || 'student@onyxstacklabs.com'}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Short Bio / Description
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Academic Details */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Academic Status & Major
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Department / Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Academic Standing
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                  <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                  <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                  <option value="4th Year (Senior)">4th Year (Senior)</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-300 font-medium">Institution & Platform</span>
              </div>
              <span className="font-mono text-indigo-400 font-bold">OnyxStack Labs</span>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Preferences */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Security & Notifications
            </h2>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  Email Notifications
                </p>
                <p className="text-[11px] text-slate-400">
                  Receive alerts for assignment deadlines, shuttle schedules, and campus updates.
                </p>
              </div>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Authentication Status
                </p>
                <p className="text-[11px] text-slate-400">
                  Secured via Firebase Authentication & SSL encryption.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Encrypted
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
