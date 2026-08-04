import { InstitutionSubscriptionTier, BillingCycle, BillingCurrency } from '@/types/auth';

export const DEFAULT_PRICING: Record<
  InstitutionSubscriptionTier,
  Record<BillingCurrency, Record<BillingCycle, number | null>>
> = {
  free: {
    PKR: { monthly: 0, yearly: 0 },
    USD: { monthly: 0, yearly: 0 },
  },
  pro: {
    PKR: { monthly: 3000, yearly: 30000 },
    USD: { monthly: 19, yearly: 190 },
  },
  enterprise: {
    PKR: { monthly: null, yearly: null }, // null = "Contact Us"
    USD: { monthly: null, yearly: null },
  },
};

export const FREE_TIER_STUDENT_LIMIT = 50;

export function getEffectivePrice(
  tier: InstitutionSubscriptionTier,
  currency: BillingCurrency,
  cycle: BillingCycle,
  customPriceAmount?: number | null
): number | null {
  if (customPriceAmount !== undefined && customPriceAmount !== null) {
    return customPriceAmount;
  }
  return DEFAULT_PRICING[tier][currency][cycle];
}
