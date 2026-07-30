'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  getCoursesForUser,
  createCourse,
  toggleCourseEnrollment,
  Course,
} from '@/lib/academics/courses';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  ArrowRight, 
  Plus, 
  X,
  Check,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
}

function StudentOverview() {
  const { user, profile, role } = useAuth();
  const userRole = role || profile?.role || 'STUDENT';

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courseError, setCourseError] = useState('');

  // ⚠️ Notes still localStorage-backed — separate Notes Workspace module,
  // locked as the next step in our sequence, not silently left behind.
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    setCoursesLoading(true);
    getCoursesForUser(user.uid)
      .then((data) => {
        if (mounted) setCourses(data);
      })
      .catch(() => {
        if (mounted) setCourseError('Could not load your courses right now.');
      })
      .finally(() => {
        if (mounted) setCoursesLoading(false);
      });

    const savedNotes = localStorage.getItem('onyx_student_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {}
    }

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const toggleEnrollment = async (id: string, current: boolean) => {
    const next = !current;
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, enrolled: next } : c)));
    try {
      await toggleCourseEnrollment(id, next);
    } catch (e) {
      setCourseError('Failed to update enrollment. Please try again.');
      setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, enrolled: current } : c)));
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user?.uid) return;

    setSubmitting(true);
    setCourseError('');
    try {
      const created = await createCourse(user.uid, newTitle, newCode);
      setCourses((prev) => [created, ...prev]);
      setNewTitle('');
      setNewCode('');
    } catch (e) {
      setCourseError('Failed to add course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeEnrolledCount = courses.filter((c) => c.enrolled).length;
  const estimatedHours = (activeEnrolledCount * 2.5).toFixed(1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-full font-mono font-medium uppercase tracking-wider">
                Role: {userRole}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good day, {profile?.displayName || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Here is your live academic overview and workspace summary for OnyxStack Labs.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Manage Courses
          </button>
        </div>
      </div>

      {courseError && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">
          {courseError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">ENROLLED COURSES</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  {coursesLoading ? '—' : activeEnrolledCount}
                </span>
                <span className="text-slate-400 text-sm font-medium">Courses</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>
              {coursesLoading
                ? 'Loading...'
                : activeEnrolledCount === 0
                ? 'No courses joined'
                : `${activeEnrolledCount} Modules Active`}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        <Link href="/dashboard/ai-assistant" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-amber-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">HOURS LEARNED</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {coursesLoading ? '—' : estimatedHours}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">hrs</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition duration-300">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Track study metrics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/notes" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">SAVED NOTES</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{notes.length}</span>
                  <span className="text-slate-400 text-sm font-medium">Documents</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition duration-300">
                <FileText className="w-6 h-6" />
              </div>
            </div>
