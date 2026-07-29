export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete';

export type UserSaaSConfigRole = 'super_admin' | 'institution_admin' | 'faculty' | 'student';

export type SaaSFeatureKey =
  | 'ai_tutor_unlimited'
  | 'smart_mobility_access'
  | 'emergency_sos_dispatch'
  | 'advanced_analytics'
  | 'custom_domain_branding'
  | 'multi_campus_management'
  | 'priority_support';

export interface PlanLimits {
  maxStudents: number;
  maxStorageGb: number;
  aiCreditsPerMonth: number;
  maxCustomRoles: number;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  limits: PlanLimits;
  features: SaaSFeatureKey[];
  isPopular?: boolean;
}

export interface UserEntitlement {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  featuresAllowed: SaaSFeatureKey[];
  aiCreditsRemaining: number;
  expiresAt: string | null;
}

export interface SaaSOrganizationTenant {
  id: string;
  slug: string;
  name: string;
  tier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}
