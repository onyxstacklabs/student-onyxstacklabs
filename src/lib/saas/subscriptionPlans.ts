import { SubscriptionPlan } from '@/types/saas';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_free',
    tier: 'free',
    name: 'Starter Student',
    description: 'Essential learning tools for individual students beginning their academic journey.',
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    limits: {
      maxStudents: 1,
      maxStorageGb: 2,
      aiCreditsPerMonth: 50,
      maxCustomRoles: 0,
    },
    features: ['priority_support'],
  },
  {
    id: 'plan_pro',
    tier: 'pro',
    name: 'Pro Scholar',
    description: 'Advanced AI assistance, transit mapping & emergency SOS safety features for power users.',
    monthlyPriceUSD: 12,
    annualPriceUSD: 108, // $9/mo billed annually
    isPopular: true,
    limits: {
      maxStudents: 1,
      maxStorageGb: 25,
      aiCreditsPerMonth: 1000,
      maxCustomRoles: 2,
    },
    features: [
      'ai_tutor_unlimited',
      'smart_mobility_access',
      'emergency_sos_dispatch',
      'priority_support',
    ],
  },
  {
    id: 'plan_enterprise',
    tier: 'enterprise',
    name: 'Institution SaaS',
    description: 'Complete multi-campus governance, custom domain branding, and institutional AI analytics.',
    monthlyPriceUSD: 299,
    annualPriceUSD: 2988, // $249/mo billed annually
    limits: {
      maxStudents: 5000,
      maxStorageGb: 1000,
      aiCreditsPerMonth: 99999,
      maxCustomRoles: 20,
    },
    features: [
      'ai_tutor_unlimited',
      'smart_mobility_access',
      'emergency_sos_dispatch',
      'advanced_analytics',
      'custom_domain_branding',
      'multi_campus_management',
      'priority_support',
    ],
  },
];

export function getPlanByTier(tier: string): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((plan) => plan.tier === tier) || SUBSCRIPTION_PLANS[0];
}

export function getAllSubscriptionPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS;
}
