'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TripSession, CampusRoute, CampusCoordinate } from '@/types/mobility';
import { useAuth } from '@/context/AuthContext';
import { createTrip, updateTripProgress, endTrip as endTripInFirestore } from '@/lib/mobility/tripService';

export interface UseTripTrackingReturn {
  activeTrip: TripSession | null;
  isTracking: boolean;
  elapsedSeconds: number;
  error: string;
  startTrip: (route?: CampusRoute, batteryPercentage?: number) => Promise<void>;
  pauseTrip: () => void;
  stopTrip: () => Promise<void>;
}

// Haversine formula — distance in km between two GPS coordinates.
function haversineDistanceKm(a: CampusCoordinate, b: CampusCoordinate): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function useTripTracking(): UseTripTrackingReturn {
  const { user, profile } = useAuth();

  const [activeTrip, setActiveTrip] = useState<TripSession | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const watchIdRef = useRef<number | null>(null);
  const waypointsRef = useRef<CampusCoordinate[]>([]);
  const distanceRef = useRef<number>(0);
  const lastPositionRef = useRef<{ coord: CampusCoordinate; timestamp: number } | null>(null);
  const lastFirestoreWriteRef = useRef<number>(0);
  const tripStartTimeRef = useRef<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const startTrip = useCallback(
    async (route?: CampusRoute, batteryPercentage?: number) => {
      if (!user?.uid) {
        setError('You must be signed in to start a trip.');
        return;
      }
      if (!('geolocation' in navigator)) {
        setError('Location services are not available on this device.');
        return;
      }

      setError('');
      waypointsRef.current = [];
      distanceRef.current = 0;
      lastPositionRef.current = null;
      tripStartTimeRef.current = Date.now();

      try {
        const trip = await createTrip(
          user.uid,
          profile?.displayName || 'Student',
          profile?.studentDetails?.institutionId,
          batteryPercentage
        );
        setActiveTrip({ ...trip, routeId: route?.id });
      } catch (e) {
        setError('Could not start trip. Please try again.');
        return;
      }

      setElapsedSeconds(0);
      setIsTracking(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const coord: CampusCoordinate = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            alt: position.coords.altitude ?? undefined,
          };
          const now = Date.now();

          if (lastPositionRef.current) {
            const segmentKm = haversineDistanceKm(lastPositionRef.current.coord, coord);
            // Ignore GPS jitter smaller than 3 meters — avoids false distance accumulation while stationary.
            if (segmentKm > 0.003) {
              distanceRef.current += segmentKm;
              waypointsRef.current = [...waypointsRef.current, coord];
            }
          } else {
            waypointsRef.current = [coord];
          }

          lastPositionRef.current = { coord, timestamp: now };

          const elapsedHours = (now - tripStartTimeRef.current) / 1000 / 3600;
          const avgSpeed = elapsedHours > 0 ? distanceRef.current / elapsedHours : 0;
          const currentSpeed =
            position.coords.speed !== null && position.coords.speed >= 0
              ? position.coords.speed * 3.6 // m/s -> km/h
              : avgSpeed;

          setActiveTrip((prev) =>
            prev
              ? {
                  ...prev,
                  distanceCoveredKm: Math.round(distanceRef.current * 1000) / 1000,
                  averageSpeedKmh: Math.round(avgSpeed * 10) / 10,
                  currentSpeedKmh: Math.round(currentSpeed * 10) / 10,
                }
              : prev
          );

          // Throttle Firestore writes to once every 10 seconds to avoid excessive cost.
          if (now - lastFirestoreWriteRef.current > 10000 && activeTrip) {
            lastFirestoreWriteRef.current = now;
            updateTripProgress(
              activeTrip.id,
              distanceRef.current,
              avgSpeed,
              currentSpeed,
              waypointsRef.current
            ).catch(() => {
              // Non-fatal — local tracking continues even if a sync fails.
            });
          }
        },
        (err) => {
          setError('Lost GPS signal: ' + err.message);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    },
    [user?.uid, profile, activeTrip]
  );

  const pauseTrip = useCallback(() => {
    setIsTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const stopTrip = useCallback(async () => {
    setIsTracking(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (activeTrip) {
      try {
        await updateTripProgress(
          activeTrip.id,
          distanceRef.current,
          activeTrip.averageSpeedKmh || 0,
          0,
          waypointsRef.current
        );
        await endTripInFirestore(activeTrip.id);
      } catch (e) {
        setError('Trip ended locally, but could not sync final data.');
      }

      setActiveTrip((prev) =>
        prev
          ? {
              ...prev,
              endTime: new Date().toISOString(),
              status: 'completed',
            }
          : null
      );
    }
  }, [activeTrip]);

  return {
    activeTrip,
    isTracking,
    elapsedSeconds,
    error,
    startTrip,
    pauseTrip,
    stopTrip,
  };
}
