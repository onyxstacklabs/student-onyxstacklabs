'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { createTeacherInvite, TeacherInvite } from '@/lib/academics/teacherInvites';
import { PageHeader } from '@/components/ui/PageHeader';
import { UserPlus, Copy, Check } from 'lucide-react';

function TeacherInviteManager() {
  const { user, profile } = useAuth();
  const institutionClasses = profile?.institutionDetails?.classes || [];

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [subjectsInput, setSubjectsInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [invites, setInvites] = useState<TeacherInvite[]>([]);
  const [copiedCode, setCopiedCode] = useState('');

  const toggleClass = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className) ? prev.filter((c) => c !== className) : [...prev, className]
    );
  };

  const handleGenerate = async () => {
    setError('');
    if (!user?.uid || selectedClasses.length === 0) {
      setError('Select at least one class for this teacher.');
      return;
    }

    setGenerating(true);
    try {
      const subjects = subjectsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const invite = await createTeacherInvite(
        user.uid,
        profile?.institutionDetails?.institutionName || '',
        selectedClasses,
        subjects
      );
      setInvites((prev) => [invite, ...prev]);
      setSelectedClasses([]);
      setSubjectsInput('');
    } catch (err) {
      setError('Failed to generate invite. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <PageHeader
        icon={UserPlus}
        title="Invite Teachers"
        description="Generate a one-time code your teacher can use to join their assigned classes."
      />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Which classes will this teacher handle?
          </label>
          <div className="flex flex-wrap gap-2">
            {institutionClasses.length === 0 ? (
              <p className="text-xs text-slate-500">
                Add classes to your institution profile first before inviting teachers.
              </p>
            ) : (
              institutionClasses.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleClass(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    selectedClasses.includes(c)
                      ? 'bg-brand-600 text-white border-brand-500'
                      : 'bg-surface-base text-slate-400 border-surface-border hover:border-surface-borderHover'
                  }`}
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
            Subjects they'll teach (optional)
          </label>
          <input
            type="text"
            value={subjectsInput}
            onChange={(e) => setSubjectsInput(e.target.value)}
            className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
            placeholder="e.g., Physics, Chemistry"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || institutionClasses.length === 0}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Invite Code'}
        </button>
      </div>

      {invites.length > 0 && (
        <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-3">
          <h2 className="text-sm font-bold text-white">Generated Codes (share with your teacher)</h2>
          {invites.map((inv) => (
            <div
              key={inv.code}
              className="flex items-center justify-between p-3.5 bg-surface-base border border-surface-border rounded-xl"
            >
              <div>
                <p className="text-lg font-mono font-bold text-brand-400 tracking-widest">{inv.code}</p>
                <p className="text-[11px] text-slate-500">{inv.assignedClasses.join(', ')}</p>
              </div>
              <button
                onClick={() => handleCopy(inv.code)}
                className="p-2 rounded-lg bg-surface-raised hover:bg-surface-border text-slate-300 transition"
              >
                {copiedCode === inv.code ? (
                  <Check className="w-4 h-4 text-accent-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeacherInvitesPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <TeacherInviteManager />
    </ProtectedRoute>
  );
}
