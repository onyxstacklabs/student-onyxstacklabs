'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
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
  Plus, 
  X,
  Check,
  CalendarCheck,
  GraduationCap,
  CalendarClock,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
}

function StudentOverview() {
  const { user, profile } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [courseError, setCourseError] = useState('');

  const [notes] = useState<Note[]>([]);
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
      <PageHeader
        title={`Good day, ${profile?.displayName || user?.email?.split('@')[0] || 'Student'}! 👋`}
        description="Here's your academic overview and workspace summary."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-brand-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Manage Courses
          </button>
        }
      />

      {courseError && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">
          {courseError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard
          label="Enrolled Courses"
          value={coursesLoading ? '—' : activeEnrolledCount}
          unit="Courses"
          icon={BookOpen}
          tone="brand"
          loading={coursesLoading}
          onClick={() => setIsModalOpen(true)}
          subtext={activeEnrolledCount === 0 ? 'No courses joined' : `${activeEnrolledCount} modules active`}
        />
        <a href="/dashboard/ai-assistant" className="block">
          <StatCard
            label="Hours Learned"
            value={coursesLoading ? '—' : estimatedHours}
            unit="hrs"
            icon={Clock}
            tone="warning"
            loading={coursesLoading}
            subtext="Track study metrics"
          />
        </a>
        <a href="/dashboard/notes" className="block">
          <StatCard label="Saved Notes" value={notes.length} unit="Documents" icon={FileText} tone="success" subtext="Access notes workspace" />
        </a>
        <a href="/dashboard/attendance" className="block">
          <StatCard label="Attendance" value="View" icon={CalendarCheck} tone="danger" subtext="Check your record" />
        </a>
        <a href="/dashboard/grades" className="block">
          <StatCard label="Grades" value="View" icon={GraduationCap} tone="info" subtext="Check your GPA" />
        </a>
        <a href="/dashboard/timetable" className="block">
          <StatCard label="Timetable" value="View" icon={CalendarClock} tone="brand" subtext="See your schedule" />
        </a>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-raised border border-surface-border rounded-card w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-border pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                Manage Courses
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-surface-base/50 hover:bg-surface-base transition"
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
                  className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400">Course Code (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g., CS-402"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-brand-600/20 disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add & Enroll Course'}
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-surface-border">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Your Enrolled Courses</h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {coursesLoading ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Loading courses...</p>
                ) : courses.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No courses added yet.</p>
                ) : (
                  courses.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-surface-base border border-surface-border rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-white">{c.title}</p>
                        <span className="text-[10px] font-mono text-brand-400">{c.code}</span>
                      </div>
                      <button
                        onClick={() => toggleEnrollment(c.id, c.enrolled)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          c.enrolled 
                            ? 'bg-accent-success/10 text-accent-success border border-accent-success/20' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {c.enrolled ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Enrolled</span> : 'Join'}
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

export default function OverviewPage() {
  return (
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <StudentOverview />
    </ProtectedRoute>
  );
}
