'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { UserRole } from '@/types/auth';
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

const ROLE_BADGE: Record<UserRole, { label: string; icon: React.ReactNode }> = {
  STUDENT: { label: 'Student Account', icon: <Shield className="w-3.5 h-3.5" /> },
  PARENT: { label: 'Parent Account', icon: <Shield className="w-3.5 h-3.5" /> },
  TEACHER: { label: 'Teacher Account', icon: <Shield className="w-3.5 h-3.5" /> },
  INSTITUTION: { label: 'Institution Account', icon: <Building className="w-3.5 h-3.5" /> },
  ADMIN: { label: 'Admin Account', icon: <Shield className="w-3.5 h-3.5" /> },
  SUPER_ADMIN: { label: 'Super Admin Account', icon: <Shield className="w-3.5 h-3.5" /> },
};

export default function SettingsPage() {
  const { user, profile, role } = useAuth();
  const userRole: UserRole = role || profile?.role || 'STUDENT';
  const badge = ROLE_BADGE[userRole];

  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'security'>('general');
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.preferences?.notifications?.email ?? true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName,
        'preferences.notifications.email': emailNotifications,
        updatedAt: new Date().toISOString(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-0">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 bg-surface-raised/60 border border-surface-border rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg">
            {(displayName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{displayName || 'User'}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 self-start sm:self-auto">
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'general' ? 'bg-brand-600 text-white' : 'bg-surface-raised/60 text-slate-400 hover:text-white border border-surface-border'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>General Info</span>
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'academic' ? 'bg-brand-600 text-white' : 'bg-surface-raised/60 text-slate-400 hover:text-white border border-surface-border'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Details</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'security' ? 'bg-brand-600 text-white' : 'bg-surface-raised/60 text-slate-400 hover:text-white border border-surface-border'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Preferences & Security</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-5 shadow-sm">
        {saveSuccess && (
          <div className="p-3 bg-accent-success/10 border border-accent-success/20 rounded-xl flex items-center gap-2 text-accent-success text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}
        {saveError && (
          <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-xs rounded-xl">
            {saveError}
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-surface-base/50 border border-surface-border/60 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" /> My Details
            </h2>

            {(userRole === 'STUDENT' || userRole === 'PARENT') && profile?.studentDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Institution</span>
                  <span className="text-slate-200 font-medium">{profile.studentDetails.collegeName || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Class</span>
                  <span className="text-slate-200 font-medium">{profile.studentDetails.className || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Roll Number</span>
                  <span className="text-slate-200 font-medium">{profile.studentDetails.rollNumber || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Subjects</span>
                  <span className="text-slate-200 font-medium">{profile.studentDetails.subjects.join(', ') || '—'}</span>
                </div>
              </div>
            )}

            {userRole === 'TEACHER' && profile?.teacherDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Assigned Classes</span>
                  <span className="text-slate-200 font-medium">{profile.teacherDetails.assignedClasses.join(', ') || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Subjects</span>
                  <span className="text-slate-200 font-medium">{profile.teacherDetails.subjects.join(', ') || '—'}</span>
                </div>
              </div>
            )}

            {userRole === 'INSTITUTION' && profile?.institutionDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Institution Name</span>
                  <span className="text-slate-200 font-medium">{profile.institutionDetails.institutionName || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Address</span>
                  <span className="text-slate-200 font-medium">{profile.institutionDetails.address || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Contact Email</span>
                  <span className="text-slate-200 font-medium">{profile.institutionDetails.contactEmail || '—'}</span>
                </div>
                <div className="p-3 bg-surface-base rounded-xl border border-surface-border text-xs">
                  <span className="text-slate-500 block mb-0.5">Contact Number</span>
                  <span className="text-slate-200 font-medium">{profile.institutionDetails.contactNumber || '—'}</span>
                </div>
              </div>
            )}

            {(userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
              <p className="text-xs text-slate-500">Platform-wide details are available on your Admin Dashboard.</p>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-400" /> Security & Notifications
            </h2>

            <div className="p-4 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-brand-400" /> Email Notifications
                </p>
                <p className="text-[11px] text-slate-400">Receive updates about your account activity.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-accent-warning" /> Authentication Status
                </p>
                <p className="text-[11px] text-slate-400">Secured via Firebase Authentication & SSL encryption.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-accent-success/10 text-accent-success border border-accent-success/20 font-bold">
                Encrypted
              </span>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-surface-border flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
