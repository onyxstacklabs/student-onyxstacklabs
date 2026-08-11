'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getInstitutionContact, InstitutionContact } from '@/lib/academics/institutions';
import { PLATFORM_CONFIG } from '@/lib/config/platform';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  UserCheck,
  Building,
  Bell,
  Mail,
  MessageCircle,
} from 'lucide-react';

function GovernancePortal() {
  const { profile } = useAuth();
  const studentName = profile?.displayName || 'Student User';
  const studentDetails = profile?.studentDetails;
  const institutionId = studentDetails?.institutionId;

  const [institutionContact, setInstitutionContact] = useState<InstitutionContact | null>(null);
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    if (!institutionId) {
      setLoadingContact(false);
      return;
    }
    let mounted = true;
    getInstitutionContact(institutionId)
      .then((data) => {
        if (mounted) setInstitutionContact(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingContact(false);
      });
    return () => {
      mounted = false;
    };
  }, [institutionId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      <PageHeader
        icon={ShieldAlert}
        title="Governance & Safety"
        description="Emergency contacts, your digital ID, and campus safety information."
        actions={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-accent-success/10 text-accent-success border border-accent-success/20">
            <Activity className="w-3.5 h-3.5" />
            <span>Systems Online</span>
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* SOS Info (real button lives as the floating red button app-wide) */}
          <div className="p-6 rounded-card border border-surface-border bg-surface-raised/60">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-accent-danger/10 border border-accent-danger/20 rounded-xl text-accent-danger shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">In case of emergency</h2>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Tap the red SOS button in the corner of your screen at any time. It instantly notifies your
                  institution with your name, class, and location so help can reach you fast.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Notices — honest placeholder until Institution notice-board feature is built */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-400" />
              Campus Safety Notices
            </h2>
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-600" />
              <p className="text-sm text-slate-400">No notices from your institution yet.</p>
              <p className="text-xs text-slate-500">Safety updates and announcements will appear here.</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Digital Student ID */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-brand-400" />
                Digital Student ID
              </span>
            </div>

            <div className="p-4 bg-surface-base border border-surface-border rounded-xl space-y-3 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400 text-xl font-bold">
                {studentName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{studentName}</p>
                {studentDetails?.rollNumber && (
                  <p className="text-[11px] text-slate-400">Roll No: {studentDetails.rollNumber}</p>
                )}
                {studentDetails?.className && (
                  <p className="text-[11px] text-slate-400">Class: {studentDetails.className}</p>
                )}
                {studentDetails?.collegeName && (
                  <p className="text-[10px] font-mono text-brand-400 mt-1">{studentDetails.collegeName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contacts — real institution info, fallback to platform support */}
          <div className="p-5 bg-surface-raised/60 border border-surface-border rounded-card space-y-3">
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-accent-success" />
              Emergency Contacts
            </h3>

            <div className="space-y-2">
              {loadingContact ? (
                <p className="text-xs text-slate-500 py-3 text-center">Loading...</p>
              ) : institutionContact && (institutionContact.contactNumber || institutionContact.contactEmail) ? (
                <>
                  {institutionContact.contactNumber && (
                    <div className="p-2.5 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-brand-400" /> {institutionContact.institutionName}
                      </span>
                      <span className="font-mono font-bold text-brand-400">{institutionContact.contactNumber}</span>
                    </div>
                  )}
                  {institutionContact.contactEmail && (
                    <div className="p-2.5 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-brand-400" /> Email
                      </span>
                      <span className="font-mono font-bold text-slate-300 truncate max-w-[140px]">
                        {institutionContact.contactEmail}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500 py-2">
                  Your institution hasn't added contact details yet.
                </p>
              )}

              {/* Platform support — always available as a fallback */}
              <div className="p-2.5 bg-surface-base rounded-xl border border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-accent-success" /> Platform Support
                </span>
                <span className="font-mono font-bold text-accent-success">{PLATFORM_CONFIG.whatsappNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GovernancePage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <GovernancePortal />
    </ProtectedRoute>
  );
}
