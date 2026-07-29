'use client';

import React from 'react';
import { SaaSFeatureKey, SubscriptionTier } from '@/types/saas';
import { hasFeatureAccess } from '@/lib/saas/entitlementService';
import { Lock, Sparkles } from 'lucide-react';

interface FeatureGateProps {
  feature: SaaSFeatureKey;
  userTier?: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  feature,
  userTier = 'free',
  children,
  fallback,
}: FeatureGateProps) {
  const isAllowed = hasFeatureAccess(userTier, feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center space-y-3 shadow-md">
      <div className="mx-auto w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <Lock className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white">Feature Locked</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Your current plan (<span className="capitalize text-indigo-300 font-semibold">{userTier}</span>) does not include access to this feature.
        </p>
      </div>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard/subscription';
          }
        }}
        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-lg transition-all shadow-md shadow-indigo-950/50"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Upgrade Plan</span>
      </button>
    </div>
  );
}
