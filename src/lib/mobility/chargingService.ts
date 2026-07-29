import { EVChargingStation, EVChargingSession } from '@/types/mobility';
import { MOCK_CHARGING_STATIONS } from '@/lib/mobility/evTelemetryService';

export const MOCK_ACTIVE_SESSION: EVChargingSession = {
  id: 'session-101',
  stationId: 'charger-1',
  startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
  energyAddedKwh: 3.4,
  currentBatteryPercent: 78,
  targetBatteryPercent: 100,
  status: 'charging',
};

export function getChargingStations(): EVChargingStation[] {
  return MOCK_CHARGING_STATIONS;
}

export function getActiveChargingSession(): EVChargingSession | null {
  return MOCK_ACTIVE_SESSION;
}

export function startChargingSession(stationId: string): EVChargingSession {
  return {
    id: `session-${Date.now()}`,
    stationId,
    startTime: new Date().toISOString(),
    energyAddedKwh: 0.1,
    currentBatteryPercent: 45,
    targetBatteryPercent: 100,
    status: 'charging',
  };
}

export function stopChargingSession(sessionId: string): EVChargingSession {
  return {
    ...MOCK_ACTIVE_SESSION,
    id: sessionId,
    endTime: new Date().toISOString(),
    status: 'completed',
  };
}
