'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  TrendingUp,
  X
} from 'lucide-react';

export default function OverviewPage() {
  const { user, profile } = useAuth();
  
  // Interactive Local State for Production Mocking
  const [coursesCount, setCoursesCount] = useState(0);
  const [hoursLearned, setHoursLearned] = useState(0);
  const [assignments, setAssignments] = useState({ completed: 0, total: 0 });
  
  // Modal state for quick course enrollment
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const handleQuickEnroll = (courseName: string) => {
    setCoursesCount((prev) => prev + 1);
    setHoursLearned((prev) => prev + 2.5);
    setAssignments((prev) => ({ completed: prev.completed, total: prev.total + 2 }));
    setIsEnrollModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-full font-mono font-medium uppercase tracking-wider">
                Role: {profile?.role || 'STUDENT'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good day, {profile?.displayName || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Here is your active academic workspace summary for OnyxStack Labs.
            </p>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Quick Enroll Course
          </button>
        </div>
      </div>

      {/* Production Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Enrolled Courses */}
        <div 
          onClick={() => setIsEnrollModalOpen(true)}
          className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">{coursesCount}</span>
                <span className="text-slate-400 text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>{coursesCount === 0 ? 'Click to enroll first course' : 'View enrolled modules'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Hours Learned */}
        <Link href="/dashboard/ai-assistant" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-amber-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Hours Learned</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{hoursLearned}</span>
                  <span className="text-slate-400 text-sm font-medium">hrs</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition duration-300">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Study with AI Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Card 3: Assignments */}
        <Link href="/dashboard/notes" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Assignments</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {assignments.completed} / {assignments.total}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">Tasks</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition duration-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Manage in Notes Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

      </div>

      {/* Quick Navigation Action Hub */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Quick Actions & Workspaces
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/dashboard/ai-assistant" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-center text-sm font-medium text-slate-300 hover:text-white transition">
            🤖 AI Tutor
          </Link>
          <Link href="/dashboard/notes" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-center text-sm font-medium text-slate-300 hover:text-white transition">
            📝 Notes Hub
          </Link>
          <Link href="/dashboard/mobility" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-center text-sm font-medium text-slate-300 hover:text-white transition">
            📍 Mobility Pass
          </Link>
          <Link href="/dashboard/settings" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-center text-sm font-medium text-slate-300 hover:text-white transition">
            ⚙️ Account Profile
          </Link>
        </div>
      </div>

      {/* Quick Enroll Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Enroll in a Course
              </h3>
              <button 
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Select a featured course module from OnyxStack Labs to join instantly:
            </p>

            <div className="space-y-3">
              {[
                'Full-Stack Next.js 14 Enterprise Architecture',
                'Applied AI & Prompt Engineering Fundamentals',
                'Cloud Systems, Firebase & Vercel DevOps'
              ].map((course, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-between transition">
                  <span className="text-xs font-medium text-slate-200">{course}</span>
                  <button
                    onClick={() => handleQuickEnroll(course)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
