import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PlatformStats {
  totalInstitutions: number;
  totalStudents: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const usersRef = collection(db, 'users');

  const institutionsQuery = query(usersRef, where('role', '==', 'INSTITUTION'));
  const studentsQuery = query(usersRef, where('role', '==', 'STUDENT'));

  const [institutionsSnap, studentsSnap] = await Promise.all([
    getCountFromServer(institutionsQuery),
    getCountFromServer(studentsQuery),
  ]);

  return {
    totalInstitutions: institutionsSnap.data().count,
    totalStudents: studentsSnap.data().count,
  };
}
