'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  code: string;
  enrolled: boolean;
  progress: number;
}

interface CourseContextType {
  courses: Course[];
  addCourse: (title: string, code: string) => void;
  toggleEnrollment: (id: string) => void;
}

const defaultCourses: Course[] = [
  { id: '1', title: 'Data Structures & Algorithms', code: 'CS-201', enrolled: true, progress: 45 },
  { id: '2', title: 'Object-Oriented Programming', code: 'CS-102', enrolled: false, progress: 0 },
];

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('onyx_student_courses');
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        setCourses(defaultCourses);
      }
    } else {
      setCourses(defaultCourses);
    }
  }, []);

  const saveAndSetCourses = (updated: Course[]) => {
    setCourses(updated);
    localStorage.setItem('onyx_student_courses', JSON.stringify(updated));
  };

  const addCourse = (title: string, code: string) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title,
      code: code.toUpperCase() || 'CUSTOM',
      enrolled: true,
      progress: 0,
    };
    saveAndSetCourses([newCourse, ...courses]);
  };

  const toggleEnrollment = (id: string) => {
    const updated = courses.map((c) =>
      c.id === id ? { ...c, enrolled: !c.enrolled } : c
    );
    saveAndSetCourses(updated);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse, toggleEnrollment }}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourses must be used within CourseProvider');
  return context;
};
