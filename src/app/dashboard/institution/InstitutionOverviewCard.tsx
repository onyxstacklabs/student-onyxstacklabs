'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Building2, MapPin, Mail, Phone, Layers, Calendar, Users } from 'lucide-react';

export function InstitutionOverviewCard() {
  const { profile } = useAuth();
  const details = profile?.institutionDetails;

  if (!details) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <p className="text-sm text-slate-400">
          Institution profile details are not set up yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{details.institutionName}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> {details.address}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Layers className="w-3 h-3" /> Classes
          </p>
          <p className="text-2xl font-bold text-white">{details.classes.length}</p>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Semesters
          </p>
          <p className="text-2xl font-bold text-white">{details.semesters.length}</p>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Users className="w-3 h-3" /> Students
          </p>
          <p className="text-sm font-medium text-amber-400 pt-1">Not linked yet</p>
        </div>
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 col-span-2 sm:col-span-1">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Contact</p>
          <p className="text-xs text-slate-300 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 flex-shrink-0" /> {details.contactEmail}
          </p>
          <p className="text-xs text-slate-300 flex items-center gap-1">
            <Phone className="w-3 h-3 flex-shrink-0" /> {details.contactNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
