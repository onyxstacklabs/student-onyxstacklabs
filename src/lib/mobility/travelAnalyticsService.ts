import { TravelAnalytics } from '@/types/mobility';

export const MOCK_TRAVEL_ANALYTICS: TravelAnalytics = {
  totalDistanceKm: 48.6,
  totalTrips: 32,
  co2SavedKg: 9.2,
  modeBreakdown: {
    walking: 14.2,
    cycling: 18.0,
    ev_scooter: 12.4,
    shuttle: 4.0,
  },
  weeklyDistanceKm: [5.2, 7.4, 6.8, 8.1, 9.5, 6.2, 5.4],
};

export function getTravelAnalytics(): TravelAnalytics {
  return MOCK_TRAVEL_ANALYTICS;
}

export function calculateCo2Savings(distanceKm: number, mode: string): number {
  // Average passenger car emissions: ~0.192 kg CO2 per km
  // Zero-emission micro-mobility savings offset factor:
  const offsetFactors: Record<string, number> = {
    walking: 0.192,
    cycling: 0.192,
    ev_scooter: 0.165, // subtract grid charging footprint
    shuttle: 0.120,    // shared transit offset
  };

  const factor = offsetFactors[mode] || 0.150;
  return Math.round(distanceKm * factor * 10) / 10;
}
