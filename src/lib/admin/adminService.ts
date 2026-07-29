export interface SystemAdminMetrics {
  totalUsers: number;
  totalInstitutions: number;
  activeSubscriptions: number;
  monthlyRecurringRevenueUSD: number;
  systemHealthScore: number; // 0-100%
  activeAiSessionsToday: number;
}

export interface AdminActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  targetTenantId?: string;
  timestamp: string;
  ipAddress: string;
}

export const MOCK_ADMIN_METRICS: SystemAdminMetrics = {
  totalUsers: 24850,
  totalInstitutions: 14,
  activeSubscriptions: 12,
  monthlyRecurringRevenueUSD: 18450,
  systemHealthScore: 99.8,
  activeAiSessionsToday: 3210,
};

export const MOCK_ADMIN_LOGS: AdminActivityLog[] = [
  {
    id: 'act-901',
    adminEmail: 'superadmin@onyxstacklabs.com',
    action: 'UPGRADED_TENANT_TIER',
    targetTenantId: 'inst-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
  },
  {
    id: 'act-902',
    adminEmail: 'superadmin@onyxstacklabs.com',
    action: 'PROVISIONED_NEW_INSTITUTION',
    targetTenantId: 'inst-002',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100',
  },
];

export function getSystemAdminMetrics(): SystemAdminMetrics {
  return MOCK_ADMIN_METRICS;
}

export function getAdminActivityLogs(): AdminActivityLog[] {
  return MOCK_ADMIN_LOGS;
}

export function logAdminAction(
  adminEmail: string,
  action: string,
  targetTenantId?: string
): AdminActivityLog {
  const newLog: AdminActivityLog = {
    id: `act-${Date.now().toString().slice(-4)}`,
    adminEmail,
    action,
    targetTenantId,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1',
  };

  MOCK_ADMIN_LOGS.unshift(newLog);
  return newLog;
}
