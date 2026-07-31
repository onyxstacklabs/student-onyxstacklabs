'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { Building2, MapPin, Mail, Phone, Layers, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';

export function InstitutionOverviewCard() {
  const { user, profile } = useAuth();
  const details = profile?.institutionDetails;

  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState('');
  const [rosterOpen, setRosterOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setStudentsLoading(true);
    getStudentsForInstitution(user.uid)
      .then((data) => {
        if (mounted) setStudents(data);
      })
      .catch(() => {
        if (mounted) setStudentsError('Could not load student roster.');
      })
      .finally(() => {
        if (mounted) setStudentsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

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

      {studentsError && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-xs rounded-lg">
          {studentsError}
        </div>
      )}

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
        <button
          onClick={() => setRosterOpen((prev) => !prev)}
          className="p-4 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl space-y-1 text-left transition col-span-2 sm:col-span-1"
        >
          <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Users className="w-3 h-3" /> Students
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-2xl font-bold text-white">
              {studentsLoading ? '—' : students.length}
            </p>
            {rosterOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </div>
        </button>
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

      {rosterOpen && (
        <div className="border-t border-slate-800 pt-4 space-y-2">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Student Roster</p>
          {studentsLoading ? (
            <p className="text-xs text-slate-500 py-4 text-center">Loading roster...</p>
          ) : students.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No students have registered under this institution yet.
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {students.map((s) => (
                <div
                  key={s.uid}
                  className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{s.displayName}</p>
                    <p className="text-[11px] text-slate-500">{s.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-400 font-mono">{s.className}</p>
                    <p className="text-[10px] text-slate-500">{s.rollNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
