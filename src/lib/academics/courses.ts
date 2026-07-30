import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Course {
  id: string;
  title: string;
  code: string;
  ownerUid: string;
  enrolled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const COURSES_COLLECTION = 'courses';

export async function getCoursesForUser(uid: string): Promise<Course[]> {
  const coursesRef = collection(db, COURSES_COLLECTION);
  const q = query(coursesRef, where('ownerUid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Course, 'id'>),
  }));
}

export async function createCourse(
  uid: string,
  title: string,
  code: string
): Promise<Course> {
  const coursesRef = collection(db, COURSES_COLLECTION);
  const newDocRef = doc(coursesRef);

  const newCourse: Omit<Course, 'id'> = {
    title,
    code: code || 'CUSTOM',
    ownerUid: uid,
    enrolled: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newDocRef, newCourse);

  return { id: newDocRef.id, ...newCourse };
}

export async function toggleCourseEnrollment(
  courseId: string,
  enrolled: boolean
): Promise<void> {
  const courseRef = doc(db, COURSES_COLLECTION, courseId);
  await updateDoc(courseRef, {
    enrolled,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCourse(courseId: string): Promise<void> {
  const courseRef = doc(db, COURSES_COLLECTION, courseId);
  await deleteDoc(courseRef);
}
