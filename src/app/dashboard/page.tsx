'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
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
  Compass,
  ShieldCheck,
  Users,
  DollarSign,
  Activity,
  Globe
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

export default function OverviewPage() {
  const { user, profile, role } = useAuth();
  
  // Resolve active role safely
  const userRole = role || profile?.role || 'STUDENT';
  const isAdmin = userRole === 'ADMIN';

  // Dynamic SaaS State persistent via LocalStorage
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Custom course form
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');

  // Auto-sync state from localStorage across modules
  useEffect(() => {
    const savedCourses = localStorage.getItem('onyx_student_courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (e) {}
    } else {
      const initial: Course[] = [
        { id: '1', title: 'Data Structures & Algorithms', code: 'CS-201', enrolled: true },
        { id: '2', title: 'Database Management Systems', code: 'CS-303', enrolled: true },
        { id: '3', title: 'Software Engineering Principles', code: 'CS-401', enrolled: false }
      ];
      setCourses(initial);
      localStorage.setItem('onyx_student_courses', JSON.stringify(initial));
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

  // ==========================================
  // 🛑 ADMIN DASHBOARD VIEW (If Role is ADMIN)
  // ==========================================
  if (isAdmin) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Super Admin Enterprise Banner Header */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl shadow-rose-500/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs rounded-full font-mono font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Portal
                </span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-full font-mono">
                  Current Role: ADMIN
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Enterprise Operations & Governance
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-1">
                Manage multi-tenant indexing, RBAC user access, SaaS telemetry, and SEO rules across OnyxStack Labs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition border border-slate-700"
              >
                Test Student Portal
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-rose-600/20 active:scale-95"
              >
                <Globe className="w-4 h-4" /> Public Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Enterprise Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">TOTAL SAAS USERS</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">1,248</span>
                  <span className="text-emerald-400 text-xs font-semibold">+14% this month</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">MONTHLY REVENUE (MRR)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">$4,850</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Active Paid Subscriptions</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">ACTIVE WORKSPACES</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">312</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Node Health: 99.9% Uptime</p>
          </div>
        </div>

        {/* Admin Quick Control Modules */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Super Admin Control Center
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-mono uppercase text-indigo-400 font-bold">RBAC & Permissions</h4>
              <p className="text-xs text-slate-400">Manage user access rights and security tokens.</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold">SEO & GEO Indexing</h4>
              <p className="text-xs text-slate-400">Configure search keyword weights and web crawlers.</p>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-mono uppercase text-amber-400 font-bold">System Telemetry</h4>
              <p className="text-xs text-slate-400">Monitor live logs, API latency, and database health.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📚 STUDENT PORTAL VIEW (If Role is STUDENT)
  // ==========================================
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* SaaS Enterprise Banner Header */}
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

      {/* Interactive Production Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Enrolled Courses */}
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

        {/* Card 2: Tracked Study Time */}
        <Link href="/dashboard/ai-assistant" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-amber-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">HOURS LEARNED</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {(activeEnrolledCount * 2.5).toFixed(1)}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">hrs</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition duration-300">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Tracked study time</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

        {/* Card 3: Saved Notes */}
        <Link href="/dashboard/notes" className="block group">
          <div className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">WORKSPACE NOTES</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{notes.length}</span>
                  <span className="text-slate-400 text-sm font-medium">Saved</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition duration-300">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>{notes.length === 0 ? 'No active notes' : 'Access Notes Workspace'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </Link>

      </div>

      {/* Workspaces Direct Action Grid */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Active Workspaces & SaaS Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/dashboard/ai-assistant" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white transition group">
            <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
            <span>AI Assistant</span>
          </Link>

          <Link href="/dashboard/notes" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white transition group">
            <FileText className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            <span>Notes Engine</span>
          </Link>

          <Link href="/dashboard/mobility" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white transition group">
            <Compass className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            <span>Campus Mobility</span>
          </Link>

          <Link href="/dashboard/governance" className="p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white transition group">
            <ShieldAlert className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
            <span>Safety & Portal</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Course Manager Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Course & Module Manager
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Subject Creation Form */}
            <form onSubmit={handleCreateCourse} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <p className="text-xs font-mono text-indigo-400 uppercase">➕ Add Custom Course / Subject</p>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Course Title (e.g., Operating Systems)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Code (CS-301)"
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

            {/* Courses List */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-slate-400 uppercase">Available Academic Modules</p>
              {courses.map((course) => (
                <div key={course.id} className="p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                      {course.code}
                    </span>
                    <h4 className="text-xs font-medium text-white mt-1">{course.title}</h4>
                  </div>
                  <button
                    onClick={() => toggleEnrollment(course.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition ${
                      course.enrolled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {course.enrolled ? <><Check className="w-3 h-3" /> Enrolled</> : 'Enroll Now'}
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
