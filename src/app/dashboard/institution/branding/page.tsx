'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { uploadInstitutionLogo, setInstitutionAccentColor } from '@/lib/academics/institutionBranding';
import { PageHeader } from '@/components/ui/PageHeader';
import { Palette, Upload, CheckCircle2 } from 'lucide-react';

const PRESET_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function BrandingManager() {
  const { user, profile } = useAuth();
  const details = profile?.institutionDetails;

  const [logoPreview, setLogoPreview] = useState(details?.logoUrl || '');
  const [uploading, setUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(details?.accentColor || '#4f46e5');
  const [savingColor, setSavingColor] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    setError('');
    setSuccessMsg('');
    setUploading(true);
    try {
      const url = await uploadInstitutionLogo(user.uid, file);
      setLogoPreview(url);
      setSuccessMsg('Logo uploaded successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveColor = async (color: string) => {
    if (!user?.uid) return;
    setSelectedColor(color);
    setSavingColor(true);
    setError('');
    try {
      await setInstitutionAccentColor(user.uid, color);
      setSuccessMsg('Accent color updated.');
    } catch (err) {
      setError('Failed to save color.');
    } finally {
      setSavingColor(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <PageHeader
        icon={Palette}
        title="Institution Branding"
        description="Upload your logo and choose an accent color for your portal."
      />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>
      )}
      {successMsg && (
        <div className="p-3 bg-accent-success/10 border border-accent-success text-accent-success text-sm rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Logo</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-surface-base border border-surface-border flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Institution logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-2xl font-bold text-slate-600">
                {details?.institutionName?.charAt(0) || 'I'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition cursor-pointer">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Logo'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoChange} disabled={uploading} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-500 mt-1.5">PNG, JPG, WEBP or SVG — max 2MB</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">Accent Color</h2>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleSaveColor(color)}
              disabled={savingColor}
              className={`w-10 h-10 rounded-full border-2 transition ${
                selectedColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs text-slate-500">Custom:</span>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleSaveColor(e.target.value)}
            disabled={savingColor}
            className="w-10 h-10 rounded-lg border border-surface-border bg-transparent cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400">{selectedColor}</span>
        </div>
      </div>
    </div>
  );
}

export default function InstitutionBrandingPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <BrandingManager />
    </ProtectedRoute>
  );
}
