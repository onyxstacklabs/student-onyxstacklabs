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

export default function StudentOverview() {
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
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">24.5</span>
                  <span className="text-slate-400 text-sm font-medium">Hours</span>
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

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Access notes workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>
      </div>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Manage Academic Courses
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Course Title</label>
                <input 
                  type="text"
                  placeholder="e.g., Cloud Architecture & DevOps"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Course Code (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., CS-402"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
              >
                Add & Enroll Course
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Your Enrolled Courses</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {courses.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No courses added yet.</p>
                ) : (
                  courses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-white">{c.title}</p>
                        <span className="text-[10px] font-mono text-indigo-400">{c.code}</span>
                      </div>
                      <button
                        onClick={() => toggleEnrollment(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          c.enrolled 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c.enrolled ? 'Enrolled' : 'Join'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
