'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CampusLocation, CampusCoordinate } from '@/types/mobility';

interface CampusMapProps {
  initialCenter?: CampusCoordinate;
  zoom?: number;
  locations?: CampusLocation[];
  activeRouteWaypoints?: CampusCoordinate[];
  height?: string;
  onLocationSelect?: (location: CampusLocation) => void;
}

const DEFAULT_CENTER: CampusCoordinate = { lat: 37.7749, lng: -122.4194 };

export function CampusMap({
  initialCenter = DEFAULT_CENTER,
  zoom = 15,
  locations = [],
  activeRouteWaypoints = [],
  height = '450px',
  onLocationSelect,
}: CampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

    // Load Leaflet dynamically in DOM environment safely
    import('leaflet').then((L) => {
      if (!document.getElementById('leaflet-css-stylesheet')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-stylesheet';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!).setView(
        [initialCenter.lat, initialCenter.lng],
        zoom
      );

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, initialCenter, zoom]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      locations.forEach((loc) => {
        const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `<div class="p-1 text-slate-900">
              <strong class="text-sm font-bold block">${loc.name}</strong>
              <span class="text-xs text-slate-600 capitalize">${loc.category.replace('_', ' ')}</span>
            </div>`
          );

        marker.on('click', () => {
          if (onLocationSelect) onLocationSelect(loc);
        });

        markersRef.current.push(marker);
      });
    });
  }, [mapLoaded, locations, onLocationSelect]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      if (activeRouteWaypoints.length > 1) {
        const latLngs = activeRouteWaypoints.map((pt) => [pt.lat, pt.lng] as [number, number]);
        const polyline = L.polyline(latLngs, {
          color: '#6366f1',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
        }).addTo(mapInstanceRef.current);

        polylineRef.current = polyline;
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [30, 30] });
      }
    });
  }, [mapLoaded, activeRouteWaypoints]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {!isClient || !mapLoaded ? (
        <div
          style={{ height }}
          className="w-full bg-slate-950 flex flex-col items-center justify-center space-y-3 text-slate-400"
        >
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs font-medium">Initializing Campus Interactive Map...</span>
        </div>
      ) : null}

      <div
        ref={mapContainerRef}
        style={{ height, display: mapLoaded ? 'block' : 'none' }}
        className="w-full z-0"
      />
    </div>
  );
}
