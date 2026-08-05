'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  listAllInstitutionsForAdmin,
  renameInstitution,
  setInstitutionStatus,
  setInstitutionTier,
  setInstitutionBilling,
  AdminInstitutionView,
} from '@/lib/academics/adminInstitutions';
import { InstitutionSubscriptionTier, BillingCycle, BillingCurrency } from '@/types/auth';
import { getEffectivePrice } from '@/lib/config/pricing';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Building2, Pencil, Ban, CheckCircle2, CreditCard, ChevronDown } from 'lucide-react';

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
  const [billingOpenUid, setBillingOpenUid] = useState('');

  // Local editable billing state, keyed by institution uid
  const [billingDrafts, setBillingDrafts] = useState<
    Record<string, { cycle: BillingCycle; currency: BillingCurrency; customPrice: string }>
  >({});

  const loadData = () => {
    setLoading(true);
    listAllInstitutionsForAdmin()
      .then((data) => {
        setInstitutions(data);
        const drafts: typeof billingDrafts = {};
        data.forEach((inst) => {
          drafts[inst.uid] = {
            cycle: inst.billingCycle,
            currency: inst.billingCurrency,
            customPrice: inst.customPriceAmount !== undefined && inst.customPriceAmount !== null ? String(inst.customPriceAmount) : '',
          };
        });
        setBillingDrafts(drafts);
      })
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

  const handleSaveBilling = async (uid: string) => {
    const draft = billingDrafts[uid];
    if (!draft) return;
    setActionLoading(uid);
    try {
      const customPrice = draft.customPrice.trim() === '' ? null : Number(draft.customPrice);
      await setInstitutionBilling(uid, draft.cycle, draft.currency, customPrice);
      loadData();
    } catch (err) {
      setError('Failed to update billing.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <PageHeader
        icon={Building2}
        title="Manage Institutions"
        description="Rename, suspend/reactivate, and manage subscription billing."
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
          {institutions.map((inst) => {
            const draft = billingDrafts[inst.uid];
            const effectivePrice = draft
              ? getEffectivePrice(
                  inst.subscriptionTier,
                  draft.currency,
                  draft.cycle,
                  draft.customPrice.trim() === '' ? undefined : Number(draft.customPrice)
                )
              : null;

            return (
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

                  <Badge tone={inst.accountStatus === 'ACTIVE' ? 'success' : 'danger'}>{inst.accountStatus}</Badge>
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

                <button
                  onClick={() => setBillingOpenUid(billingOpenUid === inst.uid ? '' : inst.uid)}
                  className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-white pt-2 border-t border-surface-border"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Billing:{' '}
                    {effectivePrice === null ? 'Contact for pricing' : `${draft?.currency} ${effectivePrice.toLocaleString()} / ${draft?.cycle === 'monthly' ? 'mo' : 'yr'}`}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${billingOpenUid === inst.uid ? 'rotate-180' : ''}`} />
                </button>

                {billingOpenUid === inst.uid && draft && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Cycle</label>
                        <select
                          value={draft.cycle}
                          onChange={(e) =>
                            setBillingDrafts((prev) => ({ ...prev, [inst.uid]: { ...prev[inst.uid], cycle: e.target.value as BillingCycle } }))
                          }
                          className="w-full bg-surface-base border border-surface-border rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Currency</label>
                        <select
                          value={draft.currency}
                          onChange={(e) =>
                            setBillingDrafts((prev) => ({ ...prev, [inst.uid]: { ...prev[inst.uid], currency: e.target.value as BillingCurrency } }))
                          }
                          className="w-full bg-surface-base border border-surface-border rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                        >
                          <option value="PKR">PKR</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Custom Negotiated Price (leave blank for default {TIER_LABELS[inst.subscriptionTier]} pricing)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={draft.customPrice}
                        onChange={(e) =>
                          setBillingDrafts((prev) => ({ ...prev, [inst.uid]: { ...prev[inst.uid], customPrice: e.target.value } }))
                        }
                        className="w-full bg-surface-base border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"
                        placeholder="e.g., 30000"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveBilling(inst.uid)}
                      disabled={actionLoading === inst.uid}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
                    >
                      Save Billing Terms
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
