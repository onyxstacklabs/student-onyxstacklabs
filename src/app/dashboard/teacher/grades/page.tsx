'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getStudentsForInstitution, InstitutionStudent } from '@/lib/academics/institutionStudents';
import { addGrade } from '@/lib/academics/grades';
import { PageHeader } from '@/components/ui/PageHeader';
import { GraduationCap } from 'lucide-react';

function TeacherGrades() {
  const { user, profile } = useAuth();
  const teacherDetails = profile?.teacherDetails;

  const [selectedClass, setSelectedClass] = useState(teacherDetails?.assignedClasses[0] || '');
  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudentUid, setSelectedStudentUid] = useState('');

  const [subject, setSubject] = useState(teacherDetails?.subjects[0] || '');
  const [assessmentName, setAssessmentName] = useState('');
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!teacherDetails?.institutionId) return;
    let mounted = true;
    setStudentsLoading(true);
    getStudentsForInstitution(teacherDetails.institutionId)
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
  }, [teacherDetails?.institutionId]);

  const classStudents = students.filter((s) => s.className === selectedClass);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!teacherDetails?.institutionId || !selectedStudentUid || !subject.trim() || !assessmentName.trim()) {
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
      await addGrade(teacherDetails.institutionId, selectedStudentUid, subject.trim(), assessmentName.trim(), marks, total);
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
    'w-full bg-surface-base border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-500';
  const labelClass = 'block text-xs font-mono text-slate-400 uppercase mb-2';

  if (!teacherDetails) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-sm text-slate-400">
        Your teacher profile isn't fully set up yet.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <PageHeader icon={GraduationCap} title="Enter Grades" description="Record a student's assessment result." />

      {error && (
        <div className="p-3 bg-accent-danger/10 border border-accent-danger text-accent-danger text-sm rounded-lg">{error}</div>
      )}
      {successMsg && (
        <div className="p-3 bg-accent-success/10 border border-accent-success text-accent-success text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-raised/60 border border-surface-border rounded-card p-6 space-y-4">
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
            {teacherDetails.assignedClasses.map((c) => (
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
            disabled={studentsLoading}
          >
            <option value="">
              {studentsLoading ? 'Loading...' : classStudents.length === 0 ? 'No students in this class' : 'Select student'}
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
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
            {teacherDetails.subjects.length === 0 ? (
              <option value="">No subjects assigned</option>
            ) : (
              teacherDetails.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))
            )}
          </select>
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
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Grade'}
        </button>
      </form>
    </div>
  );
}

export default function TeacherGradesPage() {
  return (
    <ProtectedRoute allowedRoles={['TEACHER']}>
      <TeacherGrades />
    </ProtectedRoute>
  );
}
