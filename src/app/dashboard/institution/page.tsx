'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { InstitutionOverviewCard } from '@/components/institution/InstitutionOverviewCard';
import { EmergencyAlertsPanel } from '@/components/institution/EmergencyAlertsPanel';
import { LiveTripsPanel } from '@/components/institution/LiveTripsPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { Building2, Users, Palette, UserPlus, Receipt, CalendarClock, MapPin, ArrowRight } from 'lucide-react';

function InstitutionDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-0">
      <PageHeader
        icon={Building2}
        title="Institution Portal"
        description="Manage your students, teachers, schedules, and finances — all in one place."
      />

      <div className="space-y-6">
        <EmergencyAlertsPanel />

        <LiveTripsPanel />

        <InstitutionOverviewCard />

        {/* Quick Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/institution/teachers"
            className="p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-brand-500/40 rounded-card space-y-3 transition block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-400">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-semibold text-white text-sm">Invite Teachers</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate invite codes to onboard teachers into their assigned classes.
            </p>
          </Link>

          <Link
            href="/dashboard/institution/locations"
            className="p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-accent-warning/40 rounded-card space-y-3 transition block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent-warning">
                <MapPin className="w-5 h-5" />
                <h3 className="font-semibold text-white text-sm">Campus Locations</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add real coordinates for buildings, dorms, and safety features.
            </p>
          </Link>

          <Link
            href="/dashboard/institution/timetable"
            className="p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-sky-500/40 rounded-card space-y-3 transition block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400">
                <CalendarClock className="w-5 h-5" />
                <h3 className="font-semibold text-white text-sm">Timetable</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build the weekly class schedule for each of your classes.
            </p>
          </Link>

          <Link
            href="/dashboard/institution/fees"
            className="p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-teal-500/40 rounded-card space-y-3 transition block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400">
                <Receipt className="w-5 h-5" />
                <h3 className="font-semibold text-white text-sm">Fee Management</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create invoices, record payments, and track your ledger.
            </p>
          </Link>

          <Link
            href="/dashboard/institution/branding"
            className="p-5 bg-surface-raised/60 hover:bg-surface-raised border border-surface-border hover:border-pink-500/40 rounded-card space-y-3 transition block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-pink-400">
                <Palette className="w-5 h-5" />
                <h3 className="font-semibold text-white text-sm">Branding</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your logo and set an accent color for your portal.
            </p>
          </Link>

          <div className="p-5 bg-surface-raised/40 border border-surface-border rounded-card space-y-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-white text-sm">Student Roster</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              View your full student list from the overview card above — tap "Students" to expand it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstitutionDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <InstitutionDashboard />
    </ProtectedRoute>
  );
}
