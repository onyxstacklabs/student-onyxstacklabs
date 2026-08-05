'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { PLATFORM_CONFIG } from '@/lib/config/platform';
import { getEffectivePrice, FREE_TIER_STUDENT_LIMIT } from '@/lib/config/pricing';
import { InstitutionSubscriptionTier } from '@/types/auth';
import { CreditCard, Check, MessageCircle, Mail } from 'lucide-react';

const TIER_FEATURES: Record<InstitutionSubscriptionTier, string[]> = {
  free: [`Up to ${FREE_TIER_STUDENT_LIMIT} students`, 'Courses, Notes, Timetable', 'Attendance & Grades tracking'],
  pro: [
    'Up to 300 students',
    'Everything in Free',
    'AI Assistant',
    'Fee Management',
    'Emergency SOS',
    'Campus Mobility',
  ],
  enterprise: [
    'Unlimited students',
    'Everything in Pro',
    'Multi-campus management',
    'Custom branding',
    'Priority support',
  ],
};

const TIER_LABELS: Record<InstitutionSubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

function InstitutionBilling() {
  const { profile } = useAuth();
  const details = profile?.institutionDetails;
  const currentTier: InstitutionSubscriptionTier = details?.subscriptionTier || 'free';
  const accountStatus = details?.accountStatus || 'ACTIVE';
  const cycle = details?.billingCycle || 'monthly';
  const currency = details?.billingCurrency || 'PKR';

  const price = getEffectivePrice(currentTier, currency, cycle, details?.customPriceAmount);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to discuss our institution's plan on OnyxStack Labs. Institution: ${details?.institutionName || ''}`
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <PageHeader icon={CreditCard} title="Billing & Subscription" description="Your current plan and upgrade options." />

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Current Plan</p>
            <h2 className="text-2xl font-bold text-white mt-1">{TIER_LABELS[currentTier]}</h2>
            <p className="text-sm text-slate-400">
              {price === null
                ? 'Contact us for pricing'
                : price === 0
                ? 'Free'
                : `${currency} ${price.toLocaleString()} / ${cycle === 'monthly' ? 'month' : 'year'}`}
            </p>
          </div>
          <Badge tone={accountStatus === 'ACTIVE' ? 'success' : 'danger'}>{accountStatus}</Badge>
        </div>
        <div className="space-y-1.5 pt-3 border-t border-surface-border">
          {TIER_FEATURES[currentTier].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
              <Check className="w-4 h-4 text-accent-success" /> {f}
            </div>
          ))}
        </div>
      </div>

      {currentTier !== 'enterprise' && (
        <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Want to upgrade or discuss pricing?</h2>
          <p className="text-sm text-slate-400">
            Billing is currently handled directly by our team — including flexible monthly/yearly terms.
            Reach out and we'll work it out with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={`${PLATFORM_CONFIG.whatsappLink}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent-success/10 hover:bg-accent-success/20 text-accent-success border border-accent-success/20 text-sm font-medium rounded-xl transition"
            >
              <MessageCircle className="w-4 h-4" /> Message on WhatsApp
            </a>
            <a
              href={`mailto:${PLATFORM_CONFIG.supportEmail}?subject=Upgrade%20request`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition"
            >
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstitutionBillingPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <InstitutionBilling />
    </ProtectedRoute>
  );
}
