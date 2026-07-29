import { CampusLocation, CampusRoute, LocationCategory } from '@/types/mobility';

export const MOCK_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc-1',
    name: 'Main Academic Building',
    category: 'academic',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    address: 'Campus North Quad, Block A',
  },
  {
    id: 'loc-2',
    name: 'Student Innovation Dorms',
    category: 'dormitory',
    coordinates: { lat: 37.7780, lng: -122.4160 },
    address: 'East Residential Zone, Gate 3',
  },
  {
    id: 'loc-3',
    name: 'Solar EV Charging Hub Alpha',
    category: 'charging_station',
    coordinates: { lat: 37.7730, lng: -122.4220 },
    address: 'South Tech Parking Lot',
  },
  {
    id: 'loc-4',
    name: 'Central Dining Hall',
    category: 'dining',
    coordinates: { lat: 37.7765, lng: -122.4180 },
    address: 'Student Center, Level 1',
  },
  {
    id: 'loc-5',
    name: 'Campus Safety & Emergency Station',
    category: 'safety_hub',
    coordinates: { lat: 37.7752, lng: -122.4205 },
    address: 'Main Gate Security Building',
  },
];

export const MOCK_CAMPUS_ROUTES: CampusRoute[] = [
  {
    id: 'route-1',
    title: 'North Quad Express (Dorms -> Academic)',
    startLocationId: 'loc-2',
    endLocationId: 'loc-1',
    distanceKm: 0.85,
    estimatedDurationMinutes: 11,
    transportMode: 'walking',
    waypoints: [
      { lat: 37.7780, lng: -122.4160 },
      { lat: 37.7765, lng: -122.4180 },
      { lat: 37.7749, lng: -122.4194 },
    ],
  },
  {
    id: 'route-2',
    title: 'EV Shuttle Loop (EV Station -> Dining -> North Quad)',
    startLocationId: 'loc-3',
    endLocationId: 'loc-1',
    distanceKm: 1.6,
    estimatedDurationMinutes: 5,
    transportMode: 'ev_scooter',
    waypoints: [
      { lat: 37.7730, lng: -122.4220 },
      { lat: 37.7752, lng: -122.4205 },
      { lat: 37.7765, lng: -122.4180 },
      { lat: 37.7749, lng: -122.4194 },
    ],
  },
];

export function getCampusLocations(category?: LocationCategory): CampusLocation[] {
  if (!category) return MOCK_CAMPUS_LOCATIONS;
  return MOCK_CAMPUS_LOCATIONS.filter((loc) => loc.category === category);
}

export function getCampusRoutes(): CampusRoute[] {
  return MOCK_CAMPUS_ROUTES;
}

export function getRouteById(routeId: string): CampusRoute | undefined {
  return MOCK_CAMPUS_ROUTES.find((r) => r.id === routeId);
}
