import { EVScooterTelemetry, EVChargingStation } from '@/types/mobility';

export const MOCK_EV_TELEMETRY: EVScooterTelemetry = {
  batteryLevelPercent: 78,
  estimatedRangeKm: 24.5,
  isCharging: false,
  healthPercent: 96,
  odometerTotalKm: 142.8,
  lastUpdated: new Date().toISOString(),
};

export const MOCK_CHARGING_STATIONS: EVChargingStation[] = [
  {
    id: 'charger-1',
    name: 'Solar Charging Dock Alpha',
    locationId: 'loc-3',
    totalPorts: 6,
    availablePorts: 4,
    chargerType: 'fast',
    costPerKwh: 0, // Free for students
  },
  {
    id: 'charger-2',
    name: 'North Quad Hub Charger',
    locationId: 'loc-1',
    totalPorts: 4,
    availablePorts: 1,
    chargerType: 'standard',
    costPerKwh: 0,
  },
  {
    id: 'charger-3',
    name: 'Dormitory East Dock',
    locationId: 'loc-2',
    totalPorts: 8,
    availablePorts: 0, // All occupied
    chargerType: 'ultra_fast',
    costPerKwh: 0,
  },
];

export function getEVTelemetry(): EVScooterTelemetry {
  return MOCK_EV_TELEMETRY;
}

export function getChargingStations(): EVChargingStation[] {
  return MOCK_CHARGING_STATIONS;
}

export function calculateRangeFromBattery(batteryPercent: number): number {
  // Average EV micro-mobility conversion: ~0.31 km per 1% charge
  return Math.round(batteryPercent * 0.31 * 10) / 10;
}
