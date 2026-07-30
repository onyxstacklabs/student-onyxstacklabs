'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  X,
  Sparkles,
  Check
} from 'lucide-react';

interface CustomCourse {
  id: string;
  title: string;
  code: string;
  enrolled: boolean;
}

export default function OverviewPage() {
  const { user, profile } = useAuth();
  
  // Dynamic Local Storage Sync for Courses & Notes
  const [courses, setCourses] = useState<CustomCourse[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Course Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');

  // Sync state on page load
  useEffect(() => {
    // Sync Courses
    const savedCourses = localStorage.getItem('onyx_student_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const initial = [
        { id: '1', title: 'Data Structures & Algorithms', code: 'CS-201', enrolled: true },
        { id: '2', title: 'Database Management Systems', code: 'CS-303', enrolled: false }
      ];
      setCourses(initial);
      localStorage.setItem('onyx_student_courses', JSON.stringify(initial));
    }

    // Sync Notes count
    const savedNotes = localStorage.getItem('onyx_student_notes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotesCount(parsed.length);
      } catch(e){}
    }
  }, []);

  const saveCoursesToStorage = (updated: CustomCourse[]) => {
    setCourses(updated);
    localStorage.setItem('onyx_student_courses', JSON.stringify(updated));
  };

  // Toggle Enroll Status
  const toggleEnroll = (id: string) => {
    const updated = courses.map(c => c.id === id ? { ...c, enrolled: !c.enrolled } : c);
    saveCoursesToStorage(updated);
  };

  // Create Custom Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: CustomCourse = {
      id: Date.now().toString(),
      title: newTitle,
      code: newCode.toUpperCase() || 'GENERAL',
      enrolled: true,
    };

    saveCoursesToStorage([newCourse, ...courses]);
    setNewTitle('');
    setNewCode('');
  };

  const enrolledCount = courses.filter(c => c.enrolled).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-full font-mono uppercase">
              Role: {profile?.role || 'STUDENT'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Good day, {profile?.displayName || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Manage & Add Courses
          </button>
        </div>
      </div>

      {/* Production Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Enrolled Courses */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Enrolled Courses</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-white">{enrolledCount}</span>
                <span className="text-slate-400 text-sm">Active</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400">
            <span>Manage / Create Custom Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Hours Learned */}
        <Link href="/dashboard/ai-assistant" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase">Hours Learned</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-white">{(enrolledCount * 3.5).toFixed(1)}</span>
                  <span className="text-slate-400 text-sm">hrs</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400">
              <span>Study with AI Assistant</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Card 3: Saved Notes / Tasks */}
        <Link href="/dashboard/notes" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase">Saved Notes</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-white">{notesCount}</span>
                  <span className="text-slate-400 text-sm">Notes</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400">
              <span>Open Notes Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

      </div>

      {/* Interactive Modal: Add & Select Courses */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Course Manager
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Course Form */}
            <form onSubmit={handleCreateCourse} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-mono text-indigo-400 uppercase">➕ Create Custom Course</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Course Name (e.g. Physics)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (PHY101)"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
              >
                Add & Auto-Enroll
              </button>
            </form>

            {/* Available Courses List */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-slate-400 uppercase">Select / Enroll Courses</p>
              {courses.map((course) => (
                <div key={course.id} className="p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                      {course.code}
                    </span>
                    <h4 className="text-xs font-medium text-white mt-1">{course.title}</h4>
                  </div>
                  <button
                    onClick={() => toggleEnroll(course.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
                      course.enrolled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {course.enrolled ? <><Check className="w-3 h-3" /> Enrolled</> : 'Enroll'}
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
