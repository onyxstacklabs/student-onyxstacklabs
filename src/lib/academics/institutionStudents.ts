import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types/auth';

export interface InstitutionStudent {
  uid: string;
  displayName: string;
  email: string;
  className: string;
  rollNumber: string;
  subjects: string[];
}

export async function getStudentsForInstitution(
  institutionId: string
): Promise<InstitutionStudent[]> {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('role', '==', 'STUDENT'),
    where('studentDetails.institutionId', '==', institutionId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as UserProfile;
    return {
      uid: docSnap.id,
      displayName: data.displayName,
      email: data.email,
      className: data.studentDetails?.className || '',
      rollNumber: data.studentDetails?.rollNumber || '',
      subjects: data.studentDetails?.subjects || [],
    };
  });
}
