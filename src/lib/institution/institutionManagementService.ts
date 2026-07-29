import { SubscriptionTier, SubscriptionStatus } from '@/types/saas';

export interface ManagedInstitution {
  id: string;
  name: string;
  slug: string;
  type: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  customDomain: string;
  currentStudents: number;
  maxStudents: number;
  monthlyRevenueUSD: number;
  createdAt: string;
}

export const MOCK_MANAGED_INSTITUTIONS: ManagedInstitution[] = [
  {
    id: 'inst-001',
    name: 'Onyx Institute of Technology',
    slug: 'onyx-tech',
    type: 'university',
    tier: 'enterprise',
    status: 'active',
    customDomain: 'Student.OnyxStackLabs.com',
    currentStudents: 3150,
    maxStudents: 5000,
    monthlyRevenueUSD: 249,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'inst-002',
    name: 'Apex Academy of Science',
    slug: 'apex-academy',
    type: 'academy',
    tier: 'pro',
    status: 'active',
    customDomain: 'apex.onyxstacklabs.com',
    currentStudents: 480,
    maxStudents: 1000,
    monthlyRevenueUSD: 12,
    createdAt: '2026-03-10T11:20:00.000Z',
  },
  {
    id: 'inst-003',
    name: 'Horizon International School',
    slug: 'horizon-int',
    type: 'high_school',
    tier: 'free',
    status: 'past_due',
    customDomain: 'horizon.onyxstacklabs.com',
    currentStudents: 120,
    maxStudents: 250,
    monthlyRevenueUSD: 0,
    createdAt: '2026-05-04T14:45:00.000Z',
  },
];

export function getAllManagedInstitutions(): ManagedInstitution[] {
  return MOCK_MANAGED_INSTITUTIONS;
}

export function updateInstitutionStatus(
  id: string,
  newStatus: SubscriptionStatus
): ManagedInstitution | null {
  const inst = MOCK_MANAGED_INSTITUTIONS.find((i) => i.id === id);
  if (inst) {
    inst.status = newStatus;
    return { ...inst };
  }
  return null;
}

export function updateInstitutionTier(
  id: string,
  newTier: SubscriptionTier
): ManagedInstitution | null {
  const inst = MOCK_MANAGED_INSTITUTIONS.find((i) => i.id === id);
  if (inst) {
    inst.tier = newTier;
    inst.monthlyRevenueUSD = newTier === 'enterprise' ? 249 : newTier === 'pro' ? 12 : 0;
    return { ...inst };
  }
  return null;
}
