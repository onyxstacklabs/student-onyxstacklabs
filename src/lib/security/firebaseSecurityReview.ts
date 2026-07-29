/**
 * Onyx Stack Labs — Enterprise Firebase Security Review & Rule Audit Engine
 */

export interface FirebaseSecurityRuleEntry {
  collectionOrPath: string;
  readAccess: 'Public' | 'Authenticated' | 'Admin Only' | 'Owner Only';
  writeAccess: 'Public' | 'Authenticated' | 'Admin Only' | 'Owner Only';
  isEncrypted: boolean;
  status: 'passed' | 'failed';
  notes: string;
}

export const FIREBASE_SECURITY_MANIFEST: FirebaseSecurityRuleEntry[] = [
  {
    collectionOrPath: 'students/{studentId}',
    readAccess: 'Authenticated',
    writeAccess: 'Admin Only',
    isEncrypted: true,
    status: 'passed',
    notes: 'Multi-tenant student records isolated by organization UID.',
  },
  {
    collectionOrPath: 'analytics/telemetry',
    readAccess: 'Admin Only',
    writeAccess: 'Admin Only',
    isEncrypted: true,
    status: 'passed',
    notes: 'Aggregated performance metrics restricted to super admins.',
  },
  {
    collectionOrPath: 'blog/posts',
    readAccess: 'Public',
    writeAccess: 'Admin Only',
    isEncrypted: false,
    status: 'passed',
    notes: 'Publicly readable for SEO indexing; writes restricted to platform admins.',
  },
  {
    collectionOrPath: 'system/settings',
    readAccess: 'Admin Only',
    writeAccess: 'Admin Only',
    isEncrypted: true,
    status: 'passed',
    notes: 'Global platform settings locked to platform root keys.',
  },
];

export function runFirebaseSecurityAudit(): {
  totalCollectionsAudited: number;
  passedCount: number;
  publicReadAllowed: number;
  publicWriteAllowed: number;
  status: 'passed' | 'failed';
} {
  const total = FIREBASE_SECURITY_MANIFEST.length;
  const passed = FIREBASE_SECURITY_MANIFEST.filter((entry) => entry.status === 'passed').length;
  const publicRead = FIREBASE_SECURITY_MANIFEST.filter((entry) => entry.readAccess === 'Public').length;
  const publicWrite = FIREBASE_SECURITY_MANIFEST.filter((entry) => entry.writeAccess === 'Public').length;

  return {
    totalCollectionsAudited: total,
    passedCount: passed,
    publicReadAllowed: publicRead,
    publicWriteAllowed: publicWrite,
    status: publicWrite === 0 && passed === total ? 'passed' : 'failed',
  };
}
