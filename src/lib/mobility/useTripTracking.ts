'use client';

import { useState, useEffect, useCallback } from 'react';
import { TripSession, CampusRoute } from '@/types/mobility';

export interface UseTripTrackingReturn {
  activeTrip: TripSession | null;
  isTracking: boolean;
  elapsedSeconds: number;
  startTrip: (route?: CampusRoute) => void;
  pauseTrip: () => void;
  stopTrip: () => void;
}

export function useTripTracking(): UseTripTrackingReturn {
  const [activeTrip, setActiveTrip] = useState<TripSession | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Live timer tick for active tracking
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

  const startTrip = useCallback((route?: CampusRoute) => {
    const newSession: TripSession = {
      id: `trip-${Date.now()}`,
      routeId: route?.id,
      startTime: new Date().toISOString(),
      distanceCoveredKm: 0,
      status: 'active',
      averageSpeedKmh: 0,
    };
    setActiveTrip(newSession);
    setElapsedSeconds(0);
    setIsTracking(true);
  }, []);

  const pauseTrip = useCallback(() => {
    setIsTracking(false);
  }, []);

  const stopTrip = useCallback(() => {
    setIsTracking(false);
    if (activeTrip) {
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
    startTrip,
    pauseTrip,
    stopTrip,
  };
}
