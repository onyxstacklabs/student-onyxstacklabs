import { SubscriptionTier, SubscriptionStatus } from './saas';

export type InstitutionType = 'university' | 'college' | 'high_school' | 'vocational' | 'academy';

export interface InstitutionBranding {
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  customDomain?: string;
  portalTitle: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headFacultyId?: string;
  studentCount: number;
}

export interface InstitutionQuotaUsage {
  currentStudents: number;
  maxStudents: number;
  storageUsedGb: number;
  maxStorageGb: number;
  aiCreditsUsedThisMonth: number;
  maxAiCreditsPerMonth: number;
}

export interface InstitutionWorkspace {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  tier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  branding: InstitutionBranding;
  departments: Department[];
  quota: InstitutionQuotaUsage;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}
