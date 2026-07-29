import { InstitutionWorkspace, InstitutionBranding } from '@/types/institution';

export const MOCK_INSTITUTION_WORKSPACE: InstitutionWorkspace = {
  id: 'inst-001',
  name: 'Onyx Institute of Technology',
  slug: 'onyx-tech',
  type: 'university',
  tier: 'enterprise',
  subscriptionStatus: 'active',
  ownerUserId: 'usr-admin-01',
  createdAt: '2026-01-15T08:00:00.000Z',
  updatedAt: '2026-07-20T10:30:00.000Z',
  branding: {
    logoUrl: '/images/onyx-logo.png',
    primaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    customDomain: 'Student.OnyxStackLabs.com',
    portalTitle: 'Onyx Enterprise Campus Portal',
  },
  departments: [
    {
      id: 'dept-cs',
      name: 'Computer Science & Software Engineering',
      code: 'CSSE',
      headFacultyId: 'fac-8801',
      studentCount: 1420,
    },
    {
      id: 'dept-ai',
      name: 'Artificial Intelligence & Data Science',
      code: 'AIDS',
      headFacultyId: 'fac-8802',
      studentCount: 980,
    },
    {
      id: 'dept-ee',
      name: 'Electrical & Computer Engineering',
      code: 'ECE',
      headFacultyId: 'fac-8803',
      studentCount: 750,
    },
  ],
  quota: {
    currentStudents: 3150,
    maxStudents: 5000,
    storageUsedGb: 420,
    maxStorageGb: 1000,
    aiCreditsUsedThisMonth: 34200,
    maxAiCreditsPerMonth: 99999,
  },
};

export function getCurrentInstitutionWorkspace(): InstitutionWorkspace {
  return MOCK_INSTITUTION_WORKSPACE;
}

export function updateInstitutionBranding(
  brandingUpdates: Partial<InstitutionBranding>
): InstitutionWorkspace {
  MOCK_INSTITUTION_WORKSPACE.branding = {
    ...MOCK_INSTITUTION_WORKSPACE.branding,
    ...brandingUpdates,
  };
  MOCK_INSTITUTION_WORKSPACE.updatedAt = new Date().toISOString();
  return { ...MOCK_INSTITUTION_WORKSPACE };
}

export function checkQuotaStatus(workspace: InstitutionWorkspace): {
  isStudentQuotaFull: boolean;
  isStorageFull: boolean;
  isAiQuotaExhausted: boolean;
} {
  return {
    isStudentQuotaFull: workspace.quota.currentStudents >= workspace.quota.maxStudents,
    isStorageFull: workspace.quota.storageUsedGb >= workspace.quota.maxStorageGb,
    isAiQuotaExhausted:
      workspace.quota.aiCreditsUsedThisMonth >= workspace.quota.maxAiCreditsPerMonth,
  };
}
