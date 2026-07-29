import { UserEntitlement, SaaSFeatureKey, SubscriptionTier } from '@/types/saas';

export const DEFAULT_ENTITLEMENTS: Record<SubscriptionTier, UserEntitlement> = {
  free: {
    tier: 'free',
    status: 'active',
    featuresAllowed: ['priority_support'],
    aiCreditsRemaining: 50,
    expiresAt: null,
  },
  pro: {
    tier: 'pro',
    status: 'active',
    featuresAllowed: [
      'ai_tutor_unlimited',
      'smart_mobility_access',
      'emergency_sos_dispatch',
      'priority_support',
    ],
    aiCreditsRemaining: 1000,
    expiresAt: null,
  },
  enterprise: {
    tier: 'enterprise',
    status: 'active',
    featuresAllowed: [
      'ai_tutor_unlimited',
      'smart_mobility_access',
      'emergency_sos_dispatch',
      'advanced_analytics',
      'custom_domain_branding',
      'multi_campus_management',
      'priority_support',
    ],
    aiCreditsRemaining: 99999,
    expiresAt: null,
  },
};

export function getUserEntitlement(tier: SubscriptionTier = 'free'): UserEntitlement {
  return DEFAULT_ENTITLEMENTS[tier] || DEFAULT_ENTITLEMENTS.free;
}

export function hasFeatureAccess(tier: SubscriptionTier, feature: SaaSFeatureKey): boolean {
  const entitlement = getUserEntitlement(tier);
  if (entitlement.status !== 'active' && entitlement.status !== 'trialing') {
    return false;
  }
  return entitlement.featuresAllowed.includes(feature);
}

export function consumeAICredits(
  currentCredits: number,
  cost: number = 1
): { success: boolean; remaining: number } {
  if (currentCredits < cost) {
    return { success: false, remaining: currentCredits };
  }
  return { success: true, remaining: currentCredits - cost };
}
