import { DigitalIDVerification } from '@/types/governance';

export const MOCK_DIGITAL_ID: DigitalIDVerification = {
  studentId: 'OSL-2026-8891',
  fullName: 'Alex Chen',
  clearanceLevel: 'Elevated',
  isBiometricVerified: true,
  rfidCardStatus: 'active',
  accessZonesPermitted: [
    'Main Library & Study Hubs',
    'Computer Science & AI Labs',
    'Solar EV Mobility Stations',
    'Student Recreation & Athletics',
    'Innovation Incubator Center',
  ],
};

export function getDigitalIDInfo(): DigitalIDVerification {
  return MOCK_DIGITAL_ID;
}

export function updateRFIDCardStatus(status: DigitalIDVerification['rfidCardStatus']): DigitalIDVerification {
  MOCK_DIGITAL_ID.rfidCardStatus = status;
  return { ...MOCK_DIGITAL_ID };
}

export function verifyZoneAccess(zoneName: string): boolean {
  return MOCK_DIGITAL_ID.accessZonesPermitted.includes(zoneName) && MOCK_DIGITAL_ID.rfidCardStatus === 'active';
}
