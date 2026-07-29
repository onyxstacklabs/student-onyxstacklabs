import { SecurityAuditLog } from '@/types/governance';

export const MOCK_SECURITY_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'audit-701',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
    actorId: 'OSL-2026-8891',
    actorRole: 'Student',
    action: 'RFID_TURNSTILE_ACCESS',
    resource: 'CS Lab Building - Gate 02',
    ipAddress: '10.14.2.105',
    status: 'allowed',
  },
  {
    id: 'audit-702',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    actorId: 'usr-unverified',
    actorRole: 'Guest',
    action: 'ELEVATED_ZONE_ATTEMPT',
    resource: 'Server Room Alpha',
    ipAddress: '192.168.1.44',
    status: 'denied',
  },
  {
    id: 'audit-703',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    actorId: 'OSL-2026-8891',
    actorRole: 'Student',
    action: 'SOS_EMERGENCY_TRIGGER',
    resource: 'Governance SOS API',
    ipAddress: '10.14.1.88',
    status: 'flagged',
  },
];

export function getSecurityAuditLogs(): SecurityAuditLog[] {
  return MOCK_SECURITY_AUDIT_LOGS;
}

export function logSecurityEvent(
  actorId: string,
  actorRole: string,
  action: string,
  resource: string,
  ipAddress: string,
  status: SecurityAuditLog['status']
): SecurityAuditLog {
  const newLog: SecurityAuditLog = {
    id: `audit-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    actorId,
    actorRole,
    action,
    resource,
    ipAddress,
    status,
  };

  MOCK_SECURITY_AUDIT_LOGS.unshift(newLog);
  return newLog;
}
