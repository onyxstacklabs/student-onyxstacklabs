'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  addCampusLocation,
  getCampusLocationsForInstitution,
  deleteCampusLocation,
  InstitutionLocation,
} from '@/lib/mobility/institutionMobility';
import { LocationCategory } from '@/types/mobility';
import { PageHeader } from '@/components/ui/PageHeader';
import { MapPin, Plus, Trash2, LocateFixed } from 'lucide-react';

const CATEGORIES: { value: LocationCategory; label: string }[] = [
  { value: 'academic', label: 'Academic Building' },
  { value: 'dormitory', label: 'Dormitory / Hostel' },
  { value: 'charging_station', label: 'EV Charging Station' },
  { value: 'dining', label: 'Dining / Cafeteria' },
  { value: 'recreation', label: 'Recreation' },
  { value: 'safety_hub', label: 'Safety Hub' },
];

function LocationManager() {
  const { user } = useAuth();

  const [locations, setLocations] = useState<InstitutionLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<LocationCategory>('academic');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locatingGps, setLocatingGps] = useState(false);

  const loadLocations = () => {
    if (!user?.uid) return;
    setLoading(true);
    getCampusLocationsForInstitution(user.uid)
      .then((data) => setLocations(data))
      .catch(() => setError('Could not load locations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLocations();
  }, [user?.uid]);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Location services are not available on this device.');
      return;
    }
    setLocatingGps(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocatingGps(false);
      },
      () => {
        setError('Could not get your current location. Please enter coordinates manually.');
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user?.uid || !name.trim() || !address.trim() || !lat || !lng) {
      setError('Please fill in all fields, including coordinates.');
      return;
    }

    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Coordinates must be valid numbers.');
      return;
    }

    setSaving(true);
    try {
      const created = await addCampusLocation(user.uid, name.trim(), category, { lat: latNum, lng: lngNum }, address.trim());
      setLocations((prev) => [...prev, created]);
      setName('');
      setAddress('');
      setLat('');
      setLng('');
    } catch (err) {
      setError('Failed to add location. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previous = locations;
    setLocations((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteCampusLocation(id);
    } catch (err) {
      setError('Failed to delete location.');
      setLocations(previous);
    }
  };

  const inputClass =
    'w-full bg-surface-base border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500';
  const labelClass = 'block text-xs font-mono text-slate-400 uppercase mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <PageHeader
        icon={MapPin}
        title="Campus Locations"
        description="Add real coordinates for buildings, dorms, and EV stations — powers routes, weather, and safety features."
      />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>
      )}

      <form onSubmit={handleAdd} className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-400" /> Add Location
        </h2>

        <div>
          <label className={labelClass}>Location Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g., Main Academic Block"
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as LocationCategory)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
            placeholder="e.g., North Campus, Block A"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Coordinates</label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locatingGps}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 disabled:opacity-50"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              {locatingGps ? 'Locating...' : 'Use My Current Location'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className={inputClass}
              placeholder="Latitude"
            />
            <input
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className={inputClass}
              placeholder="Longitude"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Tip: stand at the location and tap "Use My Current Location" for accurate GPS coordinates.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Adding...' : 'Add Location'}
        </button>
      </form>

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-3">
        <h2 className="text-sm font-bold text-white">Saved Locations ({locations.length})</h2>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : locations.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No locations added yet.</p>
        ) : (
          <div className="space-y-2">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between p-3.5 bg-surface-base border border-surface-border rounded-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{loc.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {CATEGORIES.find((c) => c.value === loc.category)?.label} · {loc.address}
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono">
                    {loc.coordinates.lat.toFixed(4)}, {loc.coordinates.lng.toFixed(4)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-slate-500 hover:text-accent-danger p-1 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <LocationManager />
    </ProtectedRoute>
  );
}
