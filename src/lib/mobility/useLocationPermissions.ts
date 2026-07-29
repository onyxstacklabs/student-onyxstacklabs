'use client';

import { useState, useEffect, useCallback } from 'react';
import { CampusCoordinate } from '@/types/mobility';

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface LocationPermissionStatus {
  permissionState: PermissionState;
  coordinates: CampusCoordinate | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => void;
}

export function useLocationPermissions(): LocationPermissionStatus {
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [coordinates, setCoordinates] = useState<CampusCoordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check initial Permission Status if supported
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setPermissionState('unsupported');
      setError('Geolocation is not supported by your browser.');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state as PermissionState);
          result.onchange = () => {
            setPermissionState(result.state as PermissionState);
          };
        })
        .catch(() => {
          // Fallback if query permissions fails
        });
    }
  }, []);

  const requestPermission = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermissionState('unsupported');
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          alt: position.coords.altitude ?? undefined,
        });
        setPermissionState('granted');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState('denied');
          setError('Location access denied. Please enable location permissions in your browser settings.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Location information is currently unavailable.');
        } else if (err.code === err.TIMEOUT) {
          setError('The request to get your location timed out.');
        } else {
          setError('An unknown error occurred while requesting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    permissionState,
    coordinates,
    error,
    isLoading,
    requestPermission,
  };
}
