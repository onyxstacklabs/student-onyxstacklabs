'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  ArrowRight, 
  Plus, 
  X,
  Sparkles,
  Check,
  ShieldAlert,
  Bot,
  Compass
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  enrolled: boolean;
}

interface Note {
  id: string;
  title: string;
}

function StudentOverview() {
  const { user, profile, role } = useAuth();
  const userRole = role || profile?.role || 'STUDENT';

  // ⚠️ TEMPORARY: still localStorage-backed. Replaced in the next step
  // once the real Firestore `courses` service exists — flagged, not forgotten.
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    const savedCourses = localStorage.getItem('onyx_student_courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (e) {}
    }

    const savedNotes = localStorage.getItem('onyx_student_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {}
    }
  }, []);

  const saveCoursesToStorage = (updated: Course[]) => {
    setCourses(updated);
    localStorage.setItem('onyx_student_courses', JSON.stringify(updated));
  };

  const toggleEnrollment = (id: string) => {
    const updated = courses.map((c) => 
      c.id === id ? { ...c, enrolled: !c.enrolled } : c
    );
    saveCoursesToStorage(updated);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: Date.now().toString(),
      title: newTitle,
      code: newCode.toUpperCase() || 'CUSTOM',
      enrolled: true,
    };

    saveCoursesToStorage([newCourse, ...courses]);
    setNewTitle('');
    setNewCode('');
  };

  const activeEnrolledCount = courses.filter((c) => c.enrolled).length;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">ENROLLED COURSES</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white tracking-tight">{activeEnrolledCount}</span>
                <span className="text-slate-400 text-sm font-medium">Courses</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
            <span>{activeEnrolledCount === 0 ? 'No courses joined' : `${activeEnrolledCount} Modules Active`}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        <Link href="/dashboard/ai-assistant" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-amber-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">HOURS LEARNED</p>
                <div classN
