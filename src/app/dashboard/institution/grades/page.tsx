'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { addGrade } from '@/lib/academics/grades';
import { GraduationCap } from 'lucide-react';

function GradeEntry() {
  const { user, profile } = useAuth();
  const institutionClasses = profile?.institutionDetails?.classes || [];

  const [selectedClass, setSelectedClass] = useState(institutionClasses[0] || '');
  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudentUid, setSelectedStudentUid] = useState('');

  const [subject, setSubject] = useState('');
  const [assessmentName, setAssessmentName] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setStudentsLoading(true);
    getStudentsForInstitution(user.uid)
      .then((data) => {
        if (mounted) setStudents(data);
      })
      .catch(() => {
        if (mounted) setError('Could not load students.');
      })
      .finally(() => {
        if (mounted) setStudentsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const classStudents = students.filter((s) => s.className === selectedClass);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!user?.uid || !selectedStudentUid || !subject.trim() || !assessmentName.trim()) {
      setError('Please fill all required fields.');
      return;
    }

    const marks = Number(marksObtained);
    const total = Number(totalMarks);

    if (!total || marks < 0 || marks > total) {
      setError('Marks obtained must be between 0 and total marks.');
      return;
    }

    setSaving(true);
    try {
      await addGrade(user.uid, selectedStudentUid, subject.trim(), assessmentName.trim(), marks, total);
      setSuccessMsg('Grade recorded successfully.');
      setAssessmentName('');
      setMarksObtained('');
      setTotalMarks('');
    } catch (err) {
      setError('Failed to save grade. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500';
  const labelClass = 'block text-xs font-mono text-slate-400 uppercase mb-2';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Enter Grades</h1>
          <p className="text-sm text-slate-400">Record a student's assessment result.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-lg">{error}</div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className={labelClass}>Class</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedStudentUid('');
            }}
            className={inputClass}
          >
            <option value="">Select class</option>
            {institutionClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Student</label>
          <select
            value={selectedStudentUid}
            onChange={(e) => setSelectedStudentUid(e.target.value)}
            className={inputClass}
            disabled={!selectedClass || studentsLoading}
          >
            <option value="">
              {studentsLoading
                ? 'Loading...'
                : !selectedClass
                ? 'Select a class first'
                : classStudents.length === 0
                ? 'No students in this class'
                : 'Select student'}
            </option>
            {classStudents.map((s) => (
              <option key={s.uid} value={s.uid}>
                {s.displayName} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
            placeholder="e.g., Physics"
          />
        </div>

        <div>
          <label className={labelClass}>Assessment Name</label>
          <input
            type="text"
            value={assessmentName}
            onChange={(e) => setAssessmentName(e.target.value)}
            className={inputClass}
            placeholder="e.g., Midterm Exam"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Marks Obtained</label>
            <input
              type="number"
              min="0"
              value={marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              className={inputClass}
              placeholder="e.g., 85"
            />
          </div>
          <div>
            <label className={labelClass}>Total Marks</label>
            <input
              type="number"
              min="1"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              className={inputClass}
              placeholder="e.g., 100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Grade'}
        </button>
      </form>
    </main>
  );
}

export default function GradesPage() {
  return (
    <ProtectedRoute allowedRoles={['INSTITUTION']}>
      <GradeEntry />
    </ProtectedRoute>
  );
}
