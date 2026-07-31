import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface InstitutionOption {
  uid: string;
  institutionName: string;
}

export async function listInstitutions(): Promise<InstitutionOption[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'INSTITUTION'));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        institutionName: data?.institutionDetails?.institutionName || 'Unnamed Institution',
      };
    })
    .sort((a, b) => a.institutionName.localeCompare(b.institutionName));
}
