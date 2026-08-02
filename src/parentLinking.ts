import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';

export interface LinkableStudent {
  uid: string;
  displayName: string;
  institutionId: string;
}

export async function findStudentByRollNumber(
  institutionId: string,
  rollNumber: string
): Promise<LinkableStudent | null> {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('role', '==', 'STUDENT'),
    where('studentDetails.institutionId', '==', institutionId),
    where('studentDetails.rollNumber', '==', rollNumber.trim())
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data() as UserProfile;
  return {
    uid: docSnap.id,
    displayName: data.displayName,
    institutionId: data.studentDetails?.institutionId || institutionId,
  };
}
