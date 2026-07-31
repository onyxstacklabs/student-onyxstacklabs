/**
 * Phase 10 — Smart Campus Mobility, EV, Maps & Safety Ecosystem Types
 * Type-safe contracts for mapping, EV telemetry, routing, and emergency features.
 */

export interface CampusCoordinate {
  lat: number;
  lng: number;
  alt?: number;
}

export type LocationCategory =
  | 'academic'
  | 'dormitory'
  | 'charging_station'
  | 'dining'
  | 'recreation'
  | 'safety_hub';

export interface CampusLocation {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: CampusCoordinate;
  address: string;
}

export type TransportMode = 'walking' | 'cycling' | 'ev_scooter' | 'shuttle';

export interface CampusRoute {
  id: string;
  title: string;
  startLocationId: string;
  endLocationId: string;
  distanceKm: number;
  estimatedDurationMinutes: number;
  transportMode: TransportMode;
  waypoints: CampusCoordinate[];
}

export type TripStatus = 'active' | 'completed' | 'cancelled';

export interface TripSession {
  id: string;
  studentUid?: string;
  institutionId?: string;
  studentName?: string;
  routeId?: string;
  startTime: string;
  endTime?: string;
  distanceCoveredKm: number;
  status: TripStatus;
  averageSpeedKmh?: number;
  currentSpeedKmh?: number;
  waypoints?: CampusCoordinate[];
  batteryPercentage?: number;
}

export type ChargerType = 'level_1' | 'level_2' | 'dc_fast';

export interface EVTelemetry {
  currentBatteryPercentage: number;
  batteryCapacityKWh: number;
  estimatedRangeKm: number;
  energyConsumptionWhPerKm: number;
  isCharging: boolean;
  chargerType?: ChargerType;
}

export interface ChargingSession {
  id: string;
  stationName: string;
  startTime: string;
  endTime?: string;
  energyAddedKWh: number;
  costUSD: number;
  status: 'charging' | 'completed';
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  notifyOnSOS: boolean;
}

export type SafetyAlertLevel = 'safe' | 'warning' | 'sos_active';

export interface SafetyStatus {
  status: SafetyAlertLevel;
  lastCheckedIn: string;
  currentLocation?: CampusCoordinate;
  activeSOS: boolean;
}

export interface WeatherCondition {
  temperatureCelsius: number;
  condition: string;
  windSpeedKmh: number;
  precipitationProbability: number;
  isSafeForTransit: boolean;
}
