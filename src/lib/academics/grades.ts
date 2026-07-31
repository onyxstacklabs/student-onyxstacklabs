import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GradeRecord {
  id: string;
  institutionId: string;
  studentUid: string;
  subject: string;
  assessmentName: string; // e.g., "Midterm", "Quiz 1", "Final"
  marksObtained: number;
  totalMarks: number;
  updatedAt?: Timestamp;
}

const GRADES_COLLECTION = 'grades';

export async function addGrade(
  institutionId: string,
  studentUid: string,
  subject: string,
  assessmentName: string,
  marksObtained: number,
  totalMarks: number
): Promise<void> {
  const gradesRef = collection(db, GRADES_COLLECTION);
  const newDocRef = doc(gradesRef);

  await setDoc(newDocRef, {
    institutionId,
    studentUid,
    subject,
    assessmentName,
    marksObtained,
    totalMarks,
    updatedAt: serverTimestamp(),
  });
}

export async function getGradesForStudent(studentUid: string): Promise<GradeRecord[]> {
  const gradesRef = collection(db, GRADES_COLLECTION);
  const q = query(gradesRef, where('studentUid', '==', studentUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<GradeRecord, 'id'>),
  }));
}

export async function deleteGrade(gradeId: string): Promise<void> {
  const gradeRef = doc(db, GRADES_COLLECTION, gradeId);
  await deleteDoc(gradeRef);
}

/** Simple percentage-based GPA on a 4.0 scale. */
export function calculateGPA(records: GradeRecord[]): number {
  if (records.length === 0) return 0;

  const percentages = records.map((r) => (r.marksObtained / r.totalMarks) * 100);
  const avgPercentage = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;

  // Standard percentage-to-4.0 conversion
  if (avgPercentage >= 90) return 4.0;
  if (avgPercentage >= 80) return 3.7;
  if (avgPercentage >= 70) return 3.3;
  if (avgPercentage >= 60) return 3.0;
  if (avgPercentage >= 50) return 2.5;
  if (avgPercentage >= 40) return 2.0;
  return 1.0;
}

export function calculateOverallPercentage(records: GradeRecord[]): number {
  if (records.length === 0) return 0;
  const percentages = records.map((r) => (r.marksObtained / r.totalMarks) * 100);
  return Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
}
