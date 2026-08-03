'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  listAllInstitutionsForAdmin,
  renameInstitution,
  setInstitutionStatus,
  setInstitutionTier,
  AdminInstitutionView,
} from '@/lib/academics/adminInstitutions';
import { InstitutionSubscriptionTier } from '@/types/auth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Building2, Pencil, Ban, CheckCircle2 } from 'lucide-react';

const TIER_LABELS: Record<InstitutionSubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

function InstitutionManager() {
  const [institutions, setInstitutions] = useState<AdminInstitutionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [renamingUid, setRenamingUid] = useState('');
  const [renameValue, setRenameValue] = useState('');

  const loadData = () => {
    setLoading(true);
    listAllInstitutionsForAdmin()
      .then(setInstitutions)
      .catch(() => setError('Could not load institutions.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRename = async (uid: string) => {
    if (!renameValue.trim()) return;
    setActionLoading(uid);
    try {
      await renameInstitution(uid, renameValue.trim());
      setRenamingUid('');
      loadData();
    } catch (err) {
      setError('Failed to rename institution.');
    } finally {
      setActionLoading('');
    }
  };

  const handleToggleStatus = async (uid: string, currentStatus: string) => {
    setActionLoading(uid);
    try {
      await setInstitutionStatus(uid, currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
      loadData();
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setActionLoading('');
    }
  };

  const handleTierChange = async (uid: string, tier: InstitutionSubscriptionTier) => {
    setActionLoading(uid);
    try {
      await setInstitutionTier(uid, tier);
      loadData();
    } catch (err) {
      setError('Failed to update subscription tier.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader
        icon={Building2}
        title="Manage Institutions"
        description="Rename, suspend/reactivate, and change subscription plans."
      />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500 text-center py-8">Loading institutions...</p>
      ) : institutions.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No institutions registered yet.</p>
      ) : (
        <div className="space-y-3">
          {institutions.map((inst) => (
            <div key={inst.uid} className="bg-surface-raised/60 border border-surface-border rounded-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {renamingUid === inst.uid ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="flex-1 bg-surface-base border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(inst.uid)}
                        disabled={actionLoading === inst.uid}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setRenamingUid('')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{inst.institutionName}</h3>
                      <button
                        onClick={() => {
                          setRenamingUid(inst.uid);
                          setRenameValue(inst.institutionName);
                        }}
                        className="text-slate-500 hover:text-brand-400 shrink-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 truncate">{inst.contactEmail}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone={inst.accountStatus === 'ACTIVE' ? 'success' : 'danger'}>
                    {inst.accountStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Plan:</span>
                  <select
                    value={inst.subscriptionTier}
                    onChange={(e) => handleTierChange(inst.uid, e.target.value as InstitutionSubscriptionTier)}
                    disabled={actionLoading === inst.uid}
                    className="bg-surface-base border border-surface-border rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {Object.entries(TIER_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleToggleStatus(inst.uid, inst.accountStatus)}
                  disabled={actionLoading === inst.uid}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition disabled:opacity-50 ${
                    inst.accountStatus === 'ACTIVE'
                      ? 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger/20'
                      : 'bg-accent-success/10 text-accent-success border border-accent-success/20 hover:bg-accent-success/20'
                  }`}
                >
                  {inst.accountStatus === 'ACTIVE' ? (
                    <>
                      <Ban className="w-3.5 h-3.5" /> Suspend
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminInstitutionsPage() {
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <InstitutionManager />
    </ProtectedRoute>
  );
}
