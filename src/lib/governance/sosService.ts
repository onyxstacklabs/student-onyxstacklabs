import { EmergencyAlert, IncidentCategory, IncidentSeverity } from '@/types/governance';

export const MOCK_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'sos-9001',
    userId: 'usr-101',
    userName: 'Alex Chen',
    location: 'Science & Engineering Building - 2nd Floor Corridor',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    category: 'medical',
    severity: 'high',
    status: 'dispatching',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
    notes: 'First responder team dispatched from Health Center Alpha.',
  },
  {
    id: 'sos-9002',
    userId: 'usr-204',
    userName: 'Campus Automated Sensor',
    location: 'Library Annex Server Room',
    category: 'facility',
    severity: 'medium',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    notes: 'HVAC thermal spike detected. Maintenance team notified.',
  },
];

export function getActiveEmergencyAlerts(): EmergencyAlert[] {
  return MOCK_EMERGENCY_ALERTS;
}

export function triggerSOSAlert(
  userId: string,
  userName: string,
  location: string,
  category: IncidentCategory,
  severity: IncidentSeverity = 'high',
  notes?: string
): EmergencyAlert {
  const newAlert: EmergencyAlert = {
    id: `sos-${Date.now().toString().slice(-4)}`,
    userId,
    userName,
    location,
    category,
    severity,
    status: 'reported',
    timestamp: new Date().toISOString(),
    notes,
  };

  MOCK_EMERGENCY_ALERTS.unshift(newAlert);
  return newAlert;
}

export function resolveEmergencyAlert(alertId: string): EmergencyAlert | null {
  const alert = MOCK_EMERGENCY_ALERTS.find((a) => a.id === alertId);
  if (alert) {
    alert.status = 'resolved';
    return alert;
  }
  return null;
}
