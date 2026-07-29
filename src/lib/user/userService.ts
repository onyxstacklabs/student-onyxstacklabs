import { UserSaaSConfigRole, SubscriptionTier } from '@/types/saas';

export type UserAccountStatus = 'active' | 'suspended' | 'pending_verification';

export interface SaaSUserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserSaaSConfigRole;
  tenantId?: string;
  tenantName?: string;
  tier: SubscriptionTier;
  status: UserAccountStatus;
  lastActiveAt: string;
  createdAt: string;
}

export const MOCK_USER_PROFILES: SaaSUserProfile[] = [
  {
    id: 'usr-001',
    email: 'alex.johnson@onyxstacklabs.com',
    fullName: 'Alex Johnson',
    role: 'super_admin',
    tier: 'enterprise',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'usr-002',
    email: 'dean.morris@onyxtech.edu',
    fullName: 'Dr. Robert Morris',
    role: 'institution_admin',
    tenantId: 'inst-001',
    tenantName: 'Onyx Institute of Technology',
    tier: 'enterprise',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    createdAt: '2026-02-01T11:30:00.000Z',
  },
  {
    id: 'usr-003',
    email: 'sarah.prof@onyxtech.edu',
    fullName: 'Prof. Sarah Lin',
    role: 'faculty',
    tenantId: 'inst-001',
    tenantName: 'Onyx Institute of Technology',
    tier: 'enterprise',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    createdAt: '2026-03-15T09:15:00.000Z',
  },
  {
    id: 'usr-004',
    email: 'david.student@onyxtech.edu',
    fullName: 'David Vance',
    role: 'student',
    tenantId: 'inst-001',
    tenantName: 'Onyx Institute of Technology',
    tier: 'pro',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    createdAt: '2026-04-20T14:00:00.000Z',
  },
  {
    id: 'usr-005',
    email: 'guest.test@gmail.com',
    fullName: 'Guest User',
    role: 'student',
    tier: 'free',
    status: 'pending_verification',
    lastActiveAt: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    createdAt: '2026-07-10T16:20:00.000Z',
  },
];

export function getAllUsers(): SaaSUserProfile[] {
  return MOCK_USER_PROFILES;
}

export function searchUsers(query: string, roleFilter?: string): SaaSUserProfile[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_USER_PROFILES.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      (user.tenantName && user.tenantName.toLowerCase().includes(lowerQuery));

    const matchesRole = roleFilter && roleFilter !== 'all' ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });
}

export function updateUserStatus(userId: string, newStatus: UserAccountStatus): SaaSUserProfile | null {
  const user = MOCK_USER_PROFILES.find((u) => u.id === userId);
  if (user) {
    user.status = newStatus;
    return { ...user };
  }
  return null;
}
